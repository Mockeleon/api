import { describe, expect, it } from 'vitest';

import { setupTestApp } from '../../utils';
import { HealthResponse } from '../../../src/routes/health/health.types';

describe('Health Routes', () => {
  // Setup app once with all routes
  const app = setupTestApp();

  describe('GET /health', () => {
    it('should return health status with 200 OK', async () => {
      // Act: Make request to health endpoint
      const response = await app.request('/health');
      const body = (await response.json()) as HealthResponse;

      // Assert: Check response structure and values
      expect(response.status).toBe(200);
      expect(body).toHaveProperty('status', 'ok');
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('uptime');
      expect(typeof body.uptime).toBe('number');
    });

    it('should return valid ISO timestamp', async () => {
      // Act
      const response = await app.request('/health');
      const body = (await response.json()) as HealthResponse;

      // Assert: Timestamp should be valid ISO string
      const timestamp = new Date(body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
      expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should return positive uptime', async () => {
      // Act
      const response = await app.request('/health');
      const body = (await response.json()) as HealthResponse;

      // Assert: Uptime should be a positive number
      expect(body.uptime).toBeGreaterThanOrEqual(0);
      expect(typeof body.uptime).toBe('number');
    });

    it('should return consistent response structure on multiple calls', async () => {
      // Act: Make multiple requests
      const response1 = await app.request('/health');
      const response2 = await app.request('/health');
      const body1 = (await response1.json()) as HealthResponse;
      const body2 = (await response2.json()) as HealthResponse;

      // Assert: Structure should be consistent
      expect(Object.keys(body1).sort()).toEqual(Object.keys(body2).sort());
      expect(body1.status).toBe(body2.status);
      // Uptime should increase (or be very close)
      expect(body2.uptime).toBeGreaterThanOrEqual(body1.uptime);
    });

    it('should have correct content-type header', async () => {
      // Act
      const response = await app.request('/health');

      // Assert
      expect(response.headers.get('content-type')).toContain(
        'application/json'
      );
    });
  });
});
