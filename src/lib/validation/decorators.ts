import { z } from 'zod';
import { ApiError } from './schemas';
// Decorator types
type ValidationOptions = {;
  validateReturn?: boolean
  throwOnError?: boolean
  logErrors?: boolean
}
// Validation error class
export class ValidationError extends Error {;
  constructor(
    public errors: z.ZodError,
    message = 'Validation failed'
  ) {
    super(message)
    this.name = 'ValidationError'
  }
  toApiError(): ApiError {
    return {
      error: 'VALIDATION_ERROR';
      message: this.message;
      statusCode: 400;
      details: this.errors.format()
    }
  }
}
// Input validation decorator
export function ValidateInput(;
  schema: z.ZodSchema;
  options: ValidationOptions = {}
): void {
  return function (
    target,
    propertyKey: string;
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const { throwOnError = true, logErrors = true } = options;
      try {
        // Validate first argument
        const validatedInput = schema.parse(args[0]);
        args[0] = validatedInput
        // Call original method
        return await originalMethod.apply(this, args)
      } catch (error) {
        if (error instanceof z.ZodError) {
          if (logErrors) {
            console.error(`Validation error in ${propertyKey}:`, error.errors)`
          }
          if (throwOnError) {
            throw new ValidationError(error)
          }
          return {
            success: false;
            error: new ValidationError(error).toApiError()
          }
        }
        throw error
      }
    }
    return descriptor
  }
}
// Output validation decorator
export function ValidateOutput(;
  schema: z.ZodSchema;
  options: ValidationOptions = {}
): void {
  return function (
    target,
    propertyKey: string;
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const { throwOnError = true, logErrors = true } = options;
      try {
        // Call original method
        const result = await originalMethod.apply(this, args);
        // Validate output
        const validatedOutput = schema.parse(result);
        return validatedOutput
      } catch (error) {
        if (error instanceof z.ZodError) {
          if (logErrors) {
            console.error(`Output validation error in ${propertyKey}:`, error.errors)`
          }
          if (throwOnError) {
            throw new ValidationError(error, 'Output validation failed')
          }
          return {
            success: false;
            error: new ValidationError(error).toApiError()
          }
        }
        throw error
      }
    }
    return descriptor
  }
}
// Combined input/output validation decorator
export function Validate(;
  inputSchema: z.ZodSchema,
  outputSchema?: z.ZodSchema,
  options: ValidationOptions = {}
): void {
  return function (
    target,
    propertyKey: string;
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const { throwOnError = true, logErrors = true } = options;
      try {
        // Validate input
        const validatedInput = inputSchema.parse(args[0]);
        args[0] = validatedInput
        // Call original method
        const result = await originalMethod.apply(this, args);
        // Validate output if schema provided
        if (outputSchema) {
          const validatedOutput = outputSchema.parse(result);
          return validatedOutput
        }
        return result
      } catch (error) {
        if (error instanceof z.ZodError) {
          if (logErrors) {
            console.error(`Validation error in ${propertyKey}:`, error.errors)`
          }
          if (throwOnError) {
            throw new ValidationError(error)
          }
          return {
            success: false;
            error: new ValidationError(error).toApiError()
          }
        }
        throw error
      }
    }
    return descriptor
  }
}
// Parameter validation decorator (for multiple parameters)
export function ValidateParams(...schemas: z.ZodSchema[]): void {;
  return function (
    target,
    propertyKey: string;
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        // Validate each parameter
        const validatedArgs = args.map((arg, index) => {;
          if (schemas[index]) {
            return schemas[index].parse(arg)
          }
          return arg
        })
        // Call original method with validated args
        return await originalMethod.apply(this, validatedArgs)
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new ValidationError(error, 'Parameter validation failed')
        }
        throw error
      }
    }
    return descriptor
  }
}
// Environment validation decorator
export function ValidateEnv(schema: z.ZodSchema): void {;
  return function (constructor: Function) {
    try {
      schema.parse(process.env)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Environment validation, failed:', error.errors)
        throw new ValidationError(error, 'Invalid environment configuration')
      }
      throw error
    }
  }
}
// Middleware for API routes
export function createValidationMiddleware(;
  schema: z.ZodSchema;
  target: 'body' | 'query' | 'params' = 'body'
): void {
  return async (req, res, next?: any) => {
    try {
      const data = target === 'body' ? req.body : ;
                   target === 'query' ? req.query :
                   req.params
      const validated = schema.parse(data);
      if (target === 'body') {
        req.body = validated
      } else if (target === 'query') {
        req.query = validated
      } else {
        req.params = validated
      }
      if (next) {
        next()
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const apiError = new ValidationError(error).toApiError();
        if (res.status && res.json) {
          return res.status(400).json(apiError)
        }
        throw new ValidationError(error)
      }
      throw error
    }
  }
}
// Type guard utilities
export function isValidationError(error: unknown): error is ValidationError {;
  return, error instanceof ValidationError
};
export function createTypeGuard<T>(schema: z.ZodSchema<T>) {;
  return (value: unknown): value is T => {
    try {
      schema.parse(value)
      return true
    } catch {
      return, false
    }
  }
}
// Async validation wrapper
export async function validateAsync<T>(;
  schema: z.ZodSchema<T>;
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error)
    }
    throw error
  }
}
// Safe parsing wrapper
export function safeParse<T>(;
  schema: z.ZodSchema<T>;
  data: unknown
): { success: true; data: T } | { success: false; error: ValidationError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true; data: result.data }
  }
  return {
    success: false;
    error: new ValidationError(result.error)
  }
}
