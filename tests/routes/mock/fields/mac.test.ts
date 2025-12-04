import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('MAC Field Generation', () => {
  const app = setupTestApp();

  it('should generate valid MAC addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        mac: { dataType: 'mac' },
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

    body.forEach((item: { mac: string }) => {
      expect(typeof item.mac).toBe('string');
      // MAC format: XX:XX:XX:XX:XX:XX (6 pairs of hex digits)
      expect(item.mac).toMatch(
        /^[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}$/i
      );
    });
  });

  it('should generate different MAC addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        mac: { dataType: 'mac' },
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

    const macs = body.map((item: { mac: string }) => item.mac);
    const uniqueMacs = new Set(macs);

    // All should be unique given the large address space
    expect(uniqueMacs.size).toBeGreaterThan(48);
  });

  it('should handle nullable MAC fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        deviceMac: {
          dataType: 'mac',
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
      (item: { deviceMac: string | null }) => item.deviceMac === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should use lowercase hexadecimal characters', async () => {
    const requestBody: MockRequest = {
      schema: {
        mac: { dataType: 'mac' },
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

    body.forEach((item: { mac: string }) => {
      // Should not contain uppercase letters
      expect(item.mac).toBe(item.mac.toLowerCase());
    });
  });
});
