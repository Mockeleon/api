import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('URL Field Generation', () => {
  const app = setupTestApp();

  it('should generate random website URLs', async () => {
    const requestBody: MockRequest = {
      schema: {
        website: { dataType: 'url' },
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

    body.forEach((item: { website: string }) => {
      expect(typeof item.website).toBe('string');
      expect(item.website).toMatch(/^https?:\/\/.+/);
    });
  });

  it('should generate platform-specific URLs (GitHub)', async () => {
    const requestBody: MockRequest = {
      schema: {
        github: { dataType: 'url', platform: 'github' },
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

    body.forEach((item: { github: string }) => {
      expect(item.github).toMatch(/^https:\/\/github\.com\/.+/);
    });
  });

  it('should generate URL based on name field', async () => {
    const requestBody: MockRequest = {
      schema: {
        name: { dataType: 'name', format: 'full' },
        github: { dataType: 'url', platform: 'github', basedOn: 'name' },
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

    body.forEach((item: { name: string; github: string }) => {
      expect(item.github).toMatch(/^https:\/\/github\.com\/.+/);

      const username = item.github.split('/').pop()!;
      const nameParts = item.name.toLowerCase().split(' ');

      // URL username should contain part of the name
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
        return username.toLowerCase().includes(normalized);
      });

      expect(hasNameReference).toBe(true);
    });
  });

  it('should support multiple social media platforms', async () => {
    const requestBody: MockRequest = {
      schema: {
        name: { dataType: 'name', format: 'full' },
        twitter: { dataType: 'url', platform: 'x', basedOn: 'name' },
        instagram: { dataType: 'url', platform: 'instagram', basedOn: 'name' },
        linkedin: { dataType: 'url', platform: 'linkedin', basedOn: 'name' },
      },
      count: 5,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    body.forEach(
      (item: { twitter: string; instagram: string; linkedin: string }) => {
        expect(item.twitter).toMatch(/^https:\/\/x\.com\/.+/);
        expect(item.instagram).toMatch(/^https:\/\/instagram\.com\/.+/);
        expect(item.linkedin).toMatch(/^https:\/\/linkedin\.com\/in\/.+/);
      }
    );
  });

  it('should normalize Turkish characters in URLs', async () => {
    const requestBody: MockRequest = {
      schema: {
        name: { dataType: 'name', lang: 'tr', format: 'full' },
        profile: { dataType: 'url', platform: 'github', basedOn: 'name' },
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

    body.forEach((item: { profile: string }) => {
      // URLs should not contain Turkish special characters
      expect(item.profile).not.toMatch(/[çğıöşü]/i);
      expect(item.profile).not.toMatch(/[ÇĞİÖŞÜ]/);
    });
  });

  it('should handle nullable URL fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        portfolio: {
          dataType: 'url',
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
      (item: { portfolio: string | null }) => item.portfolio === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });
});
