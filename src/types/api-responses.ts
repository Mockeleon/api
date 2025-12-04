import { z } from '@hono/zod-openapi';

/**
 * Standard error response schema used across all API endpoints
 * Used for 400, 404, 429, 500, etc.
 */
export const ErrorResponseSchema = z
  .object({
    status: z.literal('error'),
    message: z.string(),
    errorId: z.string().uuid().optional(),
    errors: z
      .array(
        z.object({
          code: z.string().optional(),
          message: z.string(),
          path: z.array(z.union([z.string(), z.number()])).optional(),
          expected: z.string().optional(),
          received: z.string().optional(),
        })
      )
      .optional(),
  })
  .openapi('ErrorResponse');

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
