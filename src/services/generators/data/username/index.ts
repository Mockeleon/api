import type { LanguageCode } from '../../../../schema/data-types.js';

import { USERNAME_WORDS_EN } from './en.js';
import { USERNAME_WORDS_TR } from './tr.js';


export function getUsernameWords(lang?: LanguageCode): string[] {
  if (lang === 'tr') return USERNAME_WORDS_TR;
  if (lang === 'en') return USERNAME_WORDS_EN;
  // Random selection when no lang specified or 'any'
  return Math.random() > 0.5 ? USERNAME_WORDS_TR : USERNAME_WORDS_EN;
}
