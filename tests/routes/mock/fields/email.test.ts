import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Email Field Generation', () => {
  const app = setupTestApp();

  it('should generate valid email addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        email: { dataType: 'email' },
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

    body.forEach((item: { email: string }) => {
      expect(typeof item.email).toBe('string');
      expect(item.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it('should use custom domains when provided', async () => {
    const customDomains = ['example.com', 'test.org'];
    const requestBody: MockRequest = {
      schema: {
        email: { dataType: 'email', domains: customDomains },
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

    body.forEach((item: { email: string }) => {
      const domain = item.email.split('@')[1];
      expect(customDomains).toContain(domain);
    });
  });

  it('should generate email based on name field', async () => {
    const requestBody: MockRequest = {
      schema: {
        name: { dataType: 'name', format: 'full', lang: 'en' },
        email: { dataType: 'email', basedOn: 'name' },
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

    let matchCount = 0;

    body.forEach((item: { name: string; email: string }) => {
      expect(typeof item.email).toBe('string');
      expect(item.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

      const emailUsername = item.email.split('@')[0]!.toLowerCase();
      const nameParts = item.name.toLowerCase().split(' ');

      // Email username should contain part of the name
      const hasNameReference = nameParts.some((part) => {
        const normalized = part.replace(/[çğıöşü]/g, (match) => {
          const map: Record<string, string> = {
            ç: 'c',
            ğ: 'g',
            ı: 'i',
            ö: 'o',
            ş: 's',
            ü: 'u',
          };
          return map[match] || match;
        });
        return emailUsername.includes(normalized);
      });

      if (hasNameReference) matchCount++;
    });

    // At least 40% should have name reference (due to random suffixes/prefixes)
    expect(matchCount).toBeGreaterThanOrEqual(12);
  });

  it('should handle nullable email fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        secondaryEmail: {
          dataType: 'email',
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
      (item: { secondaryEmail: string | null }) => item.secondaryEmail === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should normalize Turkish characters in email addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        name: { dataType: 'name', lang: 'tr', format: 'full' },
        email: { dataType: 'email', basedOn: 'name' },
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

    body.forEach((item: { email: string }) => {
      // Email addresses should not contain Turkish special characters
      expect(item.email).not.toMatch(/[çğıöşü]/i);
      expect(item.email).not.toMatch(/[ÇĞİÖŞÜ]/);
    });
  });

  it('should handle Chinese and Russian names for email generation', async () => {
    const languages = ['zh', 'ru'] as const;

    for (const lang of languages) {
      const requestBody: MockRequest = {
        schema: {
          name: { dataType: 'name', lang, format: 'full' },
          email: { dataType: 'email', basedOn: 'name' },
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

      body.forEach((item: { name: string; email: string }) => {
        expect(typeof item.email).toBe('string');
        expect(item.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        // Email should be ASCII-safe (no Chinese/Russian characters)
        expect(item.email).toMatch(/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i);
      });
    }
  });
});
