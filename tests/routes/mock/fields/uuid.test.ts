import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('UUID Field Generation', () => {
  const app = setupTestApp();

  it('should generate valid UUID v4 format', async () => {
    const requestBody: MockRequest = {
      schema: {
        id: { dataType: 'uuid' },
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

    body.forEach((item: { id: string }) => {
      expect(typeof item.id).toBe('string');
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      expect(item.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  it('should generate unique UUIDs', async () => {
    const requestBody: MockRequest = {
      schema: {
        id: { dataType: 'uuid' },
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

    const uuids = body.map((item: { id: string }) => item.id);
    const uniqueUuids = new Set(uuids);

    // All UUIDs should be unique
    expect(uniqueUuids.size).toBe(100);
  });

  it('should handle nullable UUID fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        correlationId: {
          dataType: 'uuid',
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
      (item: { correlationId: string | null }) => item.correlationId === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should use lowercase for UUID', async () => {
    const requestBody: MockRequest = {
      schema: {
        id: { dataType: 'uuid' },
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

    body.forEach((item: { id: string }) => {
      expect(item.id).toBe(item.id.toLowerCase());
    });
  });

  it('should generate multiple UUIDs independently', async () => {
    const requestBody: MockRequest = {
      schema: {
        userId: { dataType: 'uuid' },
        sessionId: { dataType: 'uuid' },
        requestId: { dataType: 'uuid' },
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
      (item: { userId: string; sessionId: string; requestId: string }) => {
        expect(item.userId).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
        expect(item.sessionId).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
        expect(item.requestId).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );

        // All three should be different
        expect(item.userId).not.toBe(item.sessionId);
        expect(item.userId).not.toBe(item.requestId);
        expect(item.sessionId).not.toBe(item.requestId);
      }
    );
  });
});
