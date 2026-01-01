import type { LanguageCode } from '../../schema/data-types.js';
import type { FieldConfig, NameFieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE, GENDER_RANDOM_THRESHOLD } from './constants.js';
import { getFirstNames, getLastNames } from './data/names/index.js';
import type {
  GeneratorContext,
  IDataGenerator,
} from './generator.interface.js';

/** Generates person names with support for multiple languages and genders */
export class NameGenerator implements IDataGenerator<NameFieldConfig> {
  canHandle(config: FieldConfig): config is NameFieldConfig {
    return config.dataType === 'name';
  }

  generate(
    config: NameFieldConfig,
    _context?: GeneratorContext
  ): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) {
        return null;
      }
    }

    const resolvedLang = this.resolveLanguage(config.lang);
    const format = config.format ?? 'full';

    switch (format) {
      case 'first':
        return this.generateFirstName(config, resolvedLang, true);
      case 'last':
        return this.generateLastName(resolvedLang);
      case 'full':
        return this.generateFullName(config, resolvedLang);
      default:
        return this.generateFirstName(config, resolvedLang, true);
    }
  }

  private generateFirstName(
    config: NameFieldConfig,
    lang: LanguageCode,
    allowTriple = false
  ): string {
    const isMale = this.resolveGender(config.gender);
    const firstNames = getFirstNames(lang, isMale);
    const firstName =
      firstNames[Math.floor(Math.random() * firstNames.length)] ?? 'Name';

    // Check if triple name should be generated
    if (allowTriple && config.tripleNameRate && config.tripleNameRate > 0) {
      if (Math.random() < config.tripleNameRate) {
        const secondName =
          firstNames[Math.floor(Math.random() * firstNames.length)] ?? 'Name';
        return `${firstName} ${secondName}`;
      }
    }

    return firstName;
  }

  private generateFullName(
    config: NameFieldConfig,
    lang: LanguageCode
  ): string {
    const firstName = this.generateFirstName(config, lang, true);
    const lastName = this.generateLastName(lang);
    return `${firstName} ${lastName}`;
  }

  private generateLastName(lang: LanguageCode): string {
    const lastNames = getLastNames(lang);
    return lastNames[Math.floor(Math.random() * lastNames.length)] ?? 'Surname';
  }

  /**
   * Resolve language once - if 'any' or undefined, pick random
   */
  private resolveLanguage(lang?: LanguageCode): LanguageCode {
    if (lang === 'tr') return 'tr';
    if (lang === 'en') return 'en';
    if (lang === 'zh') return 'zh';
    if (lang === 'ru') return 'ru';

    // Random language for 'any' or undefined
    const languages: LanguageCode[] = ['tr', 'en', 'zh', 'ru'];
    return languages[Math.floor(Math.random() * languages.length)]!;
  }

  private resolveGender(gender?: string): boolean {
    if (gender === 'male') return true;
    if (gender === 'female') return false;
    return Math.random() > GENDER_RANDOM_THRESHOLD;
  }
}
