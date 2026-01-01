/**
 * Rate limiting middleware using in-memory storage
 *
 * Implements token bucket algorithm to limit requests per IP address.
 * Suitable for single-server deployments. For multi-server production,
 * use Redis-based rate limiting.
 *
 * Features:
 * - Automatic cleanup of expired entries
 * - Configurable window and limits
 * - Standard rate limit headers (X-RateLimit-*)
 */

import { type Context, type Next } from 'hono';

import log from '../config/logger.js';
import { metricsService } from '../services/metrics.service.js';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitStore> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    setInterval(() => this.cleanup(), 60000);
  }

  middleware() {
    return async (c: Context, next: Next) => {
      const identifier = this.getIdentifier(c);
      const now = Date.now();

      let record = this.store.get(identifier);

      if (!record || now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + this.windowMs,
        };
        this.store.set(identifier, record);
      }

      record.count++;

      if (record.count > this.maxRequests) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);

        metricsService.rateLimitHits.inc();

        log.debug(
          `Rate limit exceeded for ${identifier} on ${c.req.path} (${record.count}/${this.maxRequests})`
        );

        c.header('Retry-After', retryAfter.toString());
        c.header('X-RateLimit-Limit', this.maxRequests.toString());
        c.header('X-RateLimit-Remaining', '0');
        c.header(
          'X-RateLimit-Reset',
          Math.ceil(record.resetTime / 1000).toString()
        );

        return c.json(
          {
            status: 'error',
            message: 'Too many requests, please try again later',
          },
          429
        );
      }

      c.header('X-RateLimit-Limit', this.maxRequests.toString());
      c.header(
        'X-RateLimit-Remaining',
        (this.maxRequests - record.count).toString()
      );
      c.header(
        'X-RateLimit-Reset',
        Math.ceil(record.resetTime / 1000).toString()
      );

      return next();
    };
  }

  private getIdentifier(c: Context): string {
    const forwarded = c.req.header('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0]?.trim() ?? 'unknown';
    }

    const realIp = c.req.header('x-real-ip');
    if (realIp) {
      return realIp;
    }

    const cfIp = c.req.header('cf-connecting-ip');
    if (cfIp) {
      return cfIp;
    }

    const remoteAddr = c.env?.remoteAddr as string | undefined;
    if (remoteAddr) {
      return remoteAddr;
    }

    return 'unknown-client';
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      log.debug(`Rate limiter: cleaned ${cleaned} expired entries`);
    }
  }
}
