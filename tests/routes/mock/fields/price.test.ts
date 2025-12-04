import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Price Field Generation', () => {
  const app = setupTestApp();

  it('should generate prices with default range (0-10000) and default currency ($)', async () => {
    const requestBody: MockRequest = {
      schema: {
        price: { dataType: 'price' },
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

    body.forEach((item: { price: string }) => {
      expect(typeof item.price).toBe('string');
      expect(item.price).toMatch(/^\d+\.\d{2}\$$/);

      const numericValue = parseFloat(item.price.replace('$', ''));
      expect(numericValue).toBeGreaterThanOrEqual(0);
      expect(numericValue).toBeLessThanOrEqual(10000);
    });
  });

  it('should generate prices with custom min/max', async () => {
    const requestBody: MockRequest = {
      schema: {
        price: { dataType: 'price', min: 100, max: 500 },
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

    body.forEach((item: { price: string }) => {
      const numericValue = parseFloat(item.price.replace('$', ''));
      expect(numericValue).toBeGreaterThanOrEqual(100);
      expect(numericValue).toBeLessThanOrEqual(500);
    });
  });

  it('should generate prices with custom currency', async () => {
    const requestBody: MockRequest = {
      schema: {
        price: { dataType: 'price', currency: '€' },
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

    body.forEach((item: { price: string }) => {
      expect(item.price).toMatch(/^\d+\.\d{2}€$/);
    });
  });

  it('should generate prices with Turkish Lira', async () => {
    const requestBody: MockRequest = {
      schema: {
        price: { dataType: 'price', min: 10, max: 1000, currency: '₺' },
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

    body.forEach((item: { price: string }) => {
      expect(item.price).toMatch(/^\d+\.\d{2}₺$/);
    });
  });

  it('should always have 2 decimal places', async () => {
    const requestBody: MockRequest = {
      schema: {
        price: { dataType: 'price' },
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

    body.forEach((item: { price: string }) => {
      const numericPart = item.price.replace(/[^\d.]/g, '');
      const decimalPart = numericPart.split('.')[1];
      expect(decimalPart).toHaveLength(2);
    });
  });

  it('should handle nullable price fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        salePrice: {
          dataType: 'price',
          nullable: true,
          nullableRate: 0.5,
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

    const nullCount = body.filter(
      (item: { salePrice: string | null }) => item.salePrice === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should generate multiple price fields independently', async () => {
    const requestBody: MockRequest = {
      schema: {
        regularPrice: { dataType: 'price', min: 100, max: 200, currency: '$' },
        salePrice: { dataType: 'price', min: 50, max: 150, currency: '$' },
        costPrice: { dataType: 'price', min: 30, max: 100, currency: '$' },
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

    body.forEach(
      (item: {
        regularPrice: string;
        salePrice: string;
        costPrice: string;
      }) => {
        expect(item.regularPrice).toMatch(/^\d+\.\d{2}\$$/);
        expect(item.salePrice).toMatch(/^\d+\.\d{2}\$$/);
        expect(item.costPrice).toMatch(/^\d+\.\d{2}\$$/);
      }
    );
  });
});
