import * as crypto from 'crypto';

import type { FieldConfig, HashFieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates cryptographic hashes using various algorithms */
export class HashGenerator implements IDataGenerator<HashFieldConfig> {
  canHandle(config: FieldConfig): config is HashFieldConfig {
    return config.dataType === 'hash';
  }

  generate(
    config: HashFieldConfig,
    _context?: GeneratorContext
  ): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    const algorithm = config.algorithm ?? 'sha256';
    const randomData = Math.random().toString() + Date.now().toString();

    return crypto.createHash(algorithm).update(randomData).digest('hex');
  }
}
