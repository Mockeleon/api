import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Array Field Generation', () => {
  const app = setupTestApp();

  it('should generate arrays with primitive items (int)', async () => {
    const requestBody: MockRequest = {
      schema: {
        scores: {
          dataType: 'array',
          item: { dataType: 'int', min: 0, max: 100 },
          count: 5,
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

    body.forEach((item: { scores: number[] }) => {
      expect(Array.isArray(item.scores)).toBe(true);
      expect(item.scores.length).toBe(5);

      item.scores.forEach((score) => {
        expect(typeof score).toBe('number');
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  it('should generate arrays with string items', async () => {
    const requestBody: MockRequest = {
      schema: {
        tags: {
          dataType: 'array',
          item: { dataType: 'string', kind: 'word' },
          count: 3,
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

    body.forEach((item: { tags: string[] }) => {
      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags.length).toBe(3);

      item.tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });
    });
  });

  it('should generate arrays with email items', async () => {
    const requestBody: MockRequest = {
      schema: {
        contacts: {
          dataType: 'array',
          item: { dataType: 'email' },
          count: 3,
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

    body.forEach((item: { contacts: string[] }) => {
      expect(Array.isArray(item.contacts)).toBe(true);
      expect(item.contacts.length).toBe(3);

      item.contacts.forEach((email) => {
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  it('should generate arrays with object items', async () => {
    const requestBody: MockRequest = {
      schema: {
        users: {
          dataType: 'array',
          item: {
            dataType: 'object',
            fields: {
              id: { dataType: 'int' },
              name: { dataType: 'name', format: 'full' },
            },
          },
          count: 3,
        },
      },
      count: 5,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    body.forEach((item: { users: Array<{ id: number; name: string }> }) => {
      expect(Array.isArray(item.users)).toBe(true);
      expect(item.users.length).toBe(3);

      item.users.forEach((user) => {
        expect(typeof user.id).toBe('number');
        expect(typeof user.name).toBe('string');
        expect(user.name.length).toBeGreaterThan(0);
      });
    });
  });

  it('should respect array count', async () => {
    const requestBody: MockRequest = {
      schema: {
        items: {
          dataType: 'array',
          item: { dataType: 'int' },
          count: 7,
        },
      },
      count: 20,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    body.forEach((item: { items: number[] }) => {
      expect(item.items.length).toBe(7);
    });
  });

  it('should handle nullable array fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        optionalList: {
          dataType: 'array',
          item: { dataType: 'int' },
          count: 3,
          nullable: true,
          nullableRate: 0.5,
        },
      },
      count: 40,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    const nullCount = body.filter(
      (item: { optionalList: number[] | null }) => item.optionalList === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);

    // Check non-null arrays have correct count
    body.forEach((item: { optionalList: number[] | null }) => {
      if (item.optionalList !== null) {
        expect(item.optionalList.length).toBe(3);
      }
    });
  });

  it('should generate arrays with various data types', async () => {
    const requestBody: MockRequest = {
      schema: {
        ids: {
          dataType: 'array',
          item: { dataType: 'uuid' },
          count: 3,
        },
        prices: {
          dataType: 'array',
          item: { dataType: 'float', min: 10, max: 100 },
          count: 4,
        },
        flags: {
          dataType: 'array',
          item: { dataType: 'boolean' },
          count: 5,
        },
      },
      count: 5,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    body.forEach(
      (item: { ids: string[]; prices: number[]; flags: boolean[] }) => {
        expect(Array.isArray(item.ids)).toBe(true);
        expect(Array.isArray(item.prices)).toBe(true);
        expect(Array.isArray(item.flags)).toBe(true);

        expect(item.ids.length).toBe(3);
        expect(item.prices.length).toBe(4);
        expect(item.flags.length).toBe(5);

        item.ids.forEach((id) => {
          expect(id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          );
        });

        item.prices.forEach((price) => {
          expect(price).toBeGreaterThanOrEqual(10);
          expect(price).toBeLessThanOrEqual(100);
        });

        item.flags.forEach((flag) => {
          expect(typeof flag).toBe('boolean');
        });
      }
    );
  });

  it('should pick random items from predefined data array', async () => {
    const requestBody: MockRequest = {
      schema: {
        colors: {
          dataType: 'array',
          data: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
          pickCount: 3,
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

    const validColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

    body.forEach((item: { colors: string[] }) => {
      expect(Array.isArray(item.colors)).toBe(true);
      expect(item.colors.length).toBe(3);

      // All items should be from the predefined list
      item.colors.forEach((color) => {
        expect(validColors).toContain(color);
      });

      // Items should be unique (no duplicates when picking)
      const uniqueColors = new Set(item.colors);
      expect(uniqueColors.size).toBe(3);
    });
  });

  it('should pick random items from numeric data array', async () => {
    const requestBody: MockRequest = {
      schema: {
        luckyNumbers: {
          dataType: 'array',
          data: [7, 13, 21, 42, 99],
          pickCount: 2,
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

    const validNumbers = [7, 13, 21, 42, 99];

    body.forEach((item: { luckyNumbers: number[] }) => {
      expect(Array.isArray(item.luckyNumbers)).toBe(true);
      expect(item.luckyNumbers.length).toBe(2);

      item.luckyNumbers.forEach((num) => {
        expect(validNumbers).toContain(num);
      });

      // Should be unique
      const uniqueNumbers = new Set(item.luckyNumbers);
      expect(uniqueNumbers.size).toBe(2);
    });
  });

  it('should handle pickCount equal to data length', async () => {
    const requestBody: MockRequest = {
      schema: {
        allItems: {
          dataType: 'array',
          data: ['a', 'b', 'c'],
          pickCount: 3,
        },
      },
      count: 5,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    body.forEach((item: { allItems: string[] }) => {
      expect(item.allItems.length).toBe(3);
      // Should contain all items
      expect(item.allItems).toContain('a');
      expect(item.allItems).toContain('b');
      expect(item.allItems).toContain('c');
    });
  });

  it('should handle pickCount greater than data length', async () => {
    const requestBody: MockRequest = {
      schema: {
        items: {
          dataType: 'array',
          data: ['x', 'y'],
          pickCount: 5,
        },
      },
      count: 3,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    // Should return only available items (2 in this case)
    body.forEach((item: { items: string[] }) => {
      expect(item.items.length).toBe(2);
      expect(item.items).toContain('x');
      expect(item.items).toContain('y');
    });
  });

  it('should pick random items with nullable', async () => {
    const requestBody: MockRequest = {
      schema: {
        tags: {
          dataType: 'array',
          data: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
          pickCount: 2,
          nullable: true,
          nullableRate: 0.5,
        },
      },
      count: 40,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    let nullCount = 0;
    const validTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];

    body.forEach((item: { tags: string[] | null }) => {
      if (item.tags === null) {
        nullCount++;
      } else {
        expect(Array.isArray(item.tags)).toBe(true);
        expect(item.tags.length).toBe(2);
        item.tags.forEach((tag) => {
          expect(validTags).toContain(tag);
        });
      }
    });

    // Should have some nulls
    expect(nullCount).toBeGreaterThan(0);
  });
});
