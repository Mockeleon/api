import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Location Field Generation', () => {
  const app = setupTestApp();

  it('should generate location strings', async () => {
    const requestBody: MockRequest = {
      schema: {
        location: { dataType: 'location', name: 'location' },
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

    body.forEach((item: { location: string }) => {
      expect(typeof item.location).toBe('string');
      // Should be in format "City, Country"
      expect(item.location).toMatch(/^.+,\s*.+$/);
      expect(item.location.length).toBeGreaterThan(0);
    });
  });

  it('should filter locations by continent', async () => {
    const requestBody: MockRequest = {
      schema: {
        europeLocation: {
          dataType: 'location',
          name: 'europeLocation',
          continents: ['europe'],
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

    body.forEach((item: { europeLocation: string }) => {
      expect(typeof item.europeLocation).toBe('string');
      // Should be in format "City, Country"
      expect(item.europeLocation).toMatch(/^.+,\s*.+$/);
      expect(item.europeLocation.length).toBeGreaterThan(0);
    });
  });

  it('should filter locations by country', async () => {
    const requestBody: MockRequest = {
      schema: {
        usLocation: {
          dataType: 'location',
          name: 'usLocation',
          countries: ['US'],
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

    body.forEach((item: { usLocation: string }) => {
      expect(typeof item.usLocation).toBe('string');
      // Should be in format "City, Country" and country should be "United States"
      expect(item.usLocation).toMatch(/^.+,\s*.+$/);
      expect(item.usLocation).toContain('United States');
    });
  });

  it('should reject when both continents and countries are specified', async () => {
    const requestBody: MockRequest = {
      schema: {
        location: {
          dataType: 'location',
          name: 'location',
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
