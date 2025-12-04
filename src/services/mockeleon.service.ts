/**
 * @fileoverview Mockeleon Service - Core Data Generation Engine
 *
 * This service orchestrates the generation of mock data using the Strategy Pattern.
 * It maintains a registry of generators, validates schemas, and recursively processes
 * nested structures to produce realistic mock data.
 *
 * Architecture:
 * ┌───────────────────────────────────────────────────────┐
 * │                MockeleonService                          │
 * │  - Maintains generator registry                          │
 * │  - Validates schemas against limits                     │
 * │  - Recursively generates nested structures              │
 * │  - Tracks metrics                                       │
 * ├───────────────────────────────────────────────────────┤
 * │              Generator Registry                          │
 * │  - 26+ generators implementing IDataGenerator           │
 * │  - Dynamic dispatch via canHandle()                     │
 * │  - Object/Array generators recursively call service     │
 * └───────────────────────────────────────────────────────┘
 *
 * Key Features:
 *
 * 1. Strategy Pattern Implementation:
 *    - Each generator implements IDataGenerator interface
 *    - Generators are selected dynamically via canHandle() method
 *    - Easy to add new generators without modifying core logic
 *
 * 2. Recursive Schema Processing:
 *    - Handles nested objects (unlimited depth)
 *    - Handles arrays of any type (primitives, objects, arrays)
 *    - Maintains context for basedOn field dependencies
 *
 * 3. Production-Ready Limits:
 *    - MAX_SCHEMA_FIELDS (200): Prevents overly complex schemas
 *    - MAX_TOTAL_ITEMS (10,000): Prevents resource exhaustion
 *    - Validation before generation to fail fast
 *
 * 4. Context Management:
 *    - Passes previously generated fields to generators
 *    - Enables basedOn feature (e.g., email based on name)
 *    - Context is object-scoped, not global
 *
 * Security Considerations:
 * - Schema validation prevents DoS via complex schemas
 * - Limits prevent memory exhaustion
 * - No eval() or dynamic code execution
 * - Input validation via Zod schemas
 *
 * @example
 * ```typescript
 * const service = new MockeleonService();
 * const data = service.generate({
 *   name: { dataType: 'name' },
 *   email: { dataType: 'email', basedOn: 'name' },
 *   orders: {
 *     dataType: 'array',
 *     count: 3,
 *     item: {
 *       dataType: 'object',
 *       fields: {
 *         id: { dataType: 'uuid' },
 *         price: { dataType: 'price' }
 *       }
 *     }
 *   }
 * }, 10);
 * ```
 *
 * @module services/mockeleon
 */

import type { FieldConfig, Schema } from '../schema/index.js';

import { ArrayGenerator } from './generators/array.generator.js';
import { BooleanGenerator } from './generators/boolean.generator.js';
import { CityGenerator } from './generators/city.generator.js';
import { ColorGenerator } from './generators/color.generator.js';
import {
  DEFAULT_ARRAY_COUNT,
  MAX_SCHEMA_FIELDS,
  MAX_TOTAL_ITEMS,
} from './generators/constants.js';
import { CountryGenerator } from './generators/country.generator.js';
import { CryptoAddressGenerator } from './generators/crypto-address.generator.js';
import { CryptoHashGenerator } from './generators/crypto-hash.generator.js';
import { CurrencyGenerator } from './generators/currency.generator.js';
import { DateGenerator } from './generators/date.generator.js';
import { EmailGenerator } from './generators/email.generator.js';
import { FileNameGenerator } from './generators/file-name.generator.js';
import { FileSizeGenerator } from './generators/file-size.generator.js';
import { FloatGenerator } from './generators/float.generator.js';
import type { IDataGenerator } from './generators/generator.interface.js';
import { HashGenerator } from './generators/hash.generator.js';
import { IbanGenerator } from './generators/iban.generator.js';
import { IntGenerator } from './generators/int.generator.js';
import { IpGenerator } from './generators/ip.generator.js';
import { LocationGenerator } from './generators/location.generator.js';
import { MacGenerator } from './generators/mac.generator.js';
import { NameGenerator } from './generators/name.generator.js';
import { ObjectGenerator } from './generators/object.generator.js';
import { PhoneGenerator } from './generators/phone.generator.js';
import { PriceGenerator } from './generators/price.generator.js';
import { ProductGenerator } from './generators/product.generator.js';
import { StreetGenerator } from './generators/street.generator.js';
import { StringGenerator } from './generators/string.generator.js';
import { UrlGenerator } from './generators/url.generator.js';
import { UsernameGenerator } from './generators/username.generator.js';
import { UuidGenerator } from './generators/uuid.generator.js';
import { ZipCodeGenerator } from './generators/zipcode.generator.js';
import { metricsService } from './metrics.service.js';

/**
 * MockeleonService - Core data generation service using Strategy Pattern
 *
 * Responsibilities:
 * - Maintain registry of all data generators
 * - Validate schemas against resource limits
 * - Orchestrate recursive data generation
 * - Track generation metrics
 *
 * This service is stateless and thread-safe. The generator registry is
 * immutable after construction, making it safe to use across requests.
 */
export class MockeleonService {
  private readonly generators: IDataGenerator[];

  /**
   * Initialize the service and register all generators
   *
   * Generator Registration Order:
   * - Order doesn't matter for lookup (uses canHandle())
   * - ObjectGenerator and ArrayGenerator must be last
   *   (they need generateField() method reference)
   *
   * Dependency Injection:
   * - Object/Array generators receive generateField() via constructor
   * - This allows recursive processing of nested structures
   * - Using .bind(this) ensures correct 'this' context
   *
   * Why 26+ generators?
   * - Covers common use cases out of the box
   * - Each generator is single-responsibility
   * - Easy to test individually
   * - Easy to extend with new types
   */
  constructor() {
    // Register all available generators
    // Object and Array generators need access to generateField method
    // for recursive processing
    this.generators = [
      new IntGenerator(),
      new FloatGenerator(),
      new BooleanGenerator(),
      new StringGenerator(),
      new NameGenerator(),
      new EmailGenerator(),
      new PhoneGenerator(),
      new UsernameGenerator(),
      new UrlGenerator(),
      new IpGenerator(),
      new MacGenerator(),
      new UuidGenerator(),
      new DateGenerator(),
      new HashGenerator(),
      new PriceGenerator(),
      new CurrencyGenerator(),
      new IbanGenerator(),
      new CountryGenerator(),
      new CityGenerator(),
      new LocationGenerator(),
      new ZipCodeGenerator(),
      new CryptoAddressGenerator(),
      new CryptoHashGenerator(),
      new ColorGenerator(),
      new FileSizeGenerator(),
      new FileNameGenerator(),
      new StreetGenerator(),
      new ProductGenerator(),
      new ObjectGenerator(this.generateField.bind(this)),
      new ArrayGenerator(this.generateField.bind(this)),
    ];
  }

  /**
   * Generate mock data from schema definition
   *
   * This is the main entry point for data generation. It validates the schema
   * against resource limits, generates the requested number of records, and
   * tracks metrics.
   *
   * Process:
   * 1. Validate schema against limits (fail-fast if invalid)
   * 2. Generate each record independently
   * 3. Track metrics for monitoring
   * 4. Return array of generated records
   *
   * Why validate before generation?
   * - Prevents wasting resources on invalid schemas
   * - Provides clear error messages upfront
   * - Fails fast instead of timing out
   *
   * Why generate records independently?
   * - Each record should be unique
   * - No dependencies between records
   * - Could be parallelized in future (if needed)
   *
   * @param schema - Schema definition (validated by Zod before reaching here)
   * @param count - Number of records to generate (default: 1)
   * @returns Array of generated records (each is an object matching schema)
   * @throws Error if schema exceeds limits (MAX_SCHEMA_FIELDS or MAX_TOTAL_ITEMS)
   *
   * @example
   * ```typescript
   * // Simple schema
   * generate({ name: { dataType: 'name' } }, 10)
   * // Returns: [{ name: 'John Doe' }, { name: 'Jane Smith' }, ...]
   *
   * // Complex nested schema
   * generate({
   *   user: {
   *     dataType: 'object',
   *     fields: {
   *       name: { dataType: 'name' },
   *       contacts: {
   *         dataType: 'array',
   *         count: 3,
   *         item: { dataType: 'email' }
   *       }
   *     }
   *   }
   * }, 5)
   * ```
   */
  generate(schema: Schema, count: number = 1): Array<Record<string, unknown>> {
    // Validate schema against generation limits before processing
    // This prevents DoS attacks via complex schemas and ensures
    // we fail fast with clear error messages
    this.validateSchemaLimits(schema, count);

    const results: Array<Record<string, unknown>> = [];

    // Generate each record independently
    // Records don't depend on each other, ensuring each is unique
    for (let i = 0; i < count; i++) {
      results.push(this.generateSingle(schema));
    }

    // Track total records generated in metrics for monitoring
    // This helps identify usage patterns and performance issues
    metricsService.recordsGenerated.inc(count);

    return results;
  }

  /**
   * Validates schema against generation limits
   * @throws Error if schema exceeds limits
   */
  private validateSchemaLimits(schema: Schema, requestCount: number = 1): void {
    // Check total field count
    const totalFields = this.calculateTotalFields(schema);
    if (totalFields > MAX_SCHEMA_FIELDS) {
      throw new Error(
        `Schema has ${totalFields} fields, which exceeds the maximum allowed limit of ${MAX_SCHEMA_FIELDS} fields`
      );
    }

    // Check total items to be generated
    const itemsPerRequest = this.calculateTotalItems(schema);
    const totalItemsToGenerate = itemsPerRequest * requestCount;

    if (totalItemsToGenerate > MAX_TOTAL_ITEMS) {
      throw new Error(
        `Schema would generate ${totalItemsToGenerate} total items (${itemsPerRequest} items per request × ${requestCount} requests), which exceeds the maximum allowed limit of ${MAX_TOTAL_ITEMS} items`
      );
    }
  }

  /**
   * Calculates the total number of fields in a schema (including nested fields)
   */
  private calculateTotalFields(schema: Schema): number {
    let totalFields = 0;

    for (const fieldConfig of Object.values(schema)) {
      totalFields++; // Count this field

      if (fieldConfig.dataType === 'object' && 'fields' in fieldConfig) {
        // Recursively count fields in nested object
        totalFields += this.calculateTotalFields(fieldConfig.fields);
      } else if (fieldConfig.dataType === 'array' && 'item' in fieldConfig) {
        // Recursively count fields in array item schema
        totalFields += this.calculateFieldsInItem(
          fieldConfig.item as FieldConfig
        );
      }
    }

    return totalFields;
  }

  /**
   * Helper to count fields in an array item (which can be any FieldConfig)
   */
  private calculateFieldsInItem(item: FieldConfig): number {
    if (item.dataType === 'object' && 'fields' in item) {
      return 1 + this.calculateTotalFields(item.fields);
    }
    if (item.dataType === 'array' && 'item' in item) {
      return 1 + this.calculateFieldsInItem(item.item as FieldConfig);
    }
    return 1; // Primitive field
  }

  /**
   * Calculates the total number of items that will be generated for a schema
   * This includes array counts and nested structures
   */
  private calculateTotalItems(schema: Schema): number {
    let totalItems = 0;

    for (const fieldConfig of Object.values(schema)) {
      if (fieldConfig.dataType === 'array' && 'item' in fieldConfig) {
        const arrayCount = fieldConfig.count || DEFAULT_ARRAY_COUNT;
        const itemsPerArray = this.calculateItemsInField(
          fieldConfig.item as FieldConfig
        );
        totalItems += arrayCount * itemsPerArray;
      } else if (fieldConfig.dataType === 'object' && 'fields' in fieldConfig) {
        totalItems += this.calculateTotalItems(fieldConfig.fields);
      } else {
        totalItems += 1; // Primitive field
      }
    }

    return totalItems;
  }

  /**
   * Helper to calculate items in a single field config
   */
  private calculateItemsInField(item: FieldConfig): number {
    if (item.dataType === 'object' && 'fields' in item) {
      return this.calculateTotalItems(item.fields);
    }
    if (item.dataType === 'array' && 'item' in item) {
      const arrayCount = item.count || DEFAULT_ARRAY_COUNT;
      return arrayCount * this.calculateItemsInField(item.item as FieldConfig);
    }
    return 1; // Primitive field
  }

  /**
   * Generate a single data object from schema
   */
  private generateSingle(schema: Schema): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, fieldConfig] of Object.entries(schema)) {
      result[key] = this.generateField(fieldConfig, result);
    }

    return result;
  }

  /**
   * Generate value for a single field
   * Handles nested schemas recursively
   * @param context Previously generated fields in the current object
   */
  private generateField(
    fieldConfig: FieldConfig | Schema,
    context: Record<string, unknown> = {}
  ): unknown {
    // Check if it's a nested schema (plain object without dataType)
    if (this.isNestedSchema(fieldConfig)) {
      return this.generateSingle(fieldConfig as Schema);
    }

    // It's a field config, find appropriate generator
    const generator = this.findGenerator(fieldConfig as FieldConfig);

    if (!generator) {
      throw new Error(
        `No generator found for dataType: ${(fieldConfig as FieldConfig).dataType}`
      );
    }

    return generator.generate(fieldConfig as FieldConfig, context);
  }

  /**
   * Check if config is a nested schema or a field config
   */
  private isNestedSchema(config: unknown): boolean {
    if (!config || typeof config !== 'object') {
      return false;
    }

    // If it has 'dataType' property, it's a field config
    if ('dataType' in config) {
      return false;
    }

    // Otherwise, it's a nested schema
    return true;
  }

  /**
   * Find appropriate generator for field config
   */
  private findGenerator(config: FieldConfig): IDataGenerator | undefined {
    return this.generators.find((generator) => generator.canHandle(config));
  }

  /**
   * Add a custom generator at runtime
   * Useful for extending with new data types
   */
  registerGenerator(generator: IDataGenerator): void {
    this.generators.push(generator);
  }
}
