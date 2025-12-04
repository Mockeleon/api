/**
 * Default nullable rate for all generators
 * Used when field config has nullable=true but no nullableRate specified
 */
export const DEFAULT_NULLABLE_RATE = 0.1; // 10%

/**
 * Int generator constants
 */
export const INT_DEFAULT_MIN = 0;
export const INT_DEFAULT_MAX = 1000;

/**
 * String generator constants
 */
export const SENTENCE_MIN_WORDS = 5;
export const SENTENCE_MAX_WORDS = 15;
export const PARAGRAPH_MIN_SENTENCES = 3;
export const PARAGRAPH_MAX_SENTENCES = 6;
export const DEFAULT_PARAGRAPH_COUNT = 1;
export const LANGUAGE_RANDOM_THRESHOLD = 0.5; // 50% chance for each language

/**
 * Name generator constants
 */
export const GENDER_RANDOM_THRESHOLD = 0.5; // 50% chance for male/female

/**
 * Array generator constants
 */
export const DEFAULT_ARRAY_COUNT = 1; // Default array item count

/**
 * Float generator constants
 */
export const DEFAULT_FLOAT_PRECISION = 2; // Default decimal places for float

/**
 * Price generator constants
 */
export const DEFAULT_PRICE_PRECISION = 2; // Default decimal places for price

/**
 * Boolean generator constants
 */
export const BOOLEAN_RANDOM_THRESHOLD = 0.5; // 50% chance for true/false

/**
 * Generation limits
 */
export const MAX_SCHEMA_FIELDS = 200; // Maximum total fields in a schema
export const MAX_TOTAL_ITEMS = 10000; // Maximum total items to generate (count of arrays/objects)
