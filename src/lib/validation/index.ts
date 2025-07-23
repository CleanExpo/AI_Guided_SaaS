import { z } from 'zod';// Core schemas
export const _ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string()})
  ),
  model: z.string().optional(),
    maxTokens: z.number().optional(),
    temperature: z.number().optional(),
    projectId: z.string().optional()});
export const _ChatResponseSchema = z.object({
  message: z.string(),
    metadata: z
    .object({
      model: z.string(),
    tokens: z.number().optional(),
    agentType: z.string().optional()})
    .optional()});
export const _CreateProjectSchema = z.object({
  name: z.string().min(3).max(50),
    type: z.enum(['web', 'mobile', 'desktop', 'api', 'fullstack']),
  framework: z.string(),
    features: z.array(z.string()),
    description: z.string().optional(),
    requirements: z.string().optional()});
// Basic validation schemas
export const _emailSchema = z.string().email();
export const _urlSchema = z.string().url();
export const _uuidSchema = z.string().uuid();
// Decorators
export * from './decorators';
// Agent-specific schemas
export * from './agent-schemas';
// Schema exports
export * from './schemas';
// Re-export Zod for convenience
export { z };
// Utility functions
export function validateSafe<T>(,;
    schema: z.ZodType<T>,
    data: unknown
): { success: true, data: T } | { success: false, error: z.ZodError } {
  const result = schema.safeParse(data);
  if(result.success) {
    return { success: true, data: result.data };
    } else {
    return { success: false, error: result.error };
}
}