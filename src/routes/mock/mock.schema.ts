import { z } from '@hono/zod-openapi';

import { SchemaSchema } from '../../schema/index.js';

export const MOCK_TAG = 'Mock';
export const MOCK_SUMMARY = 'Generate mock data';

export const RequestBodySchema = z
  .object({
    schema: SchemaSchema.openapi({
      description: 'Field definitions for fake data generation',
      examples: [
        {
          id: { dataType: 'int', min: 1, max: 1000 },
          name: { dataType: 'name', lang: 'en', format: 'full' },
          email: {
            dataType: 'email',
            basedOn: 'name',
            domains: ['@company.com', '@startup.io'],
          },
        },
        {
          bio: {
            dataType: 'string',
            kind: 'sentence',
            nullable: true,
            nullableRate: 0.1,
          },
          tags: {
            dataType: 'array',
            count: 5,
            item: { dataType: 'string', kind: 'word' },
          },
        },
        {
          users: {
            dataType: 'array',
            count: 10,
            item: {
              dataType: 'object',
              fields: {
                id: { dataType: 'int', min: 1, max: 10000 },
                profile: {
                  dataType: 'object',
                  fields: {
                    name: { dataType: 'name', format: 'full' },
                    age: { dataType: 'int', min: 18, max: 65 },
                  },
                },
              },
            },
          },
        },
      ],
    }),
    count: z.number().int().positive().default(1).optional().openapi({
      description: 'Number of records to generate',
      example: 10,
    }),
  })
  .strict()
  .openapi('MockRequest');

export const MockResponseSchema = z
  .array(z.record(z.string(), z.unknown()))
  .openapi({
    examples: [
      [
        {
          id: 123,
          name: 'John Smith',
          email: 'john.smith@example.com',
        },
        {
          id: 456,
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
        },
      ],
    ],
    description: 'Generated mock data array',
  });
