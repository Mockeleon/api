import type { FieldConfig, FileNameField } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import {
  getFileCategories,
  getFileContexts,
  getFileDescriptors,
  getFileTimes,
} from './data/file-name/index.js';
import type {
  GeneratorContext,
  IDataGenerator,
} from './generator.interface.js';
import { randomArrayItem, randomInt } from './utils/random-helper.js';
import { toFileName } from './utils/text-normalizer.js';

/** Generates realistic file names with common extensions */
export class FileNameGenerator implements IDataGenerator<FileNameField> {
  private readonly commonExtensions = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'svg',
    'mp4',
    'mp3',
    'zip',
    'rar',
    'json',
    'xml',
    'csv',
  ];

  canHandle(config: FieldConfig): config is FileNameField {
    return config.dataType === 'fileName';
  }

  generate(config: FileNameField, context?: GeneratorContext): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    // Handle 'any' lang as undefined for random selection
    const lang = config.lang === 'any' ? undefined : config.lang;

    let baseName: string;

    // If basedOn is specified and exists in context, use it
    if (config.basedOn && context && config.basedOn in context) {
      const baseValue = context[config.basedOn];
      // Normalize Turkish characters and convert to filename format with dash separator
      baseName = toFileName(String(baseValue), '-');
    } else {
      // Generate random filename
      baseName = this.generateRandomName(lang);
    }

    // Get extension
    let extension: string;
    if (config.extensions && config.extensions.length > 0) {
      extension = randomArrayItem(config.extensions);
    } else if (config.extension) {
      extension = config.extension;
    } else {
      extension = randomArrayItem(this.commonExtensions);
    }

    return `${baseName}.${extension}`;
  }

  private generateRandomName(lang?: 'en' | 'tr'): string {
    const categories = getFileCategories(lang);
    const descriptors = getFileDescriptors(lang);
    const contexts = getFileContexts(lang);
    const times = getFileTimes(lang);

    const allCategories = [
      ...categories.documents,
      ...categories.media,
      ...categories.projects,
      ...categories.data,
      ...categories.code,
    ];

    const patterns = [
      () => `${randomArrayItem(allCategories)}-${randomInt(1, 9999)}`,
      () => `${randomArrayItem(descriptors)}-${randomArrayItem(allCategories)}`,
      () => `${randomArrayItem(allCategories)}-${randomArrayItem(times)}`,
      () => `${randomArrayItem(contexts)}-${randomArrayItem(allCategories)}`,
      () =>
        `${randomArrayItem(allCategories)}-${randomArrayItem(contexts)}-${randomInt(1, 99)}`,
      () =>
        `${randomArrayItem(descriptors)}-${randomArrayItem(allCategories)}-${randomInt(1, 99)}`,
      () =>
        `${randomArrayItem(contexts)}-${randomArrayItem(allCategories)}-${randomArrayItem(times)}`,
      () =>
        `${randomArrayItem(allCategories)}-${randomArrayItem(times)}-${randomInt(1, 9)}`,
      () => `${randomArrayItem(allCategories)}-backup-${randomInt(1, 9)}`,
      () => `${randomArrayItem(times)}-${randomArrayItem(allCategories)}`,
      () => `${randomArrayItem(allCategories)}-final-v${randomInt(1, 5)}`,
      () => `${randomArrayItem(allCategories)}-copy-${randomInt(1, 9)}`,
    ];

    const generatedName = randomArrayItem(patterns)();

    // Normalize Turkish characters if present
    return toFileName(generatedName);
  }
}
