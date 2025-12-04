import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Hash Field Generation', () => {
  const app = setupTestApp();

  it('should generate SHA256 hashes by default', async () => {
    const requestBody: MockRequest = {
      schema: {
        hash: { dataType: 'hash' },
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

    body.forEach((item: { hash: string }) => {
      expect(typeof item.hash).toBe('string');
      // SHA256 is 64 hex characters
      expect(item.hash).toMatch(/^[0-9a-f]{64}$/i);
    });
  });

  it('should generate MD5 hashes explicitly', async () => {
    const requestBody: MockRequest = {
      schema: {
        md5: { dataType: 'hash', algorithm: 'md5' },
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

    body.forEach((item: { md5: string }) => {
      expect(item.md5).toMatch(/^[0-9a-f]{32}$/i);
    });
  });

  it('should generate SHA1 hashes', async () => {
    const requestBody: MockRequest = {
      schema: {
        sha1: { dataType: 'hash', algorithm: 'sha1' },
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

    body.forEach((item: { sha1: string }) => {
      expect(typeof item.sha1).toBe('string');
      // SHA1 is 40 hex characters
      expect(item.sha1).toMatch(/^[0-9a-f]{40}$/i);
    });
  });

  it('should generate SHA256 hashes', async () => {
    const requestBody: MockRequest = {
      schema: {
        sha256: { dataType: 'hash', algorithm: 'sha256' },
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

    body.forEach((item: { sha256: string }) => {
      expect(typeof item.sha256).toBe('string');
      // SHA256 is 64 hex characters
      expect(item.sha256).toMatch(/^[0-9a-f]{64}$/i);
    });
  });

  it('should generate SHA512 hashes', async () => {
    const requestBody: MockRequest = {
      schema: {
        sha512: { dataType: 'hash', algorithm: 'sha512' },
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

    body.forEach((item: { sha512: string }) => {
      expect(typeof item.sha512).toBe('string');
      // SHA512 is 128 hex characters
      expect(item.sha512).toMatch(/^[0-9a-f]{128}$/i);
    });
  });

  it('should generate different hashes', async () => {
    const requestBody: MockRequest = {
      schema: {
        hash: { dataType: 'hash', algorithm: 'sha256' },
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

    const hashes = body.map((item: { hash: string }) => item.hash);
    const uniqueHashes = new Set(hashes);

    // All should be unique
    expect(uniqueHashes.size).toBe(50);
  });

  it('should handle nullable hash fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        checksum: {
          dataType: 'hash',
          algorithm: 'md5',
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
      (item: { checksum: string | null }) => item.checksum === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should generate multiple hash algorithms independently', async () => {
    const requestBody: MockRequest = {
      schema: {
        md5: { dataType: 'hash', algorithm: 'md5' },
        sha1: { dataType: 'hash', algorithm: 'sha1' },
        sha256: { dataType: 'hash', algorithm: 'sha256' },
        sha512: { dataType: 'hash', algorithm: 'sha512' },
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
      (item: { md5: string; sha1: string; sha256: string; sha512: string }) => {
        expect(item.md5).toMatch(/^[0-9a-f]{32}$/i);
        expect(item.sha1).toMatch(/^[0-9a-f]{40}$/i);
        expect(item.sha256).toMatch(/^[0-9a-f]{64}$/i);
        expect(item.sha512).toMatch(/^[0-9a-f]{128}$/i);

        // All should be different
        expect(item.md5).not.toBe(item.sha1.slice(0, 32));
        expect(item.md5).not.toBe(item.sha256.slice(0, 32));
      }
    );
  });
});
