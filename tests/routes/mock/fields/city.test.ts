import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('City Field Generation', () => {
  const app = setupTestApp();

  it('should generate city names', async () => {
    const requestBody: MockRequest = {
      schema: {
        city: { dataType: 'city', name: 'city' },
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

    body.forEach((item: { city: string }) => {
      expect(typeof item.city).toBe('string');
      expect(item.city.length).toBeGreaterThan(0);
    });
  });

  it('should filter cities by continent', async () => {
    const requestBody: MockRequest = {
      schema: {
        europeanCity: {
          dataType: 'city',
          name: 'europeanCity',
          continents: ['europe'],
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

    body.forEach((item: { europeanCity: string }) => {
      expect(typeof item.europeanCity).toBe('string');
      expect(item.europeanCity.length).toBeGreaterThan(0);
    });
  });

  it('should filter cities by country', async () => {
    const requestBody: MockRequest = {
      schema: {
        usCity: { dataType: 'city', name: 'usCity', countries: ['US'] },
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

    body.forEach((item: { usCity: string }) => {
      expect(typeof item.usCity).toBe('string');
      expect(item.usCity.length).toBeGreaterThan(0);
    });
  });

  it('should generate city based on country field', async () => {
    const requestBody: MockRequest = {
      schema: {
        country: { dataType: 'country' },
        city: { dataType: 'city', basedOn: 'country' },
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

    body.forEach((item: { country: string; city: string }) => {
      expect(typeof item.country).toBe('string');
      expect(typeof item.city).toBe('string');
      expect(item.city.length).toBeGreaterThan(0);
    });
  });

  it('should reject when both continents and countries are specified', async () => {
    const requestBody: MockRequest = {
      schema: {
        city: {
          dataType: 'city',
          continents: ['europe'],
          countries: ['US'],
        },
      },
      count: 5,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(400);
  });
});
