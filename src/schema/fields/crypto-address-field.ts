import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const CryptoAddressFieldSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('cryptoAddress').openapi({
    description: 'Field type identifier for cryptocurrency addresses',
    example: 'cryptoAddress',
  }),
  platform: z
    .enum(['eth', 'btc', 'sol'])
    .optional()
    .default('eth')
    .openapi({
      description: 'Blockchain platform (Ethereum, Bitcoin, Solana)',
      example: 'eth',
    }),
  isPrivate: z.boolean().optional().default(false).openapi({
    description: 'Generate private key instead of public address',
    example: false,
  }),
});

export type CryptoAddressField = z.infer<typeof CryptoAddressFieldSchema>;
