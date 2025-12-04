/**
 * @fileoverview Data Generator Interface - Strategy Pattern Implementation
 *
 * This module defines the contract for all data generators in Mockeleon.
 * Generators follow the Strategy Pattern, allowing dynamic selection of
 * generation algorithms based on field configuration.
 *
 * Why Strategy Pattern?
 * - Extensibility: Add new generators without modifying existing code
 * - Testability: Each generator can be tested in isolation
 * - Maintainability: Generator logic is encapsulated in single-responsibility classes
 * - Type Safety: TypeScript ensures generators handle correct field types
 *
 * How it works:
 * 1. MockeleonService maintains a registry of all generators
 * 2. For each field, it calls canHandle() on each generator
 * 3. First generator that returns true handles the field
 * 4. Generator's generate() method produces the value
 *
 * Example generator implementation:
 * ```typescript
 * class IntGenerator implements IDataGenerator<IntFieldConfig> {
 *   canHandle(config: FieldConfig): config is IntFieldConfig {
 *     return config.dataType === 'int';
 *   }
 *
 *   generate(config: IntFieldConfig): number {
 *     return Math.floor(Math.random() * (config.max - config.min)) + config.min;
 *   }
 * }
 * ```
 *
 * Adding a new generator:
 * 1. Create class implementing IDataGenerator<YourFieldConfig>
 * 2. Implement canHandle() to check dataType
 * 3. Implement generate() with your logic
 * 4. Register in MockeleonService constructor
 * 5. Add Zod schema validation
 * 6. Write tests
 *
 * See CONTRIBUTING.md for detailed guide.
 *
 * @module services/generators
 */

import type { FieldConfig } from '../../schema/index.js';

/**
 * Context passed to generators containing previously generated field values
 *
 * This enables the "basedOn" feature where a field's value can depend on
 * another field's value (e.g., email based on name field).
 *
 * Example:
 * ```typescript
 * // Field generation order:
 * // 1. name: "John Doe" is generated first
 * // 2. email generator receives context = { name: "John Doe" }
 * // 3. email can use context.name to generate "john.doe@example.com"
 * ```
 */
export type GeneratorContext = Record<string, unknown>;

/**
 * Base interface for all data generators using Strategy Pattern
 *
 * Generic type parameter T extends FieldConfig to ensure type safety:
 * - Generator only receives configurations it can handle
 * - TypeScript validates config properties at compile time
 * - No runtime type checking needed in generate() method
 *
 * @typeParam T - The specific field configuration type this generator handles
 *
 * @example
 * ```typescript
 * // String generator handles StringFieldConfig
 * class StringGenerator implements IDataGenerator<StringFieldConfig> {
 *   canHandle(config: FieldConfig): config is StringFieldConfig {
 *     return config.dataType === 'string';
 *   }
 *
 *   generate(config: StringFieldConfig): string {
 *     // config is typed as StringFieldConfig here
 *     // TypeScript knows about minLength, maxLength, etc.
 *     return generateString(config.minLength, config.maxLength);
 *   }
 * }
 * ```
 */
export interface IDataGenerator<T extends FieldConfig = FieldConfig> {
  /**
   * Generate a value based on field configuration
   *
   * This method contains the core generation logic for a specific data type.
   * It should handle all configuration options for that type.
   *
   * Responsibilities:
   * - Generate appropriate value based on config options
   * - Handle nullable fields (return null based on probability)
   * - Use context for basedOn dependencies
   * - Validate basedOn values if needed
   *
   * Important: This method should be deterministic for the same config
   * (unless randomness is intended). This helps with testing.
   *
   * @param config - Field configuration (type-safe, validated by Zod)
   * @param context - Previously generated fields in current object (for basedOn)
   * @returns Generated value (any type) or null if nullable condition triggers
   *
   * @example
   * ```typescript
   * // Simple generation
   * generate({ dataType: 'int', min: 1, max: 100 })
   * // Returns: 42
   *
   * // With context (basedOn)
   * generate(
   *   { dataType: 'email', basedOn: 'name' },
   *   { name: 'John Doe' }
   * )
   * // Returns: "john.doe@example.com"
   *
   * // Nullable field
   * generate({ dataType: 'string', nullable: true, nullProbability: 0.5 })
   * // Returns: "value" or null (50% chance each)
   * ```
   */
  generate(config: T, context?: GeneratorContext): unknown;

  /**
   * Type guard to check if this generator can handle a field configuration
   *
   * This is the Strategy Pattern's selection mechanism. MockeleonService calls
   * this on each generator until one returns true.
   *
   * Implementation notes:
   * - Should be fast (called for every field)
   * - Should only check dataType (don't validate all options here)
   * - Returns a TypeScript type predicate for type narrowing
   *
   * The type predicate `config is T` tells TypeScript:
   * "If this returns true, treat config as type T from now on"
   *
   * @param config - Field configuration to check (any field type)
   * @returns Type predicate indicating if this generator handles the config
   *
   * @example
   * ```typescript
   * class EmailGenerator implements IDataGenerator<EmailFieldConfig> {
   *   canHandle(config: FieldConfig): config is EmailFieldConfig {
   *     // Simple check - just verify dataType matches
   *     return config.dataType === 'email';
   *   }
   * }
   *
   * // Usage in MockeleonService:
   * const generator = this.generators.find(g => g.canHandle(fieldConfig));
   * if (generator) {
   *   // TypeScript knows fieldConfig matches generator's type here
   *   const value = generator.generate(fieldConfig, context);
   * }
   * ```
   */
  canHandle(config: FieldConfig): config is T;
}
