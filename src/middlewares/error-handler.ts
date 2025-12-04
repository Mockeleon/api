/**
 * @fileoverview Global Error Handler Middleware
 *
 * This middleware provides centralized error handling for the entire application.
 * It catches all errors thrown by routes and other middlewares, logs them with
 * unique IDs for tracking, and returns consistent JSON error responses.
 *
 * Why middleware order matters:
 * ┌────────────────────────────────────────────┐
 * │     errorHandler (MUST BE FIRST)             │
 * │  ┌──────────────────────────────────────┐  │
 * │  │     Other middlewares                 │  │
 * │  │  ┌───────────────────────────────┐  │  │
 * │  │  │     Route handlers           │  │  │
 * │  │  │  (can throw errors)        │  │  │
 * │  │  └───────────────────────────────┘  │  │
 * │  │  Errors bubble up ↑                 │  │
 * │  └──────────────────────────────────────┘  │
 * │  Errors caught here and formatted         │
 * └────────────────────────────────────────────┘
 *
 * Key Features:
 *
 * 1. Error Tracking:
 *    - Generates unique UUID for each error
 *    - Allows correlation between logs and user reports
 *    - Users can reference error ID in support requests
 *
 * 2. Environment-Aware Responses:
 *    - Development: Includes stack traces for debugging
 *    - Production: Hides internal details for security
 *    - Always logs full error details server-side
 *
 * 3. Consistent JSON Format:
 *    - All errors return same JSON structure
 *    - Makes error handling predictable for clients
 *    - Includes error ID for tracking
 *
 * Security Considerations:
 * - Never expose internal error details in production
 * - Stack traces could reveal code structure
 * - Error messages should be generic ("Internal server error")
 * - Detailed errors only logged server-side
 *
 * Error Response Format:
 * ```json
 * {
 *   "status": "error",
 *   "message": "User-friendly error message",
 *   "errorId": "550e8400-e29b-41d4-a716-446655440000",
 *   "stack": "..." // Only in development
 * }
 * ```
 *
 * @module middlewares/error-handler
 */

import { randomUUID } from 'node:crypto';

import { type Context, type Next } from 'hono';

import { config } from '../config/index.js';
import log from '../config/logger.js';

/**
 * Global error handling middleware
 *
 * This middleware wraps all other middlewares and routes to catch any errors
 * that occur during request processing. It must be registered FIRST in the
 * middleware chain to catch errors from all other middlewares.
 *
 * Error Flow:
 * 1. Try to execute next middleware/route
 * 2. If error thrown, catch it here
 * 3. Generate unique error ID (UUID)
 * 4. Log full error details with ID
 * 5. Return formatted JSON response (hide details in production)
 *
 * Why unique error IDs?
 * - Users can report "Error ID: abc-123"
 * - Support can search logs for that specific error
 * - Correlates user reports with server logs
 * - Multiple users hitting same error show pattern
 *
 * @param c - Hono context object
 * @param next - Next middleware/route in chain
 * @returns JSON error response with 500 status code
 *
 * @example
 * ```typescript
 * // In index.ts (MUST BE FIRST)
 * app.use('*', errorHandler);
 * app.use('*', otherMiddleware);
 *
 * // In any route
 * app.get('/example', () => {
 *   throw new Error('Something went wrong');
 *   // This error will be caught by errorHandler
 * });
 * ```
 */
export async function errorHandler(c: Context, next: Next) {
  try {
    // Execute next middleware/route in chain
    // Any error thrown will be caught below
    return await next();
  } catch (err) {
    // Generate unique error ID for tracking
    // This UUID allows correlation between user reports and server logs
    const errorId = randomUUID();
    const error = err as Error;

    // Log full error details server-side
    // This is CRITICAL for debugging - we need all details in logs
    // even though we hide them from users in production
    log.error(`[${errorId}] Unhandled error:`, {
      errorId,
      message: error.message,
      stack: error.stack,
      error: err, // Full error object for additional properties
    });

    // Return formatted JSON error response
    // Response varies by environment:
    // - Development: Include stack trace for debugging
    // - Production: Hide stack trace for security
    return c.json(
      {
        status: 'error',
        // Use error message if available, fallback to generic message
        message: error.message || 'Internal server error',
        // Include error ID so users can report it
        errorId,
        // Only include stack trace in development
        // Stack traces can reveal code structure and file paths
        ...(config.server.env === 'development' && {
          stack: error.stack,
        }),
      },
      500 // Always return 500 for unhandled errors
    );
  }
}
