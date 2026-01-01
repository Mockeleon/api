import type { LanguageCode } from '../../../../schema/data-types.js';

import { USERNAME_WORDS_EN } from './en.js';
import { USERNAME_WORDS_RU } from './ru.js';
import { USERNAME_WORDS_TR } from './tr.js';
import { USERNAME_WORDS_ZH } from './zh.js';

export function getUsernameWords(lang?: LanguageCode): string[] {
  if (lang === 'tr') return USERNAME_WORDS_TR;
  if (lang === 'en') return USERNAME_WORDS_EN;
  if (lang === 'zh') return USERNAME_WORDS_ZH;
  if (lang === 'ru') return USERNAME_WORDS_RU;
  // Random selection when no lang specified or 'any'
  const allWords = [
    USERNAME_WORDS_TR,
    USERNAME_WORDS_EN,
    USERNAME_WORDS_ZH,
    USERNAME_WORDS_RU,
  ];
  return allWords[Math.floor(Math.random() * allWords.length)]!;
}
