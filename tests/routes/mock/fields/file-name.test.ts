import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('File Name Field Generation', () => {
  const app = setupTestApp();

  it('should generate file names with random extensions', async () => {
    const requestBody: MockRequest = {
      schema: {
        fileName: { dataType: 'fileName' },
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

    body.forEach((item: { fileName: string }) => {
      expect(typeof item.fileName).toBe('string');
      // Should have a name and an extension
      expect(item.fileName).toMatch(/^[a-z0-9\-]+\.[a-z0-9]+$/);
    });
  });

  it('should generate file names with specified extension', async () => {
    const requestBody: MockRequest = {
      schema: {
        pdfFile: { dataType: 'fileName', extension: 'pdf' },
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

    body.forEach((item: { pdfFile: string }) => {
      expect(typeof item.pdfFile).toBe('string');
      expect(item.pdfFile).toMatch(/\.pdf$/);
    });
  });

  it('should generate file names based on another field', async () => {
    const requestBody: MockRequest = {
      schema: {
        title: { dataType: 'string', kind: 'sentence' },
        document: { dataType: 'fileName', basedOn: 'title', extension: 'docx' },
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

    body.forEach((item: { title: string; document: string }) => {
      expect(typeof item.title).toBe('string');
      expect(typeof item.document).toBe('string');
      expect(item.document).toMatch(/\.docx$/);
      // Document should be a slugified version of title
      const slug = item.document.replace('.docx', '');
      expect(slug).toMatch(/^[a-z0-9\-]+$/);
    });
  });

  it('should generate slugified file names', async () => {
    const requestBody: MockRequest = {
      schema: {
        fileName: { dataType: 'fileName', extension: 'txt' },
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

    body.forEach((item: { fileName: string }) => {
      expect(typeof item.fileName).toBe('string');
      // File name should be lowercase with hyphens
      const name = item.fileName.replace('.txt', '');
      expect(name).toMatch(/^[a-z0-9\-]+$/);
      expect(name).not.toMatch(/[A-Z\s_]/); // No uppercase, spaces, or underscores
    });
  });

  it('should handle various file extensions', async () => {
    const extensions = ['jpg', 'png', 'mp4', 'json', 'csv'];

    for (const ext of extensions) {
      const requestBody: MockRequest = {
        schema: {
          file: { dataType: 'fileName', extension: ext },
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

      body.forEach((item: { file: string }) => {
        expect(item.file).toMatch(new RegExp(`\\.${ext}$`));
      });
    }
  });

  it('should handle nullable file names', async () => {
    const requestBody: MockRequest = {
      schema: {
        fileName: {
          dataType: 'fileName',
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

    body.forEach((item: { fileName: string | null }) => {
      expect(item.fileName).toBeNull();
    });
  });

  it('should generate file names with filtered extensions array', async () => {
    const requestBody: MockRequest = {
      schema: {
        fileName: {
          dataType: 'fileName',
          extensions: ['mp4', 'doc', 'ppt'],
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

    const allowedExtensions = ['mp4', 'doc', 'ppt'];
    body.forEach((item: { fileName: string }) => {
      expect(typeof item.fileName).toBe('string');
      const ext = item.fileName.split('.').pop();
      expect(allowedExtensions).toContain(ext);
    });

    // Verify all extensions are used (with 30 items, very likely)
    const usedExtensions = new Set(
      body.map((item: { fileName: string }) => item.fileName.split('.').pop())
    );
    expect(usedExtensions.size).toBeGreaterThan(1);
  });
});
