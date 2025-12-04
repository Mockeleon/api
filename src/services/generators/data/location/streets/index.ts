import type { LanguageCode } from '../../../../../schema/data-types.js';

import { STREET_NAMES_EN } from './en.js';
import { STREET_NAMES_TR } from './tr.js';


export interface StreetName {
  name: string;
  lang: LanguageCode;
}

export function getStreetNames(lang?: LanguageCode): string[] {
  if (lang === 'tr') return STREET_NAMES_TR;
  if (lang === 'en') return STREET_NAMES_EN;
  // Random selection when no lang specified or 'any'
  return Math.random() > 0.5 ? STREET_NAMES_TR : STREET_NAMES_EN;
}
