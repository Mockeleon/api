import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Color Field Generation', () => {
  const app = setupTestApp();

  it('should generate HEX colors by default', async () => {
    const requestBody: MockRequest = {
      schema: {
        color: { dataType: 'color' },
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

    body.forEach((item: { color: string }) => {
      expect(typeof item.color).toBe('string');
      // HEX color: # + 6 hex characters
      expect(item.color).toMatch(/^#[0-9A-F]{6}$/);
    });
  });

  it('should generate RGB colors', async () => {
    const requestBody: MockRequest = {
      schema: {
        rgbColor: { dataType: 'color', format: 'rgb' },
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

    body.forEach((item: { rgbColor: string }) => {
      expect(typeof item.rgbColor).toBe('string');
      // RGB format: rgb(0-255, 0-255, 0-255)
      expect(item.rgbColor).toMatch(/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/);

      // Extract values and validate range
      const match = item.rgbColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
      expect(match).toBeTruthy();
      if (match) {
        const [, r, g, b] = match;
        expect(parseInt(r)).toBeGreaterThanOrEqual(0);
        expect(parseInt(r)).toBeLessThanOrEqual(255);
        expect(parseInt(g)).toBeGreaterThanOrEqual(0);
        expect(parseInt(g)).toBeLessThanOrEqual(255);
        expect(parseInt(b)).toBeGreaterThanOrEqual(0);
        expect(parseInt(b)).toBeLessThanOrEqual(255);
      }
    });
  });

  it('should generate HSL colors', async () => {
    const requestBody: MockRequest = {
      schema: {
        hslColor: { dataType: 'color', format: 'hsl' },
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

    body.forEach((item: { hslColor: string }) => {
      expect(typeof item.hslColor).toBe('string');
      // HSL format: hsl(0-360, 0-100%, 0-100%)
      expect(item.hslColor).toMatch(/^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$/);

      // Extract values and validate range
      const match = item.hslColor.match(/hsl\((\d+), (\d+)%, (\d+)%\)/);
      expect(match).toBeTruthy();
      if (match) {
        const [, h, s, l] = match;
        expect(parseInt(h)).toBeGreaterThanOrEqual(0);
        expect(parseInt(h)).toBeLessThanOrEqual(360);
        expect(parseInt(s)).toBeGreaterThanOrEqual(0);
        expect(parseInt(s)).toBeLessThanOrEqual(100);
        expect(parseInt(l)).toBeGreaterThanOrEqual(0);
        expect(parseInt(l)).toBeLessThanOrEqual(100);
      }
    });
  });

  it('should handle nullable colors', async () => {
    const requestBody: MockRequest = {
      schema: {
        color: {
          dataType: 'color',
          nullable: true,
          nullableRate: 1.0, // All null for testing
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

    body.forEach((item: { color: string | null }) => {
      expect(item.color).toBeNull();
    });
  });
});
