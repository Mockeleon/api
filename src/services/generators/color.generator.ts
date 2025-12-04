import type { ColorField, FieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates colors in hex, RGB, or HSL format */
export class ColorGenerator implements IDataGenerator<ColorField> {
  canHandle(config: FieldConfig): config is ColorField {
    return config.dataType === 'color';
  }

  generate(config: ColorField, _context?: GeneratorContext): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    const format = config.format ?? 'hex';

    switch (format) {
      case 'hex':
        return this.generateHex();
      case 'rgb':
        return this.generateRgb();
      case 'hsl':
        return this.generateHsl();
      default:
        return this.generateHex();
    }
  }

  private generateHex(): string {
    const r = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    const g = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    const b = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }

  private generateRgb(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  private generateHsl(): string {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 101);
    const l = Math.floor(Math.random() * 101);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
}
