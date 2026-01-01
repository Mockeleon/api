import type {
  FieldConfig,
  UsernameFieldConfig,
  LanguageCode,
} from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import { getUsernameWords } from './data/username/index.js';
import type {
  GeneratorContext,
  IDataGenerator,
} from './generator.interface.js';
import { parseNameFromContext } from './utils/name-parser.js';
import { toUsername } from './utils/text-normalizer.js';

/** Generates usernames with name-based or random patterns */
export class UsernameGenerator implements IDataGenerator<UsernameFieldConfig> {
  canHandle(config: FieldConfig): config is UsernameFieldConfig {
    return config.dataType === 'username';
  }

  generate(
    config: UsernameFieldConfig,
    context?: GeneratorContext
  ): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) {
        return null;
      }
    }

    // Try to parse name from context if basedOn is specified
    const parsedName = parseNameFromContext(config.basedOn, context);

    if (parsedName) {
      return this.generateFromName(parsedName.firstName, parsedName.lastName);
    }

    // Convert 'any' to undefined for random selection
    const lang = config.lang === 'any' ? undefined : config.lang;

    // Generate random username
    return this.generateRandom(lang);
  }

  private generateFromName(firstName: string, lastName: string): string {
    // Normalize Turkish characters for both names
    const normalizedFirst = toUsername(firstName);
    const normalizedLast = toUsername(lastName);

    const formats = [
      // firstlast
      () => `${normalizedFirst}${normalizedLast}`,
      // first_last
      () => `${normalizedFirst}_${normalizedLast}`,
      // first.last
      () => `${normalizedFirst}.${normalizedLast}`,
      // flast (first initial + last)
      () => `${normalizedFirst.charAt(0)}${normalizedLast}`,
      // firstl (first + last initial)
      () => `${normalizedFirst}${normalizedLast.charAt(0)}`,
      // first + number
      () => `${normalizedFirst}${this.randomNumber(1, 999)}`,
      // last + number
      () => `${normalizedLast}${this.randomNumber(1, 999)}`,
      // first only
      () => normalizedFirst,
      // last only
      () => normalizedLast,
    ];

    const format = formats[Math.floor(Math.random() * formats.length)]!;
    return format();
  }

  private generateRandom(lang?: LanguageCode): string {
    const words = getUsernameWords(lang);
    const word1 = words[Math.floor(Math.random() * words.length)]!;
    const word2 = words[Math.floor(Math.random() * words.length)]!;
    const num = this.randomNumber(1, 9999);

    // Normalize Turkish characters
    const normalizedWord1 = toUsername(word1);
    const normalizedWord2 = toUsername(word2);

    const formats = [
      () => `${normalizedWord1}${num}`,
      () => `${normalizedWord1}_${normalizedWord2}`,
      () => `${normalizedWord1}${normalizedWord2}`,
      () => `${normalizedWord1}.${normalizedWord2}`,
      () => `${normalizedWord1}_${num}`,
      () => normalizedWord1,
    ];

    const format = formats[Math.floor(Math.random() * formats.length)]!;
    return format();
  }

  private randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
