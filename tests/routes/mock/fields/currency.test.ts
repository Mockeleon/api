import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Currency Field Generation', () => {
  const app = setupTestApp();

  it('should generate valid currency codes', async () => {
    const requestBody: MockRequest = {
      schema: {
        currency: { dataType: 'currency' },
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

    body.forEach((item: { currency: string }) => {
      expect(typeof item.currency).toBe('string');
      // Currency codes are 3 uppercase letters (ISO 4217)
      expect(item.currency).toMatch(/^[A-Z]{3}$/);
    });
  });

  it('should generate variety of currency codes', async () => {
    const requestBody: MockRequest = {
      schema: {
        currency: { dataType: 'currency' },
      },
      count: 100,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    const currencies = body.map((item: { currency: string }) => item.currency);
    const uniqueCurrencies = new Set(currencies);

    // Should have good variety (at least 20 different currencies)
    expect(uniqueCurrencies.size).toBeGreaterThan(20);
  });

  it('should include major currencies', async () => {
    const requestBody: MockRequest = {
      schema: {
        currency: { dataType: 'currency' },
      },
      count: 500,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    const currencies = body.map((item: { currency: string }) => item.currency);
    const uniqueCurrencies = new Set(currencies);

    // Check for major currencies (at least 3 of 4 should appear with larger sample)
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY'];
    const foundMajor = majorCurrencies.filter((major) =>
      uniqueCurrencies.has(major)
    );
    expect(foundMajor.length).toBeGreaterThanOrEqual(3);
  });

  it('should handle nullable currency fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        preferredCurrency: {
          dataType: 'currency',
          nullable: true,
          nullableRate: 0.3,
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
      (item: { preferredCurrency: string | null }) =>
        item.preferredCurrency === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should generate multiple currency fields independently', async () => {
    const requestBody: MockRequest = {
      schema: {
        baseCurrency: { dataType: 'currency' },
        targetCurrency: { dataType: 'currency' },
        displayCurrency: { dataType: 'currency' },
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

    body.forEach(
      (item: {
        baseCurrency: string;
        targetCurrency: string;
        displayCurrency: string;
      }) => {
        expect(item.baseCurrency).toMatch(/^[A-Z]{3}$/);
        expect(item.targetCurrency).toMatch(/^[A-Z]{3}$/);
        expect(item.displayCurrency).toMatch(/^[A-Z]{3}$/);
      }
    );
  });

  it('should include Turkish Lira in currency list', async () => {
    const requestBody: MockRequest = {
      schema: {
        currency: { dataType: 'currency' },
      },
      count: 200,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    const currencies = body.map((item: { currency: string }) => item.currency);

    expect(currencies).toContain('TRY');
  });
});
