import type { LanguageCode } from '../../../../schema/data-types.js';

import { PARAGRAPHS_EN } from './en.js';
import { PARAGRAPHS_RU } from './ru.js';
import { PARAGRAPHS_TR } from './tr.js';
import { PARAGRAPHS_ZH } from './zh.js';

export function getParagraphs(lang?: LanguageCode): string[] {
  if (lang === 'tr') return PARAGRAPHS_TR;
  if (lang === 'en') return PARAGRAPHS_EN;
  if (lang === 'zh') return PARAGRAPHS_ZH;
  if (lang === 'ru') return PARAGRAPHS_RU;

  const allParagraphs = [
    PARAGRAPHS_TR,
    PARAGRAPHS_EN,
    PARAGRAPHS_ZH,
    PARAGRAPHS_RU,
  ];
  return allParagraphs[Math.floor(Math.random() * allParagraphs.length)]!;
}

export { PARAGRAPHS_EN, PARAGRAPHS_TR, PARAGRAPHS_ZH, PARAGRAPHS_RU };
