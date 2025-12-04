import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Float Field Generation', () => {
  const app = setupTestApp();

  it('should generate float with default range (0-1000) and 2 decimals', async () => {
    const requestBody: MockRequest = {
      schema: {
        value: { dataType: 'float' },
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
    expect(body).toHaveLength(10);

    body.forEach((item: { value: number }) => {
      expect(typeof item.value).toBe('number');
      expect(item.value).toBeGreaterThanOrEqual(0);
      expect(item.value).toBeLessThanOrEqual(1000);

      // Check decimal places (default is 2)
      const decimalPart = item.value.toString().split('.')[1] || '';
      expect(decimalPart.length).toBeLessThanOrEqual(2);
    });
  });

  it('should generate float with custom min/max', async () => {
    const requestBody: MockRequest = {
      schema: {
        price: { dataType: 'float', min: 10.5, max: 99.99 },
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

    body.forEach((item: { price: number }) => {
      expect(item.price).toBeGreaterThanOrEqual(10.5);
      expect(item.price).toBeLessThanOrEqual(99.99);
    });
  });

  it('should generate float with custom decimal places', async () => {
    const requestBody: MockRequest = {
      schema: {
        precise: { dataType: 'float', min: 0, max: 100, decimals: 5 },
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

    body.forEach((item: { precise: number }) => {
      const decimalPart = item.precise.toString().split('.')[1] || '';
      expect(decimalPart.length).toBeLessThanOrEqual(5);
    });
  });

  it('should generate float with 0 decimals (integer-like)', async () => {
    const requestBody: MockRequest = {
      schema: {
        rounded: { dataType: 'float', min: 0, max: 100, precision: 0 },
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

    body.forEach((item: { rounded: number }) => {
      expect(Number.isInteger(item.rounded)).toBe(true);
    });
  });

  it('should handle nullable float fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        optionalFloat: { dataType: 'float', nullable: true, nullableRate: 0.3 },
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
      (item: { optionalFloat: number | null }) => item.optionalFloat === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });
});
