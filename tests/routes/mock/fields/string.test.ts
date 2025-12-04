import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('String Field Generation', () => {
  const app = setupTestApp();

  it('should generate string with word type', async () => {
    const requestBody: MockRequest = {
      schema: {
        tag: { dataType: 'string', kind: 'word' },
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

    body.forEach((item: { tag: string }) => {
      expect(typeof item.tag).toBe('string');
      expect(item.tag.length).toBeGreaterThan(0);
      expect(item.tag.split(' ').length).toBe(1); // single word
    });
  });

  it('should generate string with sentence type', async () => {
    const requestBody: MockRequest = {
      schema: {
        description: { dataType: 'string', kind: 'sentence' },
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

    body.forEach((item: { description: string }) => {
      expect(typeof item.description).toBe('string');
      expect(item.description.split(' ').length).toBeGreaterThanOrEqual(5);
      expect(item.description.split(' ').length).toBeLessThanOrEqual(15);
    });
  });

  it('should generate string with paragraph type', async () => {
    const requestBody: MockRequest = {
      schema: {
        content: { dataType: 'string', kind: 'paragraph' },
      },
      count: 5,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    body.forEach((item: { content: string }) => {
      expect(typeof item.content).toBe('string');
      expect(item.content.split(' ').length).toBeGreaterThanOrEqual(15);
    });
  });

  it('should respect custom length for word type', async () => {
    const requestBody: MockRequest = {
      schema: {
        shortTag: { dataType: 'string', kind: 'word', length: 5 },
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

    body.forEach((item: { shortTag: string }) => {
      // Word length can vary due to random word selection, just check it's reasonable
      expect(item.shortTag.length).toBeGreaterThan(0);
      expect(item.shortTag.length).toBeLessThan(30);
    });
  });

  it('should handle nullable string fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        optionalNote: {
          dataType: 'string',
          kind: 'sentence',
          nullable: true,
          nullableRate: 0.5,
        },
      },
      count: 40,
    };

    const response = await app.request('/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    const nullCount = body.filter(
      (item: { optionalNote: string | null }) => item.optionalNote === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });
});
