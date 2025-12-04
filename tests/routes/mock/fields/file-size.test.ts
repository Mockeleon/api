import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('File Size Field Generation', () => {
  const app = setupTestApp();

  it('should generate file sizes with MB unit by default', async () => {
    const requestBody: MockRequest = {
      schema: {
        size: { dataType: 'fileSize' },
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

    body.forEach((item: { size: string }) => {
      expect(typeof item.size).toBe('string');
      // Default: MB unit
      expect(item.size).toMatch(/^\d+(\.\d+)? MB$/);
    });
  });

  it('should generate file sizes in bytes', async () => {
    const requestBody: MockRequest = {
      schema: {
        sizeBytes: {
          dataType: 'fileSize',
          min: 1,
          max: 1024,
          unit: 'B',
        },
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

    body.forEach((item: { sizeBytes: string }) => {
      expect(typeof item.sizeBytes).toBe('string');
      expect(item.sizeBytes).toMatch(/^\d+ B$/);
    });
  });

  it('should generate file sizes in KB', async () => {
    const requestBody: MockRequest = {
      schema: {
        sizeKB: {
          dataType: 'fileSize',
          min: 1024, // 1 KB
          max: 1048576, // 1 MB = 1024 KB
          unit: 'KB',
        },
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

    body.forEach((item: { sizeKB: string }) => {
      expect(typeof item.sizeKB).toBe('string');
      expect(item.sizeKB).toMatch(/^\d+(\.\d+)? KB$/);
    });
  });

  it('should generate file sizes in GB', async () => {
    const requestBody: MockRequest = {
      schema: {
        sizeGB: {
          dataType: 'fileSize',
          min: 1073741824, // 1 GB
          max: 10737418240, // 10 GB
          unit: 'GB',
        },
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

    body.forEach((item: { sizeGB: string }) => {
      expect(typeof item.sizeGB).toBe('string');
      expect(item.sizeGB).toMatch(/^\d+(\.\d+)? GB$/);
    });
  });

  it('should respect min and max boundaries', async () => {
    const requestBody: MockRequest = {
      schema: {
        size: {
          dataType: 'fileSize',
          min: 1024, // 1 KB
          max: 2048, // 2 KB
          unit: 'B',
        },
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

    body.forEach((item: { size: string }) => {
      const value = parseInt(item.size.split(' ')[0]);
      expect(value).toBeGreaterThanOrEqual(1024);
      expect(value).toBeLessThanOrEqual(2048);
    });
  });

  it('should handle nullable file sizes', async () => {
    const requestBody: MockRequest = {
      schema: {
        size: {
          dataType: 'fileSize',
          nullable: true,
          nullableRate: 1.0, // All null for testing
        },
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

    body.forEach((item: { size: string | null }) => {
      expect(item.size).toBeNull();
    });
  });

  it('should reject invalid min/max configuration', async () => {
    const requestBody: MockRequest = {
      schema: {
        invalidSize: {
          dataType: 'fileSize',
          min: 1000,
          max: 500, // Invalid: min > max
        },
      },
      count: 10,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(400);
  });
});
