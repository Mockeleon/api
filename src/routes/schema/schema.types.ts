import type { z } from '@hono/zod-openapi';

import { type APISchemaResponseSchema } from './schema.schema.js';

export type APISchemaResponse = z.infer<typeof APISchemaResponseSchema>;
