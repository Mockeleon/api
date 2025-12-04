import type { z } from '@hono/zod-openapi';

import { type MockResponseSchema, type RequestBodySchema } from './mock.schema.js';

export type MockRequest = z.infer<typeof RequestBodySchema>;
export type MockResponse = z.infer<typeof MockResponseSchema>;
