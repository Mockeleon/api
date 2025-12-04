import type { FieldConfig, FileSizeField } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates file sizes with unit conversion (B, KB, MB, GB) */
export class FileSizeGenerator implements IDataGenerator<FileSizeField> {
  canHandle(config: FieldConfig): config is FileSizeField {
    return config.dataType === 'fileSize';
  }

  generate(config: FileSizeField, _context?: GeneratorContext): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    const min = config.min ?? 1;
    const max = config.max ?? 10485760; // 10MB default
    const unit = config.unit ?? 'MB';

    const sizeInBytes = Math.floor(Math.random() * (max - min + 1)) + min;

    return this.formatSize(sizeInBytes, unit);
  }

  private formatSize(bytes: number, unit: 'B' | 'KB' | 'MB' | 'GB'): string {
    let size: number;
    let displayUnit: string;

    switch (unit) {
      case 'B':
        size = bytes;
        displayUnit = 'B';
        break;
      case 'KB':
        size = bytes / 1024;
        displayUnit = 'KB';
        break;
      case 'MB':
        size = bytes / (1024 * 1024);
        displayUnit = 'MB';
        break;
      case 'GB':
        size = bytes / (1024 * 1024 * 1024);
        displayUnit = 'GB';
        break;
      default:
        size = bytes;
        displayUnit = 'B';
    }

    // Format with 2 decimal places, remove trailing zeros
    const formatted = size.toFixed(2).replace(/\.?0+$/, '');
    return `${formatted} ${displayUnit}`;
  }
}
