import type { LanguageCode } from '../../../../schema/data-types.js';

import { SENTENCES_EN } from './en.js';
import { SENTENCES_RU } from './ru.js';
import { SENTENCES_TR } from './tr.js';
import { SENTENCES_ZH } from './zh.js';

export function getSentences(lang?: LanguageCode): string[] {
  if (lang === 'tr') return SENTENCES_TR;
  if (lang === 'en') return SENTENCES_EN;
  if (lang === 'zh') return SENTENCES_ZH;
  if (lang === 'ru') return SENTENCES_RU;

  const allSentences = [SENTENCES_TR, SENTENCES_EN, SENTENCES_ZH, SENTENCES_RU];
  return allSentences[Math.floor(Math.random() * allSentences.length)]!;
}

export { SENTENCES_EN, SENTENCES_TR, SENTENCES_ZH, SENTENCES_RU };
