import type { FieldConfig, StringFieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE, DEFAULT_PARAGRAPH_COUNT } from './constants.js';
import { getParagraphs } from './data/paragraphs/index.js';
import { getSentences } from './data/sentences/index.js';
import { getWords } from './data/words/index.js';
import type {
  GeneratorContext,
  IDataGenerator,
} from './generator.interface.js';

/** Generates strings - words, sentences, or paragraphs in multiple languages */
export class StringGenerator implements IDataGenerator<StringFieldConfig> {
  canHandle(config: FieldConfig): config is StringFieldConfig {
    return config.dataType === 'string';
  }

  generate(
    config: StringFieldConfig,
    _context?: GeneratorContext
  ): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) {
        return null;
      }
    }

    switch (config.kind) {
      case 'word':
        return this.generateWord(config);
      case 'sentence':
        return this.generateSentence(config);
      case 'paragraph':
        return this.generateParagraph(config);
      default:
        return this.generateWord(config);
    }
  }

  private generateWord(config: StringFieldConfig): string {
    const words = getWords(config.lang);
    let result = '';

    // Use min/max if provided for word count
    const wordCount = this.getCount(config, 1, 1);

    for (let i = 0; i < wordCount; i++) {
      if (i > 0) result += ' ';
      result += words[Math.floor(Math.random() * words.length)] ?? 'word';
    }

    return result;
  }

  private generateSentence(config: StringFieldConfig): string {
    const sentences = getSentences(config.lang);

    // Return a random sentence from the curated list
    return (
      sentences[Math.floor(Math.random() * sentences.length)] ??
      'Default sentence.'
    );
  }

  private generateParagraph(config: StringFieldConfig): string {
    const paragraphs = getParagraphs(config.lang);
    const paragraphCount = config.paragraphs ?? DEFAULT_PARAGRAPH_COUNT;
    const selectedParagraphs: string[] = [];

    for (let i = 0; i < paragraphCount; i++) {
      selectedParagraphs.push(
        paragraphs[Math.floor(Math.random() * paragraphs.length)] ??
          'Default paragraph.'
      );
    }

    return selectedParagraphs.join('\n\n');
  }

  private getCount(
    config: StringFieldConfig,
    defaultMin: number,
    defaultMax: number
  ): number {
    const min = config.min ?? defaultMin;
    const max = config.max ?? defaultMax;
    return this.randomInt(min, max);
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
