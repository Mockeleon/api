import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../utils';

describe('Mockeleon API - Validation & Limits', () => {
  const app = setupTestApp();

  describe('Schema Field Limit', () => {
    it('should reject schema with more than 200 fields', async () => {
      // Create a schema with 201 fields
      const schema: Record<string, { dataType: string }> = {};
      for (let i = 1; i <= 201; i++) {
        schema[`field${i}`] = { dataType: 'int' };
      }

      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema,
          count: 1,
        }),
      });

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toContain('201 fields');
      expect(body.message).toContain('200');
    });

    it('should accept schema with exactly 200 fields', async () => {
      // Create a schema with exactly 200 fields
      const schema: Record<string, { dataType: string }> = {};
      for (let i = 1; i <= 200; i++) {
        schema[`field${i}`] = { dataType: 'int' };
      }

      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema,
          count: 1,
        }),
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });

    it('should count nested object fields in total', async () => {
      // Create schema with nested objects that exceed 200 total fields
      const nestedSchema: Record<string, { dataType: string }> = {};
      for (let i = 1; i <= 100; i++) {
        nestedSchema[`nested${i}`] = { dataType: 'int' };
      }

      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: {
            field1: { dataType: 'int' },
            field2: { dataType: 'int' },
            // This nested object adds 100 more fields (total: 102)
            user: {
              dataType: 'object',
              fields: nestedSchema,
            },
            // Add 99 more fields to reach 201 total
            ...Object.fromEntries(
              Array.from({ length: 99 }, (_, i) => [
                `extraField${i + 1}`,
                { dataType: 'int' },
              ])
            ),
          },
          count: 1,
        }),
      });

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toContain('fields');
      expect(body.message).toContain('200');
    });
  });

  describe('Total Items Limit', () => {
    it('should reject schema that would generate more than 10,000 items', async () => {
      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: {
            items: {
              dataType: 'array',
              count: 1000,
              item: {
                dataType: 'array',
                count: 20, // 1000 * 20 = 20,000 items > 10,000
                item: { dataType: 'int' },
              },
            },
          },
          count: 1,
        }),
      });

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toContain('20000');
      expect(body.message).toContain('10000');
      expect(body.message).toContain('items');
    });

    it('should reject when count parameter exceeds limit', async () => {
      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: {
            items: {
              dataType: 'array',
              count: 100,
              item: { dataType: 'int' },
            },
          },
          count: 150, // 100 * 150 = 15,000 items > 10,000
        }),
      });

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toContain('15000');
      expect(body.message).toContain('10000');
    });

    it('should accept schema with exactly 10,000 items', async () => {
      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: {
            items: {
              dataType: 'array',
              count: 100,
              item: {
                dataType: 'array',
                count: 100, // 100 * 100 = 10,000 exactly
                item: { dataType: 'int' },
              },
            },
          },
          count: 1,
        }),
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });

    it('should calculate total items correctly with nested structures', async () => {
      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: {
            users: {
              dataType: 'array',
              count: 50,
              item: {
                dataType: 'object',
                fields: {
                  id: { dataType: 'int' },
                  posts: {
                    dataType: 'array',
                    count: 300, // 50 * 300 = 15,000 > 10,000
                    item: { dataType: 'string', kind: 'word' },
                  },
                },
              },
            },
          },
          count: 1,
        }),
      });

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toContain('items');
    });
  });

  describe('Valid Complex Schemas', () => {
    it('should accept complex schema within limits', async () => {
      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: {
            id: { dataType: 'int' },
            name: { dataType: 'name' },
            email: { dataType: 'email' },
            profile: {
              dataType: 'object',
              fields: {
                bio: { dataType: 'string', kind: 'sentence' },
                age: { dataType: 'int' },
                tags: {
                  dataType: 'array',
                  count: 10,
                  item: { dataType: 'string', kind: 'word' },
                },
              },
            },
            posts: {
              dataType: 'array',
              count: 20,
              item: {
                dataType: 'object',
                fields: {
                  title: { dataType: 'string', kind: 'sentence' },
                  content: { dataType: 'string', kind: 'paragraph' },
                },
              },
            },
          },
          count: 10, // Total fields: 10, Total items: reasonable
        }),
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(10);
    });
  });
});
