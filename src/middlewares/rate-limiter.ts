/**
 * @fileoverview Rate Limiting Middleware - In-Memory Implementation
 *
 * This middleware implements token bucket rate limiting with in-memory storage.
 * It protects the API from abuse by limiting requests per IP address.
 *
 * Rate Limiting Algorithm:
 * ┌───────────────────────────────────────────────────────┐
 * │ 1. Request arrives                                        │
 * │ 2. Extract IP from headers (x-forwarded-for, etc.)       │
 * │ 3. Look up IP in store                                   │
 * │ 4. If no record or expired, create new (count = 0)       │
 * │ 5. Increment count                                        │
 * │ 6. If count > limit, reject with 429                     │
 * │ 7. If count ≤ limit, allow and add headers              │
 * │ 8. Cleanup expired entries every minute                   │
 * └───────────────────────────────────────────────────────┘
 *
 * Production Considerations:
 *
 * This implementation is suitable for:
 * ✓ Single-server deployments
 * ✓ Development environments
 * ✓ Small-scale production (< 10,000 requests/min)
 *
 * For production at scale, consider:
 * 1. Redis-based rate limiting (shared state across servers)
 * 2. Cloudflare rate limiting (edge-level protection)
 * 3. nginx limit_req module (before application layer)
 *
 * Memory Usage:
 * - Each unique IP = ~100 bytes (object + UUID)
 * - 10,000 IPs = ~1 MB memory
 * - 100,000 IPs = ~10 MB memory
 * - Cleanup runs every 60s to prevent unbounded growth
 *
 * IP Detection Strategy:
 * 1. Check x-forwarded-for (proxy/load balancer)
 * 2. Check cf-connecting-ip (Cloudflare)
 * 3. Fallback to socket remoteAddress
 *
 * This handles:
 * - Direct connections
 * - Connections through proxies
 * - Connections through Cloudflare CDN
 *
 * Security Notes:
 * - Rate limiting is per IP, not per user
 * - Can't prevent distributed attacks (botnets)
 * - Should be combined with other security measures
 * - Consider Cloudflare for DDoS protection
 *
 * Headers:
 * - X-RateLimit-Limit: Maximum requests allowed
 * - X-RateLimit-Remaining: Requests left in window
 * - X-RateLimit-Reset: Unix timestamp when limit resets
 * - Retry-After: Seconds to wait (only on 429)
 *
 * @module middlewares/rate-limiter
 */

import { type Context, type Next } from 'hono';

import log from '../config/logger.js';
import { metricsService } from '../services/metrics.service.js';

/**
 * Rate limit record stored per IP address
 *
 * Structure:
 * - count: Number of requests in current window
 * - resetTime: Unix timestamp when window expires
 *
 * When resetTime is reached:
 * - Record is deleted by cleanup process
 * - Next request creates new record with count = 0
 * - This implements sliding window rate limiting
 */
interface RateLimitStore {
  count: number;
  resetTime: number;
}

/**
 * Rate Limiting Middleware using in-memory storage
 *
 * Implements token bucket algorithm with automatic cleanup.
 * Suitable for single-server deployments and development.
 *
 * For multi-server production deployments, use Redis-based
 * rate limiting for shared state across servers.
 */
export class RateLimiter {
  /**
   * In-memory store mapping IP addresses to rate limit records
   * Key: IP address (string)
   * Value: { count, resetTime }
   */
  private store: Map<string, RateLimitStore> = new Map();

  /** Time window in milliseconds */
  private readonly windowMs: number;

  /** Maximum requests allowed per window */
  private readonly maxRequests: number;

  /**
   * Initialize rate limiter with configurable limits
   *
   * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
   * @param maxRequests - Maximum requests per window (default: 100)
   *
   * Default Configuration:
   * - 100 requests per minute = ~1.67 requests/second
   * - Reasonable for public API
   * - Prevents abuse while allowing normal usage
   *
   * Cleanup Strategy:
   * - Runs every 60 seconds via setInterval
   * - Removes expired entries to prevent memory growth
   * - Critical for long-running servers
   * - Without cleanup, memory would grow unbounded
   *
   * @example
   * ```typescript
   * // Default: 100 req/min
   * const limiter = new RateLimiter();
   *
   * // Custom: 1000 req/hour
   * const limiter = new RateLimiter(3600000, 1000);
   *
   * // Strict: 10 req/min
   * const limiter = new RateLimiter(60000, 10);
   * ```
   */
  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Cleanup expired entries every minute to prevent memory leaks
    // This is critical for production - without it, the store would
    // grow indefinitely as IPs are added but never removed
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Create middleware function for Hono
   *
   * Returns an async function that checks rate limits for each request.
   * This is called on every request before route handlers.
   *
   * Request Flow:
   * 1. Extract IP address from request
   * 2. Look up or create rate limit record
   * 3. Increment request count
   * 4. Check if limit exceeded
   * 5. If exceeded: reject with 429 and retry headers
   * 6. If allowed: add rate limit headers and continue
   *
   * @returns Hono middleware function
   */
  middleware() {
    return async (c: Context, next: Next) => {
      // Extract IP address using multi-source detection
      // Handles proxies, load balancers, and Cloudflare
      const identifier = this.getIdentifier(c);
      const now = Date.now();

      // Look up existing rate limit record for this IP
      let record = this.store.get(identifier);

      // Create new record or reset if window expired
      // This implements sliding window: after window expires,
      // IP gets a fresh start with count = 0
      if (!record || now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + this.windowMs,
        };
        this.store.set(identifier, record);
      }

      // Increment count for this request
      record.count++;

      // Check if rate limit exceeded
      // Using > instead of >= means maxRequests is inclusive
      if (record.count > this.maxRequests) {
        // Calculate seconds until window resets
        // Client should wait this long before retrying
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);

        // Track rate limit hit in Prometheus metrics
        // Helps identify:
        // - Abusive users
        // - Whether limits are too strict
        // - Need for rate limit increases
        metricsService.rateLimitHits.inc();

        // Log rate limit hit for monitoring
        // Debug level since this is expected behavior, not an error
        log.debug(
          `Rate limit exceeded for ${identifier} on ${c.req.path} (${record.count}/${this.maxRequests})`
        );

        // RFC 6585: Retry-After header tells client when to retry
        c.header('Retry-After', retryAfter.toString());
        // Standard rate limit headers (RFC draft)
        c.header('X-RateLimit-Limit', this.maxRequests.toString());
        c.header('X-RateLimit-Remaining', '0');
        c.header(
          'X-RateLimit-Reset',
          Math.ceil(record.resetTime / 1000).toString()
        );

        // Return 429 Too Many Requests (RFC 6585)
        // Client should implement exponential backoff
        return c.json(
          {
            status: 'error',
            message: 'Too many requests, please try again later',
          },
          429
        );
      }

      // Add rate limit headers to successful response
      // These headers inform clients about their rate limit status:
      // - Limit: Total requests allowed
      // - Remaining: Requests left in current window
      // - Reset: When the window resets (Unix timestamp)
      //
      // Clients can use these to implement client-side throttling
      // and avoid hitting the rate limit
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
    // Try to get real IP from headers (for proxies/load balancers)
    const forwarded = c.req.header('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0]?.trim() ?? 'unknown';
    }

    const realIp = c.req.header('x-real-ip');
    if (realIp) {
      return realIp;
    }

    // Cloudflare connecting IP
    const cfIp = c.req.header('cf-connecting-ip');
    if (cfIp) {
      return cfIp;
    }

    // Try to get remote address from Hono context
    // Note: In production with Nginx, x-forwarded-for or x-real-ip should be set
    // This is a last resort fallback
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const remoteAddr = c.env?.remoteAddr as string | undefined;
    if (remoteAddr) {
      return remoteAddr;
    }

    // Ultimate fallback - use a constant to indicate unknown client
    // This will rate limit all unknown clients together (acceptable for fallback)
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
