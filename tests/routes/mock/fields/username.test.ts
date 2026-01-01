import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Username Field Generation', () => {
  const app = setupTestApp();

  it('should generate random usernames', async () => {
    const requestBody: MockRequest = {
      schema: {
        username: { dataType: 'username' },
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

    body.forEach((item: { username: string }) => {
      expect(typeof item.username).toBe('string');
      expect(item.username.length).toBeGreaterThan(0);
      // Username should be alphanumeric with possible underscores/dots
      expect(item.username).toMatch(/^[a-z0-9_.]+$/);
    });
  });

  it('should generate username based on name field', async () => {
    const requestBody: MockRequest = {
      schema: {
        name: { dataType: 'name', format: 'full', lang: 'en' },
        username: { dataType: 'username', basedOn: 'name' },
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

    body.forEach((item: { name: string; username: string }) => {
      expect(typeof item.username).toBe('string');
      expect(item.username.length).toBeGreaterThan(0);

      const nameParts = item.name.toLowerCase().split(' ');
      const username = item.username.toLowerCase();

      // Username should contain part of the name
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
        return username.includes(normalized);
      });

      if (hasNameReference) matchCount++;
    });

    // At least 40% should have name reference (due to random words/numbers added)
    expect(matchCount).toBeGreaterThanOrEqual(12);
  });

  it('should normalize Turkish characters in usernames', async () => {
    const requestBody: MockRequest = {
      schema: {
        name: { dataType: 'name', lang: 'tr', format: 'full' },
        username: { dataType: 'username', basedOn: 'name' },
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

    body.forEach((item: { username: string }) => {
      // Usernames should not contain Turkish special characters
      expect(item.username).not.toMatch(/[çğıöşü]/i);
      expect(item.username).not.toMatch(/[ÇĞİÖŞÜ]/);
    });
  });

  it('should generate unique usernames', async () => {
    const requestBody: MockRequest = {
      schema: {
        username: { dataType: 'username' },
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

    const usernames = body.map((item: { username: string }) => item.username);
    const uniqueUsernames = new Set(usernames);

    // Most should be unique
    expect(uniqueUsernames.size).toBeGreaterThan(45);
  });

  it('should handle nullable username fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        nickname: {
          dataType: 'username',
          nullable: true,
          nullableRate: 0.5,
        },
      },
      count: 40,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    const nullCount = body.filter(
      (item: { nickname: string | null }) => item.nickname === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should support all languages (tr, en, zh, ru)', async () => {
    const languages = ['tr', 'en', 'zh', 'ru'] as const;

    for (const lang of languages) {
      const requestBody: MockRequest = {
        schema: {
          username: { dataType: 'username', lang },
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

      body.forEach((item: { username: string }) => {
        expect(typeof item.username).toBe('string');
        expect(item.username.length).toBeGreaterThan(0);
        // Username should be alphanumeric with possible underscores/dots
        expect(item.username).toMatch(/^[a-z0-9_.]+$/);
      });
    }
  });
});
