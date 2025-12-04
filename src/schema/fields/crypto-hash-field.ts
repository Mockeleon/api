import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const CryptoHashFieldSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('cryptoHash').openapi({
    description: 'Field type identifier for cryptocurrency transaction hashes',
    example: 'cryptoHash',
  }),
  platform: z
    .enum(['eth', 'btc', 'sol'])
    .optional()
    .default('eth')
    .openapi({
      description: 'Blockchain platform (Ethereum, Bitcoin, Solana)',
      example: 'eth',
    }),
  min: z.number().int().positive().optional().openapi({
    description:
      'Minimum length for random hash (if specified, generates custom length hash instead of transaction hash)',
    example: 32,
  }),
  max: z.number().int().positive().optional().openapi({
    description: 'Maximum length for random hash',
    example: 64,
  }),
}).refine(
  (data) => {
    if (data.min !== undefined && data.max !== undefined) {
      return data.min <= data.max;
    }
    return true;
  },
  {
    message: 'min must be less than or equal to max',
  }
);

export type CryptoHashField = z.infer<typeof CryptoHashFieldSchema>;
