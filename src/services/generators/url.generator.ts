import type { FieldConfig, UrlFieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import { getAllUrlWords, PLATFORM_URLS } from './data/url/platforms.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';
import { parseNameFromContext } from './utils/name-parser.js';


/** Generates URLs with platform-specific formatting and name-based profiles */
export class UrlGenerator implements IDataGenerator<UrlFieldConfig> {
  canHandle(config: FieldConfig): config is UrlFieldConfig {
    return config.dataType === 'url';
  }

  generate(config: UrlFieldConfig, context?: GeneratorContext): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    if (config.platform) {
      const baseUrl = PLATFORM_URLS[config.platform] ?? 'https://example.com/';
      const parsedName = parseNameFromContext(config.basedOn, context);

      if (parsedName) {
        const username = this.generateUsernameFromName(
          parsedName.firstName,
          parsedName.lastName
        );
        return `${baseUrl}${username}`;
      }

      const allWords = getAllUrlWords();
      const randomUser = allWords[Math.floor(Math.random() * allWords.length)]!;
      return `${baseUrl}${randomUser}${Math.floor(Math.random() * 1000)}`;
    }

    const allWords = getAllUrlWords();
    const word = allWords[Math.floor(Math.random() * allWords.length)]!;
    return `https://${word}${Math.floor(Math.random() * 100)}.com`;
  }

  private generateUsernameFromName(
    firstName: string,
    lastName: string
  ): string {
    const formats = [
      // firstlast
      () => `${firstName}${lastName}`,
      // first_last
      () => `${firstName}_${lastName}`,
      // first-last
      () => `${firstName}-${lastName}`,
      // first.last
      () => `${firstName}.${lastName}`,
      // flast (first initial + last)
      () => `${firstName.charAt(0)}${lastName}`,
      // firstl (first + last initial)
      () => `${firstName}${lastName.charAt(0)}`,
      // first + number
      () => `${firstName}${this.randomNumber(1, 999)}`,
      // last + number
      () => `${lastName}${this.randomNumber(1, 999)}`,
      // first-number
      () => `${firstName}-${this.randomNumber(1, 999)}`,
      // first_number
      () => `${firstName}_${this.randomNumber(1, 999)}`,
      // first only
      () => firstName,
      // last only
      () => lastName,
    ];

    const format = formats[Math.floor(Math.random() * formats.length)]!;
    return format();
  }

  private randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
