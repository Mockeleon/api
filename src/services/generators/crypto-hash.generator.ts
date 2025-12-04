import * as crypto from 'crypto';

import type { CryptoHashField, FieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates blockchain transaction hashes for various platforms */
export class CryptoHashGenerator implements IDataGenerator<CryptoHashField> {
  canHandle(config: FieldConfig): config is CryptoHashField {
    return config.dataType === 'cryptoHash';
  }

  generate(
    config: CryptoHashField,
    _context?: GeneratorContext
  ): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    const platform = config.platform ?? 'eth';

    // If min/max specified, generate random length hash
    if (config.min !== undefined || config.max !== undefined) {
      const min = config.min ?? 32;
      const max = config.max ?? 64;
      const length = Math.floor(Math.random() * (max - min + 1)) + min;
      return this.randomHex(length);
    }

    // Otherwise, generate transaction hash for the platform
    return this.generateTransactionHash(platform);
  }

  private generateTransactionHash(platform: 'eth' | 'btc' | 'sol'): string {
    switch (platform) {
      case 'eth':
        // Ethereum transaction hash: 0x + 64 hex characters
        return '0x' + this.randomHex(64);

      case 'btc':
        // Bitcoin transaction hash: 64 hex characters (no 0x prefix)
        return this.randomHex(64);

      case 'sol':
        // Solana transaction signature: base58, typically 87-88 characters
        return this.randomBase58(88);

      default:
        return '0x' + this.randomHex(64);
    }
  }

  private randomHex(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .substring(0, length);
  }

  private randomBase58(length: number): string {
    const base58Chars =
      '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += base58Chars[Math.floor(Math.random() * base58Chars.length)];
    }
    return result;
  }
}
