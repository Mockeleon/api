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
 * - Normalizes Turkish characters
 * - Converts to lowercase
 * - Replaces spaces and special characters with hyphens
 * - Removes consecutive hyphens
 * @param text - Text to convert to slug
 * @returns URL-safe slug
 */
export function toSlug(text: string): string {
  return normalizeTurkishChars(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Replace consecutive hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Converts text to filename-safe format
 * - Normalizes Turkish characters
 * - Converts to lowercase
 * - Replaces spaces with underscores
 * - Removes special characters
 * @param text - Text to convert to filename
 * @param separator - Separator for spaces (default: '_')
 * @returns Filename-safe string
 */
export function toFileName(text: string, separator: '_' | '-' = '_'): string {
  return normalizeTurkishChars(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s]+/g, separator) // Replace spaces with separator
    .replace(new RegExp(`${separator}+`, 'g'), separator) // Replace consecutive separators
    .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), ''); // Remove leading/trailing separators
}

/**
 * Converts text to username-safe format
 * - Normalizes Turkish characters
 * - Converts to lowercase
 * - Removes all spaces and special characters
 * - Only keeps alphanumeric characters and underscores
 * @param text - Text to convert to username
 * @returns Username-safe string
 */
export function toUsername(text: string): string {
  return normalizeTurkishChars(text)
    .toLowerCase()
    .replace(/[^\w]/g, '') // Remove all non-alphanumeric characters except underscore
    .replace(/_{2,}/g, '_') // Replace consecutive underscores with single underscore
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
}
