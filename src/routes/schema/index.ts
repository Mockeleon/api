import { OpenAPIHono } from '@hono/zod-openapi';

import { schemaMetadata } from './schema-metadata.js';
import { schemaRoute } from './schema.route.js';

const schemaRouter = new OpenAPIHono();

schemaRouter.openapi(schemaRoute, (c) => {
  return c.json({ fields: schemaMetadata });
});

export { schemaRouter };
