import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Country Field Generation', () => {
  const app = setupTestApp();

  it('should generate country names', async () => {
    const requestBody: MockRequest = {
      schema: {
        country: { dataType: 'country', name: 'country' },
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

    body.forEach((item: { country: string }) => {
      expect(typeof item.country).toBe('string');
      expect(item.country.length).toBeGreaterThan(0);
    });
  });

  it('should filter countries by continent', async () => {
    const requestBody: MockRequest = {
      schema: {
        asianCountry: {
          dataType: 'country',
          name: 'asianCountry',
          continents: ['asia'],
        },
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

    body.forEach((item: { asianCountry: string }) => {
      expect(typeof item.asianCountry).toBe('string');
      expect(item.asianCountry.length).toBeGreaterThan(0);
    });
  });

  it('should filter countries by multiple continents', async () => {
    const requestBody: MockRequest = {
      schema: {
        country: {
          dataType: 'country',
          name: 'country',
          continents: ['europe', 'asia'],
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

    body.forEach((item: { country: string }) => {
      expect(typeof item.country).toBe('string');
      expect(item.country.length).toBeGreaterThan(0);
    });
  });

  it('should generate country based on city field', async () => {
    const requestBody: MockRequest = {
      schema: {
        city: { dataType: 'city' },
        country: { dataType: 'country', basedOn: 'city' },
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

    body.forEach((item: { city: string; country: string }) => {
      expect(typeof item.city).toBe('string');
      expect(typeof item.country).toBe('string');
      expect(item.country.length).toBeGreaterThan(0);
    });
  });
});
