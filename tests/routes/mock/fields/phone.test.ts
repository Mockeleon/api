import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Phone Field Generation', () => {
  const app = setupTestApp();

  it('should generate valid phone numbers', async () => {
    const requestBody: MockRequest = {
      schema: {
        phone: { dataType: 'phone' },
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

    body.forEach((item: { phone: string }) => {
      expect(typeof item.phone).toBe('string');
      // Format: +X-XXX-XXX-XXXX or similar
      expect(item.phone).toMatch(/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/);
    });
  });

  it('should generate different phone numbers', async () => {
    const requestBody: MockRequest = {
      schema: {
        phone: { dataType: 'phone' },
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

    const phones = body.map((item: { phone: string }) => item.phone);
    const uniquePhones = new Set(phones);

    // Most should be unique
    expect(uniquePhones.size).toBeGreaterThan(40);
  });

  it('should handle nullable phone fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        mobilePhone: {
          dataType: 'phone',
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
      (item: { mobilePhone: string | null }) => item.mobilePhone === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should generate multiple phone fields independently', async () => {
    const requestBody: MockRequest = {
      schema: {
        homePhone: { dataType: 'phone' },
        workPhone: { dataType: 'phone' },
        mobilePhone: { dataType: 'phone' },
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

    body.forEach(
      (item: { homePhone: string; workPhone: string; mobilePhone: string }) => {
        expect(item.homePhone).toMatch(/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/);
        expect(item.workPhone).toMatch(/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/);
        expect(item.mobilePhone).toMatch(/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/);

        // They should be different
        expect(item.homePhone).not.toBe(item.workPhone);
        expect(item.homePhone).not.toBe(item.mobilePhone);
        expect(item.workPhone).not.toBe(item.mobilePhone);
      }
    );
  });
});
