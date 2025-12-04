import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Int Field Generation', () => {
  const app = setupTestApp();

  it('should generate int with default range (0-1000)', async () => {
    const requestBody: MockRequest = {
      schema: {
        value: { dataType: 'int' },
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
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(10);

    body.forEach((item: { value: number }) => {
      expect(typeof item.value).toBe('number');
      expect(Number.isInteger(item.value)).toBe(true);
      expect(item.value).toBeGreaterThanOrEqual(0);
      expect(item.value).toBeLessThanOrEqual(1000);
    });
  });

  it('should generate int with custom min/max', async () => {
    const requestBody: MockRequest = {
      schema: {
        score: { dataType: 'int', min: 50, max: 100 },
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

    body.forEach((item: { score: number }) => {
      expect(item.score).toBeGreaterThanOrEqual(50);
      expect(item.score).toBeLessThanOrEqual(100);
    });
  });

  it('should generate negative integers', async () => {
    const requestBody: MockRequest = {
      schema: {
        temperature: { dataType: 'int', min: -50, max: -10 },
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

    body.forEach((item: { temperature: number }) => {
      expect(item.temperature).toBeGreaterThanOrEqual(-50);
      expect(item.temperature).toBeLessThanOrEqual(-10);
      expect(Number.isInteger(item.temperature)).toBe(true);
    });
  });

  it('should handle nullable int fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        optionalId: { dataType: 'int', nullable: true, nullableRate: 0.5 },
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
      (item: { optionalId: number | null }) => item.optionalId === null
    ).length;
    const nonNullCount = body.length - nullCount;

    expect(nullCount).toBeGreaterThan(0);
    expect(nonNullCount).toBeGreaterThan(0);
  });
});
