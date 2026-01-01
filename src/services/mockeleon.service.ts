/**
 * Mockeleon Service - Core data generation engine
 *
 * Orchestrates mock data generation using Strategy Pattern with 26+ generators.
 * Validates schemas against limits and recursively processes nested structures.
 *
 * Features:
 * - Dynamic generator dispatch via canHandle()
 * - Recursive object/array handling
 * - Production limits (200 fields, 10k items)
 * - Context management for field dependencies (basedOn)
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

  generate(schema: Schema, count: number = 1): Array<Record<string, unknown>> {
    this.validateSchemaLimits(schema, count);

    const results: Array<Record<string, unknown>> = [];

    for (let i = 0; i < count; i++) {
      results.push(this.generateSingle(schema));
    }

    metricsService.recordsGenerated.inc(count);

    return results;
  }

  private validateSchemaLimits(schema: Schema, requestCount: number = 1): void {
    const totalFields = this.calculateTotalFields(schema);
    if (totalFields > MAX_SCHEMA_FIELDS) {
      throw new Error(
        `Schema has ${totalFields} fields, which exceeds the maximum allowed limit of ${MAX_SCHEMA_FIELDS} fields`
      );
    }

    const itemsPerRequest = this.calculateTotalItems(schema);
    const totalItemsToGenerate = itemsPerRequest * requestCount;

    if (totalItemsToGenerate > MAX_TOTAL_ITEMS) {
      throw new Error(
        `Schema would generate ${totalItemsToGenerate} total items (${itemsPerRequest} items per request × ${requestCount} requests), which exceeds the maximum allowed limit of ${MAX_TOTAL_ITEMS} items`
      );
    }
  }

  private calculateTotalFields(schema: Schema): number {
    let totalFields = 0;

    for (const fieldConfig of Object.values(schema)) {
      totalFields++;

      if (fieldConfig.dataType === 'object' && 'fields' in fieldConfig) {
        totalFields += this.calculateTotalFields(fieldConfig.fields);
      } else if (fieldConfig.dataType === 'array' && 'item' in fieldConfig) {
        totalFields += this.calculateFieldsInItem(
          fieldConfig.item as FieldConfig
        );
      }
    }

    return totalFields;
  }

  private calculateFieldsInItem(item: FieldConfig): number {
    if (item.dataType === 'object' && 'fields' in item) {
      return 1 + this.calculateTotalFields(item.fields);
    }
    if (item.dataType === 'array' && 'item' in item) {
      return 1 + this.calculateFieldsInItem(item.item as FieldConfig);
    }
    return 1;
  }

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
        totalItems += 1;
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
    return 1;
  }

  private generateSingle(schema: Schema): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, fieldConfig] of Object.entries(schema)) {
      result[key] = this.generateField(fieldConfig, result);
    }

    return result;
  }

  private generateField(
    fieldConfig: FieldConfig | Schema,
    context: Record<string, unknown> = {}
  ): unknown {
    if (this.isNestedSchema(fieldConfig)) {
      return this.generateSingle(fieldConfig as Schema);
    }

    const generator = this.findGenerator(fieldConfig as FieldConfig);

    if (!generator) {
      throw new Error(
        `No generator found for dataType: ${(fieldConfig as FieldConfig).dataType}`
      );
    }

    return generator.generate(fieldConfig as FieldConfig, context);
  }

  private isNestedSchema(config: unknown): boolean {
    if (!config || typeof config !== 'object') {
      return false;
    }

    if ('dataType' in config) {
      return false;
    }

    return true;
  }

  private findGenerator(config: FieldConfig): IDataGenerator | undefined {
    return this.generators.find((generator) => generator.canHandle(config));
  }

  registerGenerator(generator: IDataGenerator): void {
    this.generators.push(generator);
  }
}
