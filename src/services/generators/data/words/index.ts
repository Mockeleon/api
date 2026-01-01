import type { LanguageCode } from '../../../../schema/data-types.js';

import { WORDS_EN } from './en.js';
import { WORDS_RU } from './ru.js';
import { WORDS_TR } from './tr.js';
import { WORDS_ZH } from './zh.js';

export function getWords(lang?: LanguageCode): string[] {
  if (lang === 'tr') return WORDS_TR;
  if (lang === 'en') return WORDS_EN;
  if (lang === 'zh') return WORDS_ZH;
  if (lang === 'ru') return WORDS_RU;

  const allWords = [WORDS_TR, WORDS_EN, WORDS_ZH, WORDS_RU];
  return allWords[Math.floor(Math.random() * allWords.length)]!;
}

export { WORDS_EN, WORDS_TR, WORDS_ZH, WORDS_RU };
