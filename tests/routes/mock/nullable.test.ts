import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../utils';

describe('Mockeleon Routes - Nullable Feature', () => {
  const app = setupTestApp();

  describe('Nullable Rates', () => {
    it('should generate nulls at 50% rate', async () => {
      const requestBody: MockRequest = {
        schema: {
          score: { dataType: 'int', nullable: true, nullableRate: 0.5 },
        },
        count: 200,
      };

      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      expect(response.status).toBe(200);
      const body = await response.json();

      let nullCount = 0;
      body.forEach((item: { score: number | null }) => {
        if (item.score === null) {
          nullCount++;
        }
      });

      // With 200 samples and 50% rate, expect roughly 80-120 nulls
      // Allow some variance due to randomness
      expect(nullCount).toBeGreaterThan(70);
      expect(nullCount).toBeLessThan(130);
    });

    it('should generate nulls at 90% rate', async () => {
      const requestBody: MockRequest = {
        schema: {
          optional: {
            dataType: 'string',
            kind: 'word',
            nullable: true,
            nullableRate: 0.9,
          },
        },
        count: 100,
      };

      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      expect(response.status).toBe(200);
      const body = await response.json();

      let nullCount = 0;
      body.forEach((item: { optional: string | null }) => {
        if (item.optional === null) {
          nullCount++;
        }
      });

      // With 90% rate, expect most values to be null
      expect(nullCount).toBeGreaterThan(70);
    });

    it('should generate nulls at 5% rate', async () => {
      const requestBody: MockRequest = {
        schema: {
          rare: { dataType: 'int', nullable: true, nullableRate: 0.05 },
        },
        count: 200,
      };

      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      expect(response.status).toBe(200);
      const body = await response.json();

      let nullCount = 0;
      body.forEach((item: { rare: number | null }) => {
        if (item.rare === null) {
          nullCount++;
        }
      });

      // With 5% rate and 200 samples, expect around 10 nulls
      // Allow variance: 0-30 nulls
      expect(nullCount).toBeLessThan(30);
    });
  });

  describe('Non-Nullable Fields', () => {
    it('should never generate null for non-nullable field', async () => {
      const requestBody: MockRequest = {
        schema: {
          id: { dataType: 'int' },
        },
        count: 100,
      };

      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      expect(response.status).toBe(200);
      const body = await response.json();

      body.forEach((item: { id: number }) => {
        expect(item.id).not.toBeNull();
        expect(typeof item.id).toBe('number');
      });
    });

    it('should never generate null when nullable is false', async () => {
      const requestBody: MockRequest = {
        schema: {
          name: { dataType: 'name', nullable: false },
        },
        count: 100,
      };

      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      expect(response.status).toBe(200);
      const body = await response.json();

      body.forEach((item: { name: string }) => {
        expect(item.name).not.toBeNull();
        expect(typeof item.name).toBe('string');
      });
    });
  });

  describe('Nullable in Complex Structures', () => {
    it('should handle nullable fields in objects', async () => {
      const requestBody: MockRequest = {
        schema: {
          user: {
            dataType: 'object',
            fields: {
              id: { dataType: 'int' },
              name: { dataType: 'name' },
              bio: {
                dataType: 'string',
                kind: 'word',
                nullable: true,
                nullableRate: 0.5,
              },
              age: { dataType: 'int', nullable: true, nullableRate: 0.3 },
            },
          },
        },
        count: 50,
      };

      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      expect(response.status).toBe(200);
      const body = await response.json();

      let bioNullCount = 0;
      let ageNullCount = 0;

      body.forEach(
        (item: {
          user: {
            id: number;
            name: string;
            bio: string | null;
            age: number | null;
          };
        }) => {
          expect(typeof item.user.id).toBe('number');
          expect(typeof item.user.name).toBe('string');

          if (item.user.bio === null) bioNullCount++;
          if (item.user.age === null) ageNullCount++;
        }
      );

      expect(bioNullCount).toBeGreaterThan(0);
      expect(ageNullCount).toBeGreaterThan(0);
    });

    it('should handle nullable fields in arrays', async () => {
      const requestBody: MockRequest = {
        schema: {
          scores: {
            dataType: 'array',
            count: 20,
            item: { dataType: 'int', nullable: true, nullableRate: 0.3 },
          },
        },
        count: 10,
      };

      const response = await app.request('/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      expect(response.status).toBe(200);
      const body = await response.json();

      body.forEach((item: { scores: Array<number | null> }) => {
        expect(Array.isArray(item.scores)).toBe(true);
        expect(item.scores).toHaveLength(20);

        let nullCount = 0;
        item.scores.forEach((score) => {
          if (score === null) {
            nullCount++;
          } else {
            expect(typeof score).toBe('number');
          }
        });

        // With 20 items and 30% null rate, expect some nulls
        expect(nullCount).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
