// Core schemas
export * from './schemas'

// Decorators
export * from './decorators'

// Agent-specific schemas
export * from './agent-schemas'

// Re-export Zod for convenience
export { z } from 'zod'

// Utility functions
import { z } from 'zod'
import { ValidationError } from './decorators'

/**
 * Validate data against a schema and throw ValidationError on failure
 */
export function validateOrThrow<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  message?: string
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error, message)
    }
    throw error
  }
}

/**
 * Validate data against a schema and return a result object
 */
export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: ValidationError } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: new ValidationError(error) }
    }
    throw error
  }
}

/**
 * Create a validated function that automatically validates input and output
 */
export function createValidatedFunction<TInput, TOutput>(
  inputSchema: z.ZodSchema<TInput>,
  outputSchema: z.ZodSchema<TOutput>,
  fn: (input: TInput) => TOutput | Promise<TOutput>
): (input: unknown) => Promise<TOutput> {
  return async (input: unknown) => {
    // Validate input
    const validatedInput = validateOrThrow(inputSchema, input, 'Invalid input')
    
    // Execute function
    const result = await fn(validatedInput)
    
    // Validate output
    return validateOrThrow(outputSchema, result, 'Invalid output')
  }
}

/**
 * Create a type-safe API handler with automatic validation
 */
export function createValidatedApiHandler<TInput, TOutput>(
  inputSchema: z.ZodSchema<TInput>,
  outputSchema: z.ZodSchema<TOutput>,
  handler: (input: TInput) => Promise<TOutput>
) {
  return async (req: Request): Promise<Response> => {
    try {
      // Parse request body
      const body = await req.json()
      
      // Validate input
      const validatedInput = validateOrThrow(inputSchema, body)
      
      // Execute handler
      const result = await handler(validatedInput)
      
      // Validate output
      const validatedOutput = validateOrThrow(outputSchema, result)
      
      // Return success response
      return new Response(JSON.stringify(validatedOutput), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return new Response(JSON.stringify(error.toApiError()), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      console.error('API handler error:', error)
      return new Response(JSON.stringify({
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        statusCode: 500
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

/**
 * Merge multiple schemas into one
 */
export function mergeSchemas<T extends z.ZodRawShape>(
  ...schemas: z.ZodObject<any>[]
): z.ZodObject<T> {
  return schemas.reduce((acc, schema) => {
    return acc.merge(schema)
  })
}

/**
 * Create a partial version of a schema (all fields optional)
 */
export function partialSchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): z.ZodObject<{ [K in keyof T]: z.ZodOptional<T[K]> }> {
  return schema.partial()
}

/**
 * Create a strict version of a schema (no extra properties allowed)
 */
export function strictSchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): z.ZodObject<T> {
  return schema.strict()
}

/**
 * Environment variable validation helper
 */
export function validateEnv<T>(schema: z.ZodSchema<T>): T {
  try {
    return schema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:')
      error.errors.forEach(err => {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      })
      throw new Error('Invalid environment configuration')
    }
    throw error
  }
}

/**
 * Create a schema from a TypeScript type (for runtime validation)
 */
export function schemaFromType<T>() {
  return <TSchema extends z.ZodSchema<T>>(schema: TSchema) => schema
}

/**
 * Common validation patterns
 */
export const patterns = {
  // UUID v4
  uuid: z.string().uuid(),
  
  // Email
  email: z.string().email(),
  
  // URL
  url: z.string().url(),
  
  // ISO date string
  isoDate: z.string().datetime(),
  
  // Positive integer
  positiveInt: z.number().int().positive(),
  
  // Non-empty string
  nonEmptyString: z.string().min(1),
  
  // Phone number (basic)
  phoneNumber: z.string().regex(/^\+?[\d\s-()]+$/),
  
  // Hex color
  hexColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  
  // Slug
  slug: z.string().regex(/^[a-z0-9-]+$/),
  
  // Semantic version
  semver: z.string().regex(/^\d+\.\d+\.\d+(-[\w.]+)?$/),
  
  // JSON string
  jsonString: z.string().transform((str) => {
    try {
      return JSON.parse(str)
    } catch {
      throw new Error('Invalid JSON string')
    }
  })
}