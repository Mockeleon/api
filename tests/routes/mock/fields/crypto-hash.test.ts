import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Crypto Hash Field Generation', () => {
  const app = setupTestApp();

  it('should generate Ethereum transaction hashes by default', async () => {
    const requestBody: MockRequest = {
      schema: {
        txHash: { dataType: 'cryptoHash' },
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

    body.forEach((item: { txHash: string }) => {
      expect(typeof item.txHash).toBe('string');
      // Ethereum transaction hash: 0x + 64 hex characters
      expect(item.txHash).toMatch(/^0x[0-9a-f]{64}$/i);
    });
  });

  it('should generate Bitcoin transaction hashes', async () => {
    const requestBody: MockRequest = {
      schema: {
        btcTxHash: { dataType: 'cryptoHash', platform: 'btc' },
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

    body.forEach((item: { btcTxHash: string }) => {
      expect(typeof item.btcTxHash).toBe('string');
      // Bitcoin transaction hash: 64 hex characters (no 0x prefix)
      expect(item.btcTxHash).toMatch(/^[0-9a-f]{64}$/i);
    });
  });

  it('should generate Solana transaction signatures', async () => {
    const requestBody: MockRequest = {
      schema: {
        solTxSig: { dataType: 'cryptoHash', platform: 'sol' },
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

    body.forEach((item: { solTxSig: string }) => {
      expect(typeof item.solTxSig).toBe('string');
      // Solana signature is base58, typically 88 characters
      expect(item.solTxSig).toMatch(/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{88}$/);
    });
  });

  it('should generate custom length hashes when min/max specified', async () => {
    const requestBody: MockRequest = {
      schema: {
        customHash: {
          dataType: 'cryptoHash',
          min: 16,
          max: 16,
        },
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

    body.forEach((item: { customHash: string }) => {
      expect(typeof item.customHash).toBe('string');
      // Custom 16-character hex hash
      expect(item.customHash).toMatch(/^[0-9a-f]{16}$/i);
    });
  });

  it('should generate variable length custom hashes', async () => {
    const requestBody: MockRequest = {
      schema: {
        variableHash: {
          dataType: 'cryptoHash',
          min: 32,
          max: 128,
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

    body.forEach((item: { variableHash: string }) => {
      expect(typeof item.variableHash).toBe('string');
      // Custom hash with length between 32 and 128
      expect(item.variableHash).toMatch(/^[0-9a-f]+$/i);
      expect(item.variableHash.length).toBeGreaterThanOrEqual(32);
      expect(item.variableHash.length).toBeLessThanOrEqual(128);
    });
  });

  it('should handle nullable hashes', async () => {
    const requestBody: MockRequest = {
      schema: {
        hash: {
          dataType: 'cryptoHash',
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

    body.forEach((item: { hash: string | null }) => {
      expect(item.hash).toBeNull();
    });
  });

  it('should reject invalid min/max configuration', async () => {
    const requestBody: MockRequest = {
      schema: {
        invalidHash: {
          dataType: 'cryptoHash',
          min: 100,
          max: 50, // Invalid: min > max
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
