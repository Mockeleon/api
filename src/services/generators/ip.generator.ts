import type { FieldConfig, IpFieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates IPv4 or IPv6 addresses */
export class IpGenerator implements IDataGenerator<IpFieldConfig> {
  canHandle(config: FieldConfig): config is IpFieldConfig {
    return config.dataType === 'ip';
  }

  generate(config: IpFieldConfig, _context?: GeneratorContext): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    const version = config.version ?? 'v4';
    return version === 'v4' ? this.generateV4() : this.generateV6();
  }

  private generateV4(): string {
    return Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 256)
    ).join('.');
  }

  private generateV6(): string {
    return Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 65536)
        .toString(16)
        .padStart(4, '0')
    ).join(':');
  }
}
