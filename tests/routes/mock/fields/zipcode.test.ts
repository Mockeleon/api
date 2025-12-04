import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('ZipCode Field Generation', () => {
  const app = setupTestApp();

  it('should generate zip codes', async () => {
    const requestBody: MockRequest = {
      schema: {
        zipCode: { dataType: 'zipCode', name: 'zipCode' },
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

    body.forEach((item: { zipCode: string }) => {
      expect(typeof item.zipCode).toBe('string');
      expect(item.zipCode.length).toBeGreaterThan(0);
      // Should be numeric (possibly with leading zeros)
      expect(item.zipCode).toMatch(/^\d+$/);
    });
  });

  it('should generate valid US-style zip codes', async () => {
    const requestBody: MockRequest = {
      schema: {
        zipCode: { dataType: 'zipCode', name: 'zipCode' },
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

    body.forEach((item: { zipCode: string }) => {
      expect(typeof item.zipCode).toBe('string');
      // Should be 5 digits
      expect(item.zipCode).toMatch(/^\d{5}$/);
    });
  });
});
