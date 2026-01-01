/**
 * Text normalization utilities for handling Turkish characters and special characters
 * Used across generators to create URL-safe, filename-safe strings
 */

/**
 * Turkish character mapping for normalization
 */
const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: 'c',
  Ç: 'C',
  ğ: 'g',
  Ğ: 'G',
  ı: 'i',
  İ: 'I',
  ö: 'o',
  Ö: 'O',
  ş: 's',
  Ş: 'S',
  ü: 'u',
  Ü: 'U',
};

/**
 * Russian character mapping for transliteration
 */
const RUSSIAN_CHAR_MAP: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  А: 'A',
  Б: 'B',
  В: 'V',
  Г: 'G',
  Д: 'D',
  Е: 'E',
  Ё: 'Yo',
  Ж: 'Zh',
  З: 'Z',
  И: 'I',
  Й: 'Y',
  К: 'K',
  Л: 'L',
  М: 'M',
  Н: 'N',
  О: 'O',
  П: 'P',
  Р: 'R',
  С: 'S',
  Т: 'T',
  У: 'U',
  Ф: 'F',
  Х: 'H',
  Ц: 'Ts',
  Ч: 'Ch',
  Ш: 'Sh',
  Щ: 'Sch',
  Ъ: '',
  Ы: 'Y',
  Ь: '',
  Э: 'E',
  Ю: 'Yu',
  Я: 'Ya',
};

/**
 * Common Chinese pinyin mappings for transliteration
 * Limited set for common characters - full mapping would be extensive
 */
const CHINESE_CHAR_MAP: Record<string, string> = {
  龙: 'long',
  虎: 'hu',
  凤: 'feng',
  鹰: 'ying',
  狼: 'lang',
  狮: 'shi',
  豹: 'bao',
  熊: 'xiong',
  鲨: 'sha',
  鲸: 'jing',
  金: 'jin',
  银: 'yin',
  铜: 'tong',
  铁: 'tie',
  玉: 'yu',
  王: 'wang',
  李: 'li',
  张: 'zhang',
  刘: 'liu',
  陈: 'chen',
  杨: 'yang',
  黄: 'huang',
  赵: 'zhao',
  吴: 'wu',
  周: 'zhou',
  伟: 'wei',
  磊: 'lei',
  军: 'jun',
  强: 'qiang',
  勇: 'yong',
  芳: 'fang',
  娜: 'na',
  秀: 'xiu',
  丽: 'li',
  静: 'jing',
  超: 'chao',
  星: 'xing',
  天: 'tian',
  海: 'hai',
  火: 'huo',
};

/**
 * Transliterates non-Latin characters to ASCII equivalents
 * Handles Turkish, Russian, and common Chinese characters
 * @param text - Text containing non-Latin characters
 * @returns Text with characters transliterated to ASCII
 */
export function transliterate(text: string): string {
  return text
    .split('')
    .map((char) => {
      // Try Turkish first
      if (TURKISH_CHAR_MAP[char]) return TURKISH_CHAR_MAP[char];
      // Then Russian
      if (RUSSIAN_CHAR_MAP[char]) return RUSSIAN_CHAR_MAP[char];
      // Then Chinese (limited set)
      if (CHINESE_CHAR_MAP[char]) return CHINESE_CHAR_MAP[char];
      // Keep as-is if no mapping
      return char;
    })
    .join('');
}

/**
 * Normalizes Turkish characters to their ASCII equivalents
 * @param text - Text containing Turkish characters
 * @returns Text with Turkish characters replaced by ASCII equivalents
 */
export function normalizeTurkishChars(text: string): string {
  return text
    .split('')
    .map((char) => TURKISH_CHAR_MAP[char] ?? char)
    .join('');
}

/**
 * Converts text to URL-safe slug format
 * - Transliterates non-Latin characters (Turkish, Russian, Chinese)
 * - Converts to lowercase
 * - Replaces spaces and special characters with hyphens
 * - Removes consecutive hyphens
 * @param text - Text to convert to slug
 * @returns URL-safe slug
 */
export function toSlug(text: string): string {
  return transliterate(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Replace consecutive hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Converts text to filename-safe format
 * - Transliterates non-Latin characters (Turkish, Russian, Chinese)
 * - Converts to lowercase
 * - Replaces spaces with underscores
 * - Removes special characters
 * @param text - Text to convert to filename
 * @param separator - Separator for spaces (default: '_')
 * @returns Filename-safe string
 */
export function toFileName(text: string, separator: '_' | '-' = '_'): string {
  return transliterate(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s]+/g, separator) // Replace spaces with separator
    .replace(new RegExp(`${separator}+`, 'g'), separator) // Replace consecutive separators
    .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), ''); // Remove leading/trailing separators
}

/**
 * Converts text to username-safe format
 * - Transliterates non-Latin characters (Turkish, Russian, Chinese)
 * - Converts to lowercase
 * - Removes all spaces and special characters
 * - Only keeps alphanumeric characters and underscores
 * @param text - Text to convert to username
 * @returns Username-safe string
 */
export function toUsername(text: string): string {
  return transliterate(text)
    .toLowerCase()
    .replace(/[^\w]/g, '') // Remove all non-alphanumeric characters except underscore
    .replace(/_{2,}/g, '_') // Replace consecutive underscores with single underscore
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
}
