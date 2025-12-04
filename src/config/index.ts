/**
 * @fileoverview Environment Configuration & Validation
 *
 * This module provides type-safe environment variable validation using Zod.
 * All configuration values are validated at startup to fail-fast on misconfiguration.
 *
 * Why Zod validation?
 * - Type safety: TypeScript types are automatically inferred from schema
 * - Runtime validation: Catches configuration errors before server starts
 * - Clear error messages: Shows exactly which variables are missing/invalid
 * - Defaults: Provides sensible defaults for development
 *
 * Configuration is centralized here and re-exported as typed constants
 * to ensure consistent access across the application.
 *
 * @module config
 */

import { z } from '@hono/zod-openapi';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment variable schema with validation rules
 *
 * Each field includes:
 * - Type validation (string, enum, etc.)
 * - Format validation (URL, number ranges, etc.)
 * - Default values for development
 * - Transformation (string to number, etc.)
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z
    .string()
    .default('4000')
    .transform((v) => parseInt(v, 10)),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['error', 'info', 'debug']).default('info'),
  API_VERSION: z.string().default('v1'),
  // URL validation ensures protocol is included and format is valid
  API_DOMAIN: z.string().url().default('http://localhost:4000'),
});

/**
 * Validate environment variables against schema
 *
 * This function runs at module load time (before server starts) to ensure
 * all required configuration is present and valid. This "fail-fast" approach
 * prevents runtime errors due to misconfiguration.
 *
 * Error handling strategy:
 * 1. Parse environment variables against Zod schema
 * 2. If validation fails, format error messages for readability
 * 3. Throw error with clear instructions (stops server startup)
 * 4. In production, this prevents deploying broken configuration
 *
 * @returns Validated and typed environment configuration
 * @throws Error if validation fails with detailed error messages
 *
 * @example
 * ```typescript
 * // Missing required variable
 * // ❌ Environment validation failed:
 * //   - API_DOMAIN: Invalid url
 * //
 * // Please check your .env file.
 * ```
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
      throw new Error(
        `❌ Environment validation failed:\n${missingVars}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}

/**
 * Validated environment variables
 * This is executed at module load time, so validation happens before server starts
 */
export const env = validateEnv();

/**
 * TypeScript type for environment variables
 * Automatically inferred from Zod schema for type safety
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Application configuration object
 *
 * Organized by domain for better maintainability:
 * - server: HTTP server configuration
 * - api: API-specific settings (versioning, domain)
 * - logging: Logging configuration
 *
 * Marked as `const` to prevent accidental mutation at runtime
 */
export const config = {
  server: {
    port: env.PORT,
    host: env.HOST,
    env: env.NODE_ENV,
  },
  api: {
    version: env.API_VERSION,
    domain: env.API_DOMAIN,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
} as const;
