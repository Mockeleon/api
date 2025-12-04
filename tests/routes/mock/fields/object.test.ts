import { describe, expect, it } from 'vitest';

import type { MockRequest } from '../../../../src/routes/mock/mock.types';
import { setupTestApp } from '../../../utils';

describe('Object Field Generation', () => {
  const app = setupTestApp();

  it('should generate simple nested objects', async () => {
    const requestBody: MockRequest = {
      schema: {
        user: {
          dataType: 'object',
          fields: {
            id: { dataType: 'int' },
            name: { dataType: 'name', format: 'full' },
            email: { dataType: 'email' },
          },
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

    body.forEach(
      (item: { user: { id: number; name: string; email: string } }) => {
        expect(typeof item.user).toBe('object');
        expect(typeof item.user.id).toBe('number');
        expect(typeof item.user.name).toBe('string');
        expect(typeof item.user.email).toBe('string');
        expect(item.user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      }
    );
  });

  it('should generate deeply nested objects', async () => {
    const requestBody: MockRequest = {
      schema: {
        company: {
          dataType: 'object',
          fields: {
            name: { dataType: 'string', kind: 'word' },
            address: {
              dataType: 'object',
              fields: {
                street: { dataType: 'string', kind: 'sentence' },
                city: { dataType: 'string', kind: 'word' },
                zipCode: { dataType: 'int', min: 10000, max: 99999 },
              },
            },
          },
        },
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

    body.forEach(
      (item: {
        company: {
          name: string;
          address: { street: string; city: string; zipCode: number };
        };
      }) => {
        expect(typeof item.company).toBe('object');
        expect(typeof item.company.name).toBe('string');
        expect(typeof item.company.address).toBe('object');
        expect(typeof item.company.address.street).toBe('string');
        expect(typeof item.company.address.city).toBe('string');
        expect(typeof item.company.address.zipCode).toBe('number');
        expect(item.company.address.zipCode).toBeGreaterThanOrEqual(10000);
        expect(item.company.address.zipCode).toBeLessThanOrEqual(99999);
      }
    );
  });

  it('should support basedOn in nested objects', async () => {
    const requestBody: MockRequest = {
      schema: {
        profile: {
          dataType: 'object',
          fields: {
            name: { dataType: 'name', format: 'full' },
            email: { dataType: 'email', basedOn: 'name' },
            username: { dataType: 'username', basedOn: 'name' },
          },
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

    let emailMatchCount = 0;
    let usernameMatchCount = 0;

    body.forEach(
      (item: {
        profile: { name: string; email: string; username: string };
      }) => {
        expect(typeof item.profile.name).toBe('string');
        expect(typeof item.profile.email).toBe('string');
        expect(typeof item.profile.username).toBe('string');

        const nameParts = item.profile.name.toLowerCase().split(' ');
        const email = item.profile.email.toLowerCase();
        const username = item.profile.username.toLowerCase();

        // Email and username should contain part of the name
        const hasNameInEmail = nameParts.some((part) => {
          const normalized = part.replace(/[çğıöşü]/g, (match) => {
            const map: Record<string, string> = {
              ç: 'c',
              ğ: 'g',
              ı: 'i',
              ö: 'o',
              ş: 's',
              ü: 'u',
            };
            return map[match] || match;
          });
          return email.includes(normalized);
        });

        const hasNameInUsername = nameParts.some((part) => {
          const normalized = part.replace(/[çğıöşü]/g, (match) => {
            const map: Record<string, string> = {
              ç: 'c',
              ğ: 'g',
              ı: 'i',
              ö: 'o',
              ş: 's',
              ü: 'u',
            };
            return map[match] || match;
          });
          return username.includes(normalized);
        });

        if (hasNameInEmail) emailMatchCount++;
        if (hasNameInUsername) usernameMatchCount++;
      }
    );

    // At least 40% should have name reference
    expect(emailMatchCount).toBeGreaterThanOrEqual(12);
    expect(usernameMatchCount).toBeGreaterThanOrEqual(12);
  });

  it('should handle nullable object fields', async () => {
    const requestBody: MockRequest = {
      schema: {
        metadata: {
          dataType: 'object',
          fields: {
            version: { dataType: 'int' },
            timestamp: { dataType: 'date' },
          },
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
      (item: { metadata: { version: number; timestamp: number } | null }) =>
        item.metadata === null
    ).length;

    expect(nullCount).toBeGreaterThan(0);
  });

  it('should generate objects with various field types', async () => {
    const requestBody: MockRequest = {
      schema: {
        product: {
          dataType: 'object',
          fields: {
            id: { dataType: 'uuid' },
            name: { dataType: 'string', kind: 'word' },
            price: { dataType: 'price', min: 10, max: 1000 },
            inStock: { dataType: 'boolean' },
            rating: { dataType: 'float', min: 0, max: 5, decimals: 1 },
            createdAt: { dataType: 'date', format: 'iso' },
            currency: { dataType: 'currency' },
          },
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

    body.forEach(
      (item: {
        product: {
          id: string;
          name: string;
          price: string;
          inStock: boolean;
          rating: number;
          createdAt: string;
          currency: string;
        };
      }) => {
        expect(item.product.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
        expect(typeof item.product.name).toBe('string');
        expect(item.product.price).toMatch(/^\d+\.\d{2}\$$/);
        expect(typeof item.product.inStock).toBe('boolean');
        expect(item.product.rating).toBeGreaterThanOrEqual(0);
        expect(item.product.rating).toBeLessThanOrEqual(5);
        expect(item.product.createdAt).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        );
        expect(item.product.currency).toMatch(/^[A-Z]{3}$/);
      }
    );
  });

  it('should generate objects with nested arrays', async () => {
    const requestBody: MockRequest = {
      schema: {
        user: {
          dataType: 'object',
          fields: {
            name: { dataType: 'name', format: 'full' },
            emails: {
              dataType: 'array',
              item: { dataType: 'email' },
              count: 2,
            },
            phoneNumbers: {
              dataType: 'array',
              item: { dataType: 'phone' },
              count: 2,
            },
          },
        },
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

    body.forEach(
      (item: {
        user: { name: string; emails: string[]; phoneNumbers: string[] };
      }) => {
        expect(typeof item.user.name).toBe('string');
        expect(Array.isArray(item.user.emails)).toBe(true);
        expect(Array.isArray(item.user.phoneNumbers)).toBe(true);

        expect(item.user.emails.length).toBe(2);
        expect(item.user.phoneNumbers.length).toBe(2);

        item.user.emails.forEach((email) => {
          expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });

        item.user.phoneNumbers.forEach((phone) => {
          expect(phone).toMatch(/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/);
        });
      }
    );
  });

  it('should generate multiple nested objects at root level', async () => {
    const requestBody: MockRequest = {
      schema: {
        user: {
          dataType: 'object',
          fields: {
            id: { dataType: 'int' },
            name: { dataType: 'name', format: 'full' },
          },
        },
        settings: {
          dataType: 'object',
          fields: {
            theme: { dataType: 'string', kind: 'word' },
            notifications: { dataType: 'boolean' },
          },
        },
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

    body.forEach(
      (item: {
        user: { id: number; name: string };
        settings: { theme: string; notifications: boolean };
      }) => {
        expect(typeof item.user).toBe('object');
        expect(typeof item.settings).toBe('object');
        expect(typeof item.user.id).toBe('number');
        expect(typeof item.user.name).toBe('string');
        expect(typeof item.settings.theme).toBe('string');
        expect(typeof item.settings.notifications).toBe('boolean');
      }
    );
  });
});
