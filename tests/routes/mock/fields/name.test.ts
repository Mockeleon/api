import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Name Field Generation', () => {
  const app = setupTestApp();

  it('should generate full names by default', async () => {
    const requestBody: MockRequest = {
      schema: {
        name: { dataType: 'name' },
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

    body.forEach((item: { name: string }) => {
      expect(typeof item.name).toBe('string');
      expect(item.name.split(' ').length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should generate first names only', async () => {
    const requestBody: MockRequest = {
      schema: {
        firstName: { dataType: 'name', format: 'first' },
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

    body.forEach((item: { firstName: string }) => {
      expect(typeof item.firstName).toBe('string');
      expect(item.firstName.length).toBeGreaterThan(0);
    });
  });

  it('should generate last names only', async () => {
    const requestBody: MockRequest = {
      schema: {
        lastName: { dataType: 'name', format: 'last' },
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

    body.forEach((item: { lastName: string }) => {
      expect(typeof item.lastName).toBe('string');
      expect(item.lastName.length).toBeGreaterThan(0);
    });
  });

  it('should generate full names with specific format', async () => {
    const requestBody: MockRequest = {
      schema: {
        fullName: { dataType: 'name', format: 'full' },
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

    body.forEach((item: { fullName: string }) => {
      expect(typeof item.fullName).toBe('string');
      expect(item.fullName.split(' ').length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should respect gender parameter', async () => {
    const requestBody: MockRequest = {
      schema: {
        maleName: { dataType: 'name', format: 'first', gender: 'male' },
        femaleName: { dataType: 'name', format: 'first', gender: 'female' },
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

    body.forEach((item: { maleName: string; femaleName: string }) => {
      expect(typeof item.maleName).toBe('string');
      expect(typeof item.femaleName).toBe('string');
      expect(item.maleName.length).toBeGreaterThan(0);
      expect(item.femaleName.length).toBeGreaterThan(0);
    });
  });

  it('should respect language parameter (English)', async () => {
    const requestBody: MockRequest = {
      schema: {
        englishName: { dataType: 'name', lang: 'en' },
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

    body.forEach((item: { englishName: string }) => {
      expect(typeof item.englishName).toBe('string');
      // English names should not contain Turkish characters
      expect(item.englishName).not.toMatch(/[çğıöşü]/i);
    });
  });

  it('should respect language parameter (Turkish)', async () => {
    const requestBody: MockRequest = {
      schema: {
        turkishName: { dataType: 'name', lang: 'tr' },
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

    body.forEach((item: { turkishName: string }) => {
      expect(typeof item.turkishName).toBe('string');
      expect(item.turkishName.length).toBeGreaterThan(0);
    });
  });

  it('should handle nullable name fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        middleName: {
          dataType: 'name',
          format: 'first',
          nullable: true,
          nullableRate: 0.6,
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
      (item: { middleName: string | null }) => item.middleName === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should support all languages (tr, en, zh, ru)', async () => {
    const languages = ['tr', 'en', 'zh', 'ru'] as const;

    for (const lang of languages) {
      const requestBody: MockRequest = {
        schema: {
          fullName: { dataType: 'name', format: 'full', lang },
          firstName: { dataType: 'name', format: 'first', lang },
          lastName: { dataType: 'name', format: 'last', lang },
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
        (item: { fullName: string; firstName: string; lastName: string }) => {
          expect(typeof item.fullName).toBe('string');
          expect(item.fullName.length).toBeGreaterThan(0);
          expect(typeof item.firstName).toBe('string');
          expect(item.firstName.length).toBeGreaterThan(0);
          expect(typeof item.lastName).toBe('string');
          expect(item.lastName.length).toBeGreaterThan(0);

          // Each field is generated independently, so we just verify they exist and are valid
          // Full name will be different from firstName + lastName since they're random
        }
      );
    }
  });
});
