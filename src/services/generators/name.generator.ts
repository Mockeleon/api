import type { FieldConfig, NameFieldConfig } from '../../schema/index.js';

import {
  DEFAULT_NULLABLE_RATE,
  GENDER_RANDOM_THRESHOLD,
  LANGUAGE_RANDOM_THRESHOLD,
} from './constants.js';
import {
  FIRST_NAMES_FEMALE_EN,
  FIRST_NAMES_MALE_EN,
  LAST_NAMES_EN,
} from './data/names/en.js';
import {
  FIRST_NAMES_FEMALE_TR,
  FIRST_NAMES_MALE_TR,
  LAST_NAMES_TR,
} from './data/names/tr.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


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
    lang: 'tr' | 'en',
    allowTriple = false
  ): string {
    const firstNames = this.getFirstNames(lang, config.gender);
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

  private generateFullName(config: NameFieldConfig, lang: 'tr' | 'en'): string {
    const firstName = this.generateFirstName(config, lang, true);
    const lastName = this.generateLastName(lang);
    return `${firstName} ${lastName}`;
  }

  private generateLastName(lang: 'tr' | 'en'): string {
    const lastNames = this.getLastNames(lang);
    return lastNames[Math.floor(Math.random() * lastNames.length)] ?? 'Surname';
  }

  /**
   * Resolve language once - if 'any' or undefined, pick random
   */
  private resolveLanguage(lang?: string): 'tr' | 'en' {
    if (lang === 'tr') return 'tr';
    if (lang === 'en') return 'en';
    // Random language for 'any' or undefined
    return Math.random() > LANGUAGE_RANDOM_THRESHOLD ? 'tr' : 'en';
  }

  private getFirstNames(lang: 'tr' | 'en', gender?: string): string[] {
    const isMale = this.resolveGender(gender);

    if (lang === 'tr') {
      return isMale ? FIRST_NAMES_MALE_TR : FIRST_NAMES_FEMALE_TR;
    }

    return isMale ? FIRST_NAMES_MALE_EN : FIRST_NAMES_FEMALE_EN;
  }

  private getLastNames(lang: 'tr' | 'en'): string[] {
    return lang === 'tr' ? LAST_NAMES_TR : LAST_NAMES_EN;
  }

  private resolveGender(gender?: string): boolean {
    if (gender === 'male') return true;
    if (gender === 'female') return false;
    return Math.random() > GENDER_RANDOM_THRESHOLD;
  }
}
