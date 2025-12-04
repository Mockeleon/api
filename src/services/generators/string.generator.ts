import type { FieldConfig, StringFieldConfig } from '../../schema/index.js';

import {
  DEFAULT_NULLABLE_RATE,
  DEFAULT_PARAGRAPH_COUNT,
  LANGUAGE_RANDOM_THRESHOLD,
  PARAGRAPH_MAX_SENTENCES,
  PARAGRAPH_MIN_SENTENCES,
  SENTENCE_MAX_WORDS,
  SENTENCE_MIN_WORDS,
} from './constants.js';
import { WORDS_EN } from './data/words/en.js';
import { WORDS_TR } from './data/words/tr.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


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
    const words = this.getWords(config.lang);
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
    const words = this.getWords(config.lang);

    // Use min/max if provided for word count in sentence
    const wordCount = this.getCount(
      config,
      SENTENCE_MIN_WORDS,
      SENTENCE_MAX_WORDS
    );
    const sentenceWords: string[] = [];

    for (let i = 0; i < wordCount; i++) {
      sentenceWords.push(
        words[Math.floor(Math.random() * words.length)] ?? 'word'
      );
    }

    let sentence = sentenceWords.join(' ');
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';

    return sentence;
  }

  private generateParagraph(config: StringFieldConfig): string {
    const paragraphCount = config.paragraphs ?? DEFAULT_PARAGRAPH_COUNT;
    const paragraphs: string[] = [];

    for (let i = 0; i < paragraphCount; i++) {
      // Use min/max if provided for sentence count in paragraph
      const sentenceCount = this.getCount(
        config,
        PARAGRAPH_MIN_SENTENCES,
        PARAGRAPH_MAX_SENTENCES
      );
      const sentences: string[] = [];

      for (let j = 0; j < sentenceCount; j++) {
        sentences.push(this.generateSentence(config));
      }

      paragraphs.push(sentences.join(' '));
    }

    return paragraphs.join('\n\n');
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

  private getWords(lang?: string): string[] {
    if (lang === 'tr') return WORDS_TR;
    if (lang === 'en') return WORDS_EN;
    return Math.random() > LANGUAGE_RANDOM_THRESHOLD ? WORDS_TR : WORDS_EN;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
