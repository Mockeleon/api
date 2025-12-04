import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Street Field Generation', () => {
  const app = setupTestApp();

  it('should generate street addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        street: { dataType: 'street' },
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

    body.forEach((item: { street: string }) => {
      expect(typeof item.street).toBe('string');
      expect(item.street.length).toBeGreaterThan(0);
      // Should contain a number
      expect(item.street).toMatch(/\d+/);
    });
  });

  it('should generate English street addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        street: { dataType: 'street', lang: 'en' },
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

    body.forEach((item: { street: string }) => {
      expect(typeof item.street).toBe('string');
      expect(item.street.length).toBeGreaterThan(0);
      // Should not contain Turkish characters
      expect(item.street).not.toMatch(/[çğıöşü]/i);
    });
  });

  it('should generate Turkish street addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        street: { dataType: 'street', lang: 'tr' },
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

    body.forEach((item: { street: string }) => {
      expect(typeof item.street).toBe('string');
      expect(item.street.length).toBeGreaterThan(0);
    });
  });

  it('should handle nullable street fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        street: {
          dataType: 'street',
          nullable: true,
          nullableRate: 0.5,
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
      (item: { street: string | null }) => item.street === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });
});
