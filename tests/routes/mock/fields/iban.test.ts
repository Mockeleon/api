import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('IBAN Field Generation', () => {
  const app = setupTestApp();

  it('should generate valid IBAN format', async () => {
    const requestBody: MockRequest = {
      schema: {
        iban: { dataType: 'iban' },
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

    body.forEach((item: { iban: string }) => {
      expect(typeof item.iban).toBe('string');
      // IBAN format: 2 letter country code + 2 check digits + account number
      expect(item.iban).toMatch(/^[A-Z]{2}\d{2}[0-9]{20}$/);
      expect(item.iban).toHaveLength(24);
    });
  });

  it('should use valid country codes', async () => {
    const requestBody: MockRequest = {
      schema: {
        iban: { dataType: 'iban' },
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

    body.forEach((item: { iban: string }) => {
      const countryCode = item.iban.slice(0, 2);
      // Country code should be 2 uppercase letters
      expect(countryCode).toMatch(/^[A-Z]{2}$/);
    });
  });

  it('should generate variety of country codes', async () => {
    const requestBody: MockRequest = {
      schema: {
        iban: { dataType: 'iban' },
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

    const countryCodes = body.map((item: { iban: string }) =>
      item.iban.slice(0, 2)
    );
    const uniqueCountryCodes = new Set(countryCodes);

    // Should have good variety (at least 30 different countries)
    expect(uniqueCountryCodes.size).toBeGreaterThan(30);
  });

  it('should include common European countries', async () => {
    const requestBody: MockRequest = {
      schema: {
        iban: { dataType: 'iban' },
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

    const countryCodes = body.map((item: { iban: string }) =>
      item.iban.slice(0, 2)
    );
    const uniqueCountryCodes = new Set(countryCodes);

    // Check for major European countries (at least 5 of 6 should appear with larger sample)
    const majorCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'TR'];
    const foundMajor = majorCountries.filter((country) =>
      uniqueCountryCodes.has(country)
    );
    expect(foundMajor.length).toBeGreaterThanOrEqual(5);
  });

  it('should generate different IBANs', async () => {
    const requestBody: MockRequest = {
      schema: {
        iban: { dataType: 'iban' },
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

    const ibans = body.map((item: { iban: string }) => item.iban);
    const uniqueIbans = new Set(ibans);

    // All should be unique
    expect(uniqueIbans.size).toBe(100);
  });

  it('should handle nullable IBAN fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        bankAccount: {
          dataType: 'iban',
          nullable: true,
          nullableRate: 0.4,
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
      (item: { bankAccount: string | null }) => item.bankAccount === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should have valid check digits format', async () => {
    const requestBody: MockRequest = {
      schema: {
        iban: { dataType: 'iban' },
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

    body.forEach((item: { iban: string }) => {
      const checkDigits = item.iban.slice(2, 4);
      // Check digits should be 2 digits (00-99)
      expect(checkDigits).toMatch(/^\d{2}$/);
      const checkNumber = parseInt(checkDigits);
      expect(checkNumber).toBeGreaterThanOrEqual(0);
      expect(checkNumber).toBeLessThanOrEqual(99);
    });
  });
});
