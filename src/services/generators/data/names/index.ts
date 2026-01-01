import type { LanguageCode } from '../../../../schema/data-types.js';

import {
  FIRST_NAMES_FEMALE_EN,
  FIRST_NAMES_MALE_EN,
  LAST_NAMES_EN,
} from './en.js';
import {
  FIRST_NAMES_FEMALE_RU,
  FIRST_NAMES_MALE_RU,
  LAST_NAMES_RU,
} from './ru.js';
import {
  FIRST_NAMES_FEMALE_TR,
  FIRST_NAMES_MALE_TR,
  LAST_NAMES_TR,
} from './tr.js';
import {
  FIRST_NAMES_FEMALE_ZH,
  FIRST_NAMES_MALE_ZH,
  LAST_NAMES_ZH,
} from './zh.js';

export function getFirstNames(lang: LanguageCode, isMale: boolean): string[] {
  if (lang === 'tr') {
    return isMale ? FIRST_NAMES_MALE_TR : FIRST_NAMES_FEMALE_TR;
  }
  if (lang === 'en') {
    return isMale ? FIRST_NAMES_MALE_EN : FIRST_NAMES_FEMALE_EN;
  }
  if (lang === 'zh') {
    return isMale ? FIRST_NAMES_MALE_ZH : FIRST_NAMES_FEMALE_ZH;
  }
  if (lang === 'ru') {
    return isMale ? FIRST_NAMES_MALE_RU : FIRST_NAMES_FEMALE_RU;
  }

  // For 'any', randomly select from all languages
  const allMaleNames = [
    FIRST_NAMES_MALE_TR,
    FIRST_NAMES_MALE_EN,
    FIRST_NAMES_MALE_ZH,
    FIRST_NAMES_MALE_RU,
  ];
  const allFemaleNames = [
    FIRST_NAMES_FEMALE_TR,
    FIRST_NAMES_FEMALE_EN,
    FIRST_NAMES_FEMALE_ZH,
    FIRST_NAMES_FEMALE_RU,
  ];

  const names = isMale ? allMaleNames : allFemaleNames;
  return names[Math.floor(Math.random() * names.length)]!;
}

export function getLastNames(lang: LanguageCode): string[] {
  if (lang === 'tr') return LAST_NAMES_TR;
  if (lang === 'en') return LAST_NAMES_EN;
  if (lang === 'zh') return LAST_NAMES_ZH;
  if (lang === 'ru') return LAST_NAMES_RU;

  // For 'any', randomly select from all languages
  const allLastNames = [
    LAST_NAMES_TR,
    LAST_NAMES_EN,
    LAST_NAMES_ZH,
    LAST_NAMES_RU,
  ];
  return allLastNames[Math.floor(Math.random() * allLastNames.length)]!;
}

export {
  FIRST_NAMES_FEMALE_EN,
  FIRST_NAMES_MALE_EN,
  LAST_NAMES_EN,
  FIRST_NAMES_FEMALE_TR,
  FIRST_NAMES_MALE_TR,
  LAST_NAMES_TR,
  FIRST_NAMES_FEMALE_ZH,
  FIRST_NAMES_MALE_ZH,
  LAST_NAMES_ZH,
  FIRST_NAMES_FEMALE_RU,
  FIRST_NAMES_MALE_RU,
  LAST_NAMES_RU,
};
