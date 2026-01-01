/**
 * Environment Configuration - Type-safe configuration with Zod validation
 *
 * Features:
 * - Runtime validation at startup
 * - Type-safe access
 * - Sensible defaults for development
 */

import { z } from '@hono/zod-openapi';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z
    .string()
    .default('4000')
    .transform((v) => parseInt(v, 10)),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['error', 'info', 'debug']).default('info'),
  API_VERSION: z.string().default('v1'),
  API_DOMAIN: z.string().default('http://localhost:4000'),
});

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

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;

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
