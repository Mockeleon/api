import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Boolean Field Generation', () => {
  const app = setupTestApp();

  it('should generate boolean values', async () => {
    const requestBody: MockRequest = {
      schema: {
        isActive: { dataType: 'boolean' },
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
    expect(body).toHaveLength(50);

    body.forEach((item: { isActive: boolean }) => {
      expect(typeof item.isActive).toBe('boolean');
    });

    // Check that we have both true and false values (with high probability)
    const trueCount = body.filter(
      (item: { isActive: boolean }) => item.isActive === true
    ).length;
    const falseCount = body.filter(
      (item: { isActive: boolean }) => item.isActive === false
    ).length;

    expect(trueCount).toBeGreaterThan(0);
    expect(falseCount).toBeGreaterThan(0);
  });

  it('should handle nullable boolean fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        optionalFlag: {
          dataType: 'boolean',
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
      (item: { optionalFlag: boolean | null }) => item.optionalFlag === null
    ).length;
    const trueCount = body.filter(
      (item: { optionalFlag: boolean | null }) => item.optionalFlag === true
    ).length;
    const falseCount = body.filter(
      (item: { optionalFlag: boolean | null }) => item.optionalFlag === false
    ).length;

    expect(nullCount).toBeGreaterThan(0);
    expect(trueCount + falseCount + nullCount).toBe(50);
  });

  it('should generate multiple boolean fields independently', async () => {
    const requestBody: MockRequest = {
      schema: {
        isVerified: { dataType: 'boolean' },
        isPremium: { dataType: 'boolean' },
        hasNotifications: { dataType: 'boolean' },
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
        isVerified: boolean;
        isPremium: boolean;
        hasNotifications: boolean;
      }) => {
        expect(typeof item.isVerified).toBe('boolean');
        expect(typeof item.isPremium).toBe('boolean');
        expect(typeof item.hasNotifications).toBe('boolean');
      }
    );
  });
});
