import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('IP Field Generation', () => {
  const app = setupTestApp();

  it('should generate IPv4 addresses by default', async () => {
    const requestBody: MockRequest = {
      schema: {
        ip: { dataType: 'ip' },
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

    body.forEach((item: { ip: string }) => {
      expect(typeof item.ip).toBe('string');
      // IPv4 format: xxx.xxx.xxx.xxx
      expect(item.ip).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);

      // Validate each octet is 0-255
      const octets = item.ip.split('.').map(Number);
      octets.forEach((octet) => {
        expect(octet).toBeGreaterThanOrEqual(0);
        expect(octet).toBeLessThanOrEqual(255);
      });
    });
  });

  it('should generate IPv4 addresses explicitly', async () => {
    const requestBody: MockRequest = {
      schema: {
        ipv4: { dataType: 'ip', version: 'v4' },
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

    body.forEach((item: { ipv4: string }) => {
      expect(item.ipv4).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
    });
  });

  it('should generate IPv6 addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        ipv6: { dataType: 'ip', version: 'v6' },
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

    body.forEach((item: { ipv6: string }) => {
      expect(typeof item.ipv6).toBe('string');
      // IPv6 format: xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx
      expect(item.ipv6).toMatch(
        /^[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}$/i
      );
    });
  });

  it('should generate different IP addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        ip: { dataType: 'ip' },
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

    const ips = body.map((item: { ip: string }) => item.ip);
    const uniqueIps = new Set(ips);

    // Most should be unique
    expect(uniqueIps.size).toBeGreaterThan(45);
  });

  it('should handle nullable IP fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        serverIp: {
          dataType: 'ip',
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
      (item: { serverIp: string | null }) => item.serverIp === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should generate both IPv4 and IPv6 independently', async () => {
    const requestBody: MockRequest = {
      schema: {
        ipv4: { dataType: 'ip', version: 'v4' },
        ipv6: { dataType: 'ip', version: 'v6' },
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

    body.forEach((item: { ipv4: string; ipv6: string }) => {
      expect(item.ipv4).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
      expect(item.ipv6).toMatch(
        /^[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}:[0-9a-f]{1,4}$/i
      );
    });
  });
});
