import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Product Field Generation', () => {
  const app = setupTestApp();

  it('should generate product names', async () => {
    const requestBody: MockRequest = {
      schema: {
        product: { dataType: 'product' },
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

    body.forEach((item: { product: string }) => {
      expect(typeof item.product).toBe('string');
      expect(item.product.length).toBeGreaterThan(0);
    });
  });

  it('should generate products from specific category', async () => {
    const requestBody: MockRequest = {
      schema: {
        electronics: { dataType: 'product', categories: ['electronics'] },
      },
      count: 15,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    body.forEach((item: { electronics: string }) => {
      expect(typeof item.electronics).toBe('string');
      expect(item.electronics.length).toBeGreaterThan(0);
    });
  });

  it('should generate products from multiple categories', async () => {
    const requestBody: MockRequest = {
      schema: {
        product: {
          dataType: 'product',
          categories: ['electronics', 'clothing', 'books'],
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

    body.forEach((item: { product: string }) => {
      expect(typeof item.product).toBe('string');
      expect(item.product.length).toBeGreaterThan(0);
    });
  });

  it('should generate English product names', async () => {
    const requestBody: MockRequest = {
      schema: {
        product: { dataType: 'product', lang: 'en' },
      },
      count: 15,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    body.forEach((item: { product: string }) => {
      expect(typeof item.product).toBe('string');
      // Should not contain Turkish characters
      expect(item.product).not.toMatch(/[çğıöşü]/i);
    });
  });

  it('should generate Turkish product names', async () => {
    const requestBody: MockRequest = {
      schema: {
        product: { dataType: 'product', lang: 'tr' },
      },
      count: 15,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    body.forEach((item: { product: string }) => {
      expect(typeof item.product).toBe('string');
      expect(item.product.length).toBeGreaterThan(0);
    });
  });

  it('should handle nullable product fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        product: {
          dataType: 'product',
          nullable: true,
          nullableRate: 0.6,
        },
      },
      count: 30,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    const nullCount = body.filter(
      (item: { product: string | null }) => item.product === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should generate products from all categories', async () => {
    const categories = [
      'electronics',
      'clothing',
      'books',
      'home',
      'sports',
      'toys',
      'food',
      'beauty',
      'automotive',
      'garden',
    ] as const;

    for (const category of categories) {
      const requestBody: MockRequest = {
        schema: {
          product: { dataType: 'product', categories: [category] },
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

      body.forEach((item: { product: string }) => {
        expect(typeof item.product).toBe('string');
        expect(item.product.length).toBeGreaterThan(0);
      });
    }
  });

  it('should support all languages (tr, en, zh, ru)', async () => {
    const languages = ['tr', 'en', 'zh', 'ru'] as const;

    for (const lang of languages) {
      const requestBody: MockRequest = {
        schema: {
          product: { dataType: 'product', lang },
          electronics: {
            dataType: 'product',
            categories: ['electronics'],
            lang,
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

      body.forEach((item: { product: string; electronics: string }) => {
        expect(typeof item.product).toBe('string');
        expect(item.product.length).toBeGreaterThan(0);
        expect(typeof item.electronics).toBe('string');
        expect(item.electronics.length).toBeGreaterThan(0);
      });
    }
  });
});
