import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('String Field Generation', () => {
  const app = setupTestApp();

  it('should generate string with word type', async () => {
    const requestBody: MockRequest = {
      schema: {
        tag: { dataType: 'string', kind: 'word', lang: 'en' },
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
        description: { dataType: 'string', kind: 'sentence', lang: 'en' },
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
      expect(item.description.length).toBeGreaterThan(0);
      // Sentences are pre-written and can vary in length
      expect(item.description).toMatch(/[.!?]$/);
    });
  });

  it('should generate string with paragraph type', async () => {
    const requestBody: MockRequest = {
      schema: {
        content: { dataType: 'string', kind: 'paragraph', lang: 'en' },
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
        shortTag: {
          dataType: 'string',
          kind: 'word',
          min: 5,
          max: 5,
          lang: 'en',
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

    body.forEach((item: { shortTag: string }) => {
      // min: 5, max: 5 means 5 words
      const wordCount = item.shortTag.split(' ').length;
      expect(wordCount).toBe(5);
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

  it('should support all languages (tr, en, zh, ru)', async () => {
    const languages = ['tr', 'en', 'zh', 'ru'] as const;

    for (const lang of languages) {
      const requestBody: MockRequest = {
        schema: {
          sentence: { dataType: 'string', kind: 'sentence', lang },
          word: { dataType: 'string', kind: 'word', lang },
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

      body.forEach((item: { sentence: string; word: string }) => {
        expect(typeof item.sentence).toBe('string');
        expect(item.sentence.length).toBeGreaterThan(0);
        expect(typeof item.word).toBe('string');
        expect(item.word.length).toBeGreaterThan(0);
      });
    }
  });
});
