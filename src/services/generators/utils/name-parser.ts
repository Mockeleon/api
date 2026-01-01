import type { GeneratorContext } from '../generator.interface.js';

import { transliterate } from './text-normalizer.js';

/**
 * Result of parsing a name value
 */
export interface ParsedName {
  firstName: string;
  lastName: string;
  fullName: string;
}

/**
 * Parse a name from context based on basedOn field
 * Returns null if field doesn't exist or value is not a valid string
 */
export function parseNameFromContext(
  basedOn: string | undefined,
  context: GeneratorContext | undefined
): ParsedName | null {
  if (!basedOn || !context || !(basedOn in context)) {
    return null;
  }

  const value = context[basedOn];

  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  return parseNameValue(value);
}

/**
 * Parse a name value into firstName, lastName, and fullName
 * Handles Turkish characters and special characters
 */
export function parseNameValue(value: string): ParsedName | null {
  // Clean and split the name, converting non-Latin characters to ASCII
  const cleanValue = transliterate(value.trim().toLowerCase()).replace(
    /[^a-z\s]/gi,
    ''
  );

  const parts = cleanValue.split(/\s+/).filter((p) => p.length > 0);

  if (parts.length === 0) {
    return null;
  }

  if (parts.length === 1) {
    // Single name: use it for both firstName and lastName
    const name = parts[0]!;
    return {
      firstName: name,
      lastName: name,
      fullName: name,
    };
  }

  // Multiple parts: first and last
  const firstName = parts[0]!;
  const lastName = parts[parts.length - 1]!;

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
  };
}
