import { DEFAULT_NULLABLE_RATE } from '../constants.js';

/**
 * Check if a field should return null based on nullable configuration
 * @param config Field configuration with nullable and nullableRate properties
 * @returns true if the field should return null, false otherwise
 */
export function shouldReturnNull(config: {
  nullable?: boolean | undefined;
  nullableRate?: number | undefined;
}): boolean {
  if (!config.nullable) {
    return false;
  }

  const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
  return Math.random() < rate;
}
