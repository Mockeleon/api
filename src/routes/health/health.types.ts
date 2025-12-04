import type { z } from '@hono/zod-openapi';

import { type HealthResponseSchema } from './health.schema.js';

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
