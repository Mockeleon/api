import * as crypto from 'crypto';

import type { CryptoAddressField, FieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates cryptocurrency addresses for various blockchains */
export class CryptoAddressGenerator
  implements IDataGenerator<CryptoAddressField>
{
  canHandle(config: FieldConfig): config is CryptoAddressField {
    return config.dataType === 'cryptoAddress';
  }

  generate(
    config: CryptoAddressField,
    _context?: GeneratorContext
  ): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    const platform = config.platform ?? 'eth';
    const isPrivate = config.isPrivate ?? false;

    if (isPrivate) {
      return this.generatePrivateKey(platform);
    }

    return this.generateAddress(platform);
  }

  private generateAddress(platform: 'eth' | 'btc' | 'sol'): string {
    switch (platform) {
      case 'eth':
        // Ethereum address: 0x + 40 hex characters
        return '0x' + this.randomHex(40);

      case 'btc':
        // Bitcoin P2PKH address: starts with 1, 26-35 characters
        return '1' + this.randomBase58(Math.floor(Math.random() * 10) + 25);

      case 'sol':
        // Solana address: base58, typically 32-44 characters
        return this.randomBase58(Math.floor(Math.random() * 13) + 32);

      default:
        return '0x' + this.randomHex(40);
    }
  }

  private generatePrivateKey(platform: 'eth' | 'btc' | 'sol'): string {
    switch (platform) {
      case 'eth':
      case 'sol':
        // Ethereum/Solana private key: 64 hex characters
        return this.randomHex(64);

      case 'btc': {
        // Bitcoin WIF private key: starts with 5, K, or L
        const prefix = ['5', 'K', 'L'][Math.floor(Math.random() * 3)];
        return prefix + this.randomBase58(50);
      }

      default:
        return this.randomHex(64);
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
