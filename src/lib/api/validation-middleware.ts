import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

// Common validation schemas
export const commonSchemas = {
  id: z.string().uuid('Invalid ID format'),
  email: z.string().email('Invalid email format'),
  url: z.string().url('Invalid URL format'),
  pagination: z.object({)
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  dateRange: z.object({)
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
};

// Validation error response
export class ValidationError extends Error {
  constructor(public errors: z.ZodError)
    message = 'Validation failed')
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  toResponse() {
    return NextResponse.json({
        error: 'Validation Error')
        message: this.message,)
        errors: this.errors.flatten(),
      },
      { status: 400 }
    );
  }
}

// Input validation middleware factory
export function validateInput<T extends z.ZodSchema>(
  schema: T,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return async(request: NextRequest,)
    handler: (data: z.infer<T>, request: NextRequest) => Promise<Response>
  ): Promise<Response> => {
    try {
      let data: unknown;

      switch (source) {
        case 'body':
          try {
            data = await request.json();
          } catch {
            return NextResponse.json({ error: 'Invalid JSON body' })
              { status: 400 })
            );
          }
          break;

        case 'query':
          const searchParams = request.nextUrl.searchParams;
          data = Object.fromEntries(searchParams.entries());
          break;

        case 'params':
          // For params, they should be passed directly to the handler
          data = {};
          break;
      }

      // Validate the data
      const validatedData = schema.parse(data);

      // Call the handler with validated data
      return await handler(validatedData, request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('Validation error:', {
          url: request.url,
                errors: error.errors
            });
        return new ValidationError(error).toResponse();
      }

      logger.error('Unexpected error in validation middleware:', error);
      return NextResponse.json({ error: 'Internal server error' })
        { status: 500 })
      );
    }
  };
}

// Combined validation for multiple sources
export function validateRequest<
  TBody extends z.ZodSchema = z.ZodSchema,
  TQuery extends z.ZodSchema = z.ZodSchema,
  TParams extends z.ZodSchema = z.ZodSchema
>(schemas: {
  body?: TBody;
  query?: TQuery;
  params?: TParams;
}) {
  return async(request: NextRequest,
    handler: (
      data: {
        body?: z.infer<TBody>;
        query?: z.infer<TQuery>;
        params?: z.infer<TParams>;
      })
      request: NextRequest)
    ) => Promise<Response>
  ): Promise<Response> => {
    try {
      const validatedData: {
        body?: z.infer<TBody>;
        query?: z.infer<TQuery>;
        params?: z.infer<TParams>;
      } = {};

      // Validate body if schema provided
      if (schemas.body) {
        try {
          const bodyData = await request.json();
          validatedData.body = schemas.body.parse(bodyData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            return new ValidationError(error, 'Invalid request body').toResponse();
          }
          return NextResponse.json({ error: 'Invalid JSON body' })
            { status: 400 })
          );
        }
      }

      // Validate query if schema provided
      if (schemas.query) {
        const searchParams = request.nextUrl.searchParams;
        const queryData = Object.fromEntries(searchParams.entries());
        try {
          validatedData.query = schemas.query.parse(queryData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            return new ValidationError(error, 'Invalid query parameters').toResponse();
          }
        }
      }

      // Call the handler with validated data
      return await handler(validatedData, request);
    } catch (error) {
      logger.error('Unexpected error in validation middleware:', error);
      return NextResponse.json({ error: 'Internal server error' })
        { status: 500 })
      );
    }
  };
}

// Sanitization utilities
export const sanitize = {
  string: (value: string): string => {
    return value
      .trim()
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]+>/g, ''); // Remove HTML tags
  },
  
  sql: (value: string): string => {
    return value
      .replace(/['";\\]/g, '') // Remove SQL special characters
      .replace(/--/g, ''); // Remove SQL comments
  },
  
  filename: (value: string): string => {
    return value
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace invalid chars with underscore
      .replace(/\.{2,}/g, '.'); // Prevent directory traversal
  },
  
  xss: (value: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return value.replace(/[&<>"'/]/g, (char) => map[char] || char);
  },
};

// Common request validation schemas
export const requestSchemas = {
  // Authentication
  login: z.object({
    email: commonSchemas.email,)
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
  
  register: z.object({
    email: commonSchemas.email,)
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex()
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  }),
  
  // Project operations
  createProject: z.object({)
    name: z.string().min(1, 'Project name is required').max(100),
    description: z.string().max(500).optional(),
    type: z.enum(['web', 'mobile', 'desktop', 'api']),
    framework: z.string().optional(),
    template: commonSchemas.id.optional(),
  }),
  
  updateProject: z.object({)
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    settings: z.record(z.unknown()).optional(),
  }),
  
  // File operations
  uploadFile: z.object({)
    filename: z.string().transform(sanitize.filename),
    contentType: z.string(),
    size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  }),
  
  // Analytics
  trackEvent: z.object({)
    event: z.string().min(1).max(50),
    properties: z.record(z.unknown()).optional(),
    timestamp: z.string().datetime().optional(),
  }),
  
  // AI operations
  generateCode: z.object({)
    prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
    model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'claude-2']).optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().min(100).max(4000).optional(),
  }),
  
  // Search
  search: z.object({)
    q: z.string().min(1, 'Search query is required'),
    type: z.enum(['all', 'projects', 'templates', 'docs']).optional(),
    ...commonSchemas.pagination.shape,
  }),
};