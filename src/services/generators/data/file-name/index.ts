import type { LanguageCode } from '../../../../schema/data-types.js';

import {
  FILE_CATEGORIES_EN,
  FILE_CONTEXTS_EN,
  FILE_DESCRIPTORS_EN,
  FILE_TIMES_EN,
} from './en.js';
import {
  FILE_CATEGORIES_TR,
  FILE_CONTEXTS_TR,
  FILE_DESCRIPTORS_TR,
  FILE_TIMES_TR,
} from './tr.js';


export type FileCategory = 'documents' | 'media' | 'projects' | 'data' | 'code';

export function getFileCategories(lang?: LanguageCode) {
  return lang === 'tr' ? FILE_CATEGORIES_TR : FILE_CATEGORIES_EN;
}

export function getFileDescriptors(lang?: LanguageCode): string[] {
  return lang === 'tr' ? FILE_DESCRIPTORS_TR : FILE_DESCRIPTORS_EN;
}

export function getFileContexts(lang?: LanguageCode): string[] {
  return lang === 'tr' ? FILE_CONTEXTS_TR : FILE_CONTEXTS_EN;
}

export function getFileTimes(lang?: LanguageCode): string[] {
  return lang === 'tr' ? FILE_TIMES_TR : FILE_TIMES_EN;
}
