import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Date Field Generation', () => {
  const app = setupTestApp();

  it('should generate dates in ISO format by default', async () => {
    const requestBody: MockRequest = {
      schema: {
        createdAt: { dataType: 'date' },
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

    body.forEach((item: { createdAt: string }) => {
      expect(typeof item.createdAt).toBe('string');
      expect(item.createdAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );

      // Should be a valid date
      const date = new Date(item.createdAt);
      expect(date.toString()).not.toBe('Invalid Date');
    });
  });

  it('should generate dates in ISO format', async () => {
    const requestBody: MockRequest = {
      schema: {
        registeredAt: { dataType: 'date', format: 'iso' },
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

    body.forEach((item: { registeredAt: string }) => {
      expect(typeof item.registeredAt).toBe('string');
      // ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(item.registeredAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );

      // Should be a valid date
      const date = new Date(item.registeredAt);
      expect(date.toString()).not.toBe('Invalid Date');
    });
  });

  it('should generate dates in timestamp format explicitly', async () => {
    const requestBody: MockRequest = {
      schema: {
        timestamp: { dataType: 'date', format: 'timestamp' },
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

    body.forEach((item: { timestamp: number }) => {
      expect(typeof item.timestamp).toBe('number');
      expect(item.timestamp).toBeGreaterThan(0);
    });
  });

  it('should generate different dates', async () => {
    const requestBody: MockRequest = {
      schema: {
        date: { dataType: 'date' },
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

    const dates = body.map((item: { date: string }) => item.date);
    const uniqueDates = new Set(dates);

    // Most should be unique
    expect(uniqueDates.size).toBeGreaterThan(45);
  });

  it('should handle nullable date fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        deletedAt: {
          dataType: 'date',
          nullable: true,
          nullableRate: 0.7,
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
      (item: { deletedAt: number | null }) => item.deletedAt === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should generate multiple date fields independently', async () => {
    const requestBody: MockRequest = {
      schema: {
        createdAt: { dataType: 'date' },
        updatedAt: { dataType: 'date' },
        lastLoginAt: { dataType: 'date', format: 'timestamp' },
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
      (item: { createdAt: string; updatedAt: string; lastLoginAt: number }) => {
        expect(typeof item.createdAt).toBe('string');
        expect(typeof item.updatedAt).toBe('string');
        expect(typeof item.lastLoginAt).toBe('number');
        expect(item.createdAt).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        );
        expect(item.updatedAt).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        );
        expect(item.lastLoginAt).toBeGreaterThan(0);
      }
    );
  });
});
