import { z } from 'zod';

export const AgentResultSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  metadata: z.record(z.any()).optional()});

export const AgentTaskSchema = z.object({
  id: z.string(),
  type: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  payload: z.any(),
  dependencies: z.array(z.string()).optional(),
  timeout: z.number().optional()});

export const AgentConfigSchema = z.object({
  agent_id: z.string(),
  name: z.string(),
  version: z.string(),
  role: z.string(),
  capabilities: z.array(z.string()),
  priority: z.number()});
