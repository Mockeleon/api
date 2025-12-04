import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Crypto Address Field Generation', () => {
  const app = setupTestApp();

  it('should generate Ethereum addresses by default', async () => {
    const requestBody: MockRequest = {
      schema: {
        address: { dataType: 'cryptoAddress' },
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

    body.forEach((item: { address: string }) => {
      expect(typeof item.address).toBe('string');
      // Ethereum address: 0x + 40 hex characters
      expect(item.address).toMatch(/^0x[0-9a-f]{40}$/i);
    });
  });

  it('should generate Bitcoin addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        btcAddress: { dataType: 'cryptoAddress', platform: 'btc' },
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

    body.forEach((item: { btcAddress: string }) => {
      expect(typeof item.btcAddress).toBe('string');
      // Bitcoin address starts with 1 and is base58
      expect(item.btcAddress).toMatch(/^1[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/);
      expect(item.btcAddress.length).toBeGreaterThanOrEqual(26);
      expect(item.btcAddress.length).toBeLessThanOrEqual(35);
    });
  });

  it('should generate Solana addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        solAddress: { dataType: 'cryptoAddress', platform: 'sol' },
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

    body.forEach((item: { solAddress: string }) => {
      expect(typeof item.solAddress).toBe('string');
      // Solana address is base58
      expect(item.solAddress).toMatch(/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/);
      expect(item.solAddress.length).toBeGreaterThanOrEqual(32);
      expect(item.solAddress.length).toBeLessThanOrEqual(44);
    });
  });

  it('should generate Ethereum private keys when isPrivate is true', async () => {
    const requestBody: MockRequest = {
      schema: {
        privateKey: {
          dataType: 'cryptoAddress',
          platform: 'eth',
          isPrivate: true,
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

    body.forEach((item: { privateKey: string }) => {
      expect(typeof item.privateKey).toBe('string');
      // Private key: 64 hex characters (no 0x prefix)
      expect(item.privateKey).toMatch(/^[0-9a-f]{64}$/i);
    });
  });

  it('should generate Bitcoin private keys when isPrivate is true', async () => {
    const requestBody: MockRequest = {
      schema: {
        btcPrivateKey: {
          dataType: 'cryptoAddress',
          platform: 'btc',
          isPrivate: true,
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

    body.forEach((item: { btcPrivateKey: string }) => {
      expect(typeof item.btcPrivateKey).toBe('string');
      // Bitcoin WIF private key starts with 5, K, or L
      expect(item.btcPrivateKey).toMatch(/^[5KL][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/);
    });
  });

  it('should handle nullable addresses', async () => {
    const requestBody: MockRequest = {
      schema: {
        address: {
          dataType: 'cryptoAddress',
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

    body.forEach((item: { address: string | null }) => {
      expect(item.address).toBeNull();
    });
  });
});
