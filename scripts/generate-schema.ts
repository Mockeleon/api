#!/usr/bin/env tsx

/**
 * @fileoverview Schema Generator Script
 *
 * This script dynamically generates a JSON schema from Zod field definitions.
 * It introspects all field schemas in src/schema/fields/ and extracts:
 * - Field types and their parameters
 * - Validation rules (min, max, enum values, etc.)
 * - Descriptions and examples from OpenAPI metadata
 * - Default values and required/optional status
 *
 * Purpose:
 * - Powers frontend playground (GraphQL playground-like interface)
 * - Auto-discovery of new fields (no manual updates needed)
 * - Single source of truth for API capabilities
 * - Type-safe schema generation
 *
 * Usage:
 *   npm run generate:schema
 *
 * Output:
 *   public/api-schema.json
 *
 * Architecture:
 * 1. Scan src/schema/fields/*.ts dynamically
 * 2. Import each field's Zod schema
 * 3. Parse Zod schema using introspection (_def)
 * 4. Extract metadata (type, constraints, descriptions)
 * 5. Generate JSON schema structure
 * 6. Write to public/api-schema.json
 *
 * @module scripts/generate-schema
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, writeFileSync } from 'node:fs';

import {
  CATEGORY_PATTERNS,
  DEFAULT_CATEGORY,
  FIELD_DESCRIPTION_TEMPLATES,
  PARAMETER_DESCRIPTIONS,
  SCHEMA_VERSION,
} from './generate-schema-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname);

interface FieldParameter {
  type: string;
  description?: string;
  required: boolean;
  default?: unknown;
  possibleValues?: unknown[];
  min?: number;
  max?: number;
  pattern?: string;
}

interface FieldSchema {
  dataType: string;
  category: string;
  description: string;
  parameters: Record<string, FieldParameter>;
}

interface APISchema {
  version: string;
  generatedAt: string;
  baseParameters: Record<string, FieldParameter>;
  fields: Record<string, FieldSchema>;
}

/**
 * Extract parameter metadata from Zod schema definition
 * Supports both Zod v3 and v4 structures
 */
function extractParameterInfo(
  zodDef: any,
  fieldName: string,
  openapiMetadata?: any
): FieldParameter {
  const param: FieldParameter = {
    type: 'unknown',
    required: true,
    description: generateParameterDescription(fieldName),
  };

  // Zod v4 uses 'type' instead of 'typeName'
  const defType = zodDef.type || zodDef.typeName;

  // Handle ZodOptional and ZodDefault
  if (defType === 'optional' || defType === 'ZodOptional') {
    param.required = false;
    const innerType = zodDef.innerType || zodDef.unwrap?.();
    if (innerType?._def) {
      const innerParam = extractParameterInfo(
        innerType._def,
        fieldName,
        openapiMetadata
      );
      return {
        ...innerParam,
        required: false,
      };
    }
    return param;
  }

  if (defType === 'default' || defType === 'ZodDefault') {
    param.required = false;
    param.default =
      typeof zodDef.defaultValue === 'function'
        ? zodDef.defaultValue()
        : zodDef.defaultValue;
    const innerType = zodDef.innerType || zodDef.schema;
    if (innerType?._def) {
      const innerParam = extractParameterInfo(
        innerType._def,
        fieldName,
        openapiMetadata
      );
      return {
        ...innerParam,
        default: param.default,
        required: false,
      };
    }
    return param;
  }

  // Handle specific types (Zod v4 structure)
  switch (defType) {
    case 'string':
    case 'ZodString':
      param.type = 'string';
      // Extract pattern from checks
      if (zodDef.checks) {
        for (const check of zodDef.checks) {
          if (check.kind === 'regex') param.pattern = check.regex.source;
          if (check.kind === 'min') param.min = check.value;
          if (check.kind === 'max') param.max = check.value;
        }
      }
      break;

    case 'number':
    case 'ZodNumber':
      param.type = 'number';
      // Extract min/max from checks
      if (zodDef.checks) {
        for (const check of zodDef.checks) {
          if (check.kind === 'min') param.min = check.value;
          if (check.kind === 'max') param.max = check.value;
          if (check.kind === 'int') param.type = 'integer';
        }
      }
      break;

    case 'boolean':
    case 'ZodBoolean':
      param.type = 'boolean';
      break;

    case 'enum':
    case 'ZodEnum':
      param.type = 'enum';
      // Zod v4: values in entries object or options array
      param.possibleValues =
        zodDef.values ||
        zodDef.options ||
        (zodDef.entries ? Object.keys(zodDef.entries) : undefined);
      break;

    case 'literal':
    case 'ZodLiteral':
      param.type = 'literal';
      param.possibleValues = zodDef.values || [zodDef.value];
      break;

    case 'array':
    case 'ZodArray':
      param.type = 'array';
      // Extract possible values from array item type (e.g., array of enums)
      // Zod v4 uses 'element' property for array item type
      const arrayType = zodDef.element || zodDef.type || zodDef.schema;
      if (arrayType) {
        // Direct access to options for Zod v4
        if (arrayType.options) {
          param.possibleValues = arrayType.options;
        }
        // Fallback to _def structure
        else if (arrayType._def || arrayType.def) {
          const arrayItemDef = arrayType._def || arrayType.def;
          const arrayItemType = arrayItemDef.type || arrayItemDef.typeName;

          // If array contains enum values, extract them
          if (arrayItemType === 'enum' || arrayItemType === 'ZodEnum') {
            param.possibleValues = arrayItemDef.values || arrayItemDef.options;
          }
        }
      }
      break;

    case 'object':
    case 'ZodObject':
      param.type = 'object';
      break;

    case 'union':
    case 'ZodUnion':
      param.type = 'union';
      break;

    case 'any':
    case 'ZodAny':
      param.type = 'any';
      break;
  }

  return param;
}

/**
 * Auto-categorize field type using config patterns
 */
function categorizeField(dataType: string): string {
  const lower = dataType.toLowerCase();

  for (const { category, patterns } of CATEGORY_PATTERNS) {
    for (const pattern of patterns) {
      if (typeof pattern === 'string') {
        if (pattern === lower) return category;
      } else if (pattern instanceof RegExp) {
        if (pattern.test(lower)) return category;
      }
    }
  }

  return DEFAULT_CATEGORY;
}

/**
 * Auto-generate human-readable description from field name
 * Uses config templates or generates from dataType
 */
function generateFieldDescription(dataType: string): string {
  // Check if custom description exists in config
  if (FIELD_DESCRIPTION_TEMPLATES[dataType]) {
    return FIELD_DESCRIPTION_TEMPLATES[dataType];
  }

  // Generate generic description
  const words = dataType
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(/[\s_-]+/)
    .map((w) => w.toLowerCase());

  const formatted = words.join(' ');
  return `Generates ${formatted} values`;
}

/**
 * Auto-generate parameter description from parameter name
 * Uses config descriptions or generates generic one
 */
function generateParameterDescription(paramName: string): string {
  // Check config first
  if (PARAMETER_DESCRIPTIONS[paramName]) {
    return PARAMETER_DESCRIPTIONS[paramName];
  }

  // Generate generic description
  const words = paramName
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();
  return `${words} parameter`;
}

/**
 * Parse a single field schema and extract metadata
 */
function parseFieldSchema(
  schema: any,
  schemaName: string,
  module?: any
): FieldSchema | null {
  try {
    const schemaDef = schema._def;

    // Handle ZodObject and extended schemas (ZodEffects wrapping ZodObject)
    let shape: any;
    let actualSchema = schema;

    // Unwrap ZodEffects (from .refine())
    if (schemaDef.typeName === 'ZodEffects') {
      actualSchema = schemaDef.schema;
    }

    // Get shape - handle both function and direct property
    const actualDef = actualSchema._def;
    if (typeof actualDef.shape === 'function') {
      shape = actualDef.shape();
    } else if (actualDef.shape) {
      shape = actualDef.shape;
    } else {
      console.warn(`⚠️  Skipping ${schemaName}: Cannot extract shape`);
      return null;
    }

    const parameters: Record<string, FieldParameter> = {};

    // Extract dataType (should be a literal)
    const dataTypeDef = shape.dataType?._def;
    let dataTypeValue: string | undefined;

    // Zod v4 structure: { type: 'literal', values: ['int'] }
    if (dataTypeDef?.type === 'literal' && Array.isArray(dataTypeDef.values)) {
      dataTypeValue = dataTypeDef.values[0];
    }
    // Fallback for older Zod versions
    else if (dataTypeDef?.typeName === 'ZodLiteral') {
      dataTypeValue = dataTypeDef.value;
    } else if (
      dataTypeDef?.typeName === 'ZodEnum' ||
      dataTypeDef?.type === 'enum'
    ) {
      dataTypeValue = dataTypeDef.values[0]; // First enum value as primary
    }

    if (!dataTypeValue) {
      console.warn(
        `⚠️  Skipping ${schemaName}: No dataType found (def: ${JSON.stringify(dataTypeDef)})`
      );
      return null;
    }

    // Extract all parameters (except dataType, nullable, nullableRate)
    // nullable and nullableRate are in baseParameters, no need to duplicate
    for (const [key, value] of Object.entries(shape)) {
      if (key === 'dataType' || key === 'nullable' || key === 'nullableRate')
        continue;

      const fieldDef = (value as any)._def;
      const parameter = extractParameterInfo(fieldDef, key);

      // Zod v4: Enum values are in options property (not in _def)
      if (
        parameter.type === 'enum' &&
        !parameter.possibleValues &&
        (value as any).options
      ) {
        parameter.possibleValues = (value as any).options;
      }

      // Check if there's a related enum schema in the module
      // e.g., ProductCategorySchema for product field's categories parameter
      if (module && parameter.type === 'array' && !parameter.possibleValues) {
        // Try multiple naming patterns for enum schemas
        const paramCapitalized = key.charAt(0).toUpperCase() + key.slice(1);
        const dataTypeCapitalized =
          dataTypeValue.charAt(0).toUpperCase() + dataTypeValue.slice(1);

        const possibleNames = [
          // Try: ProductCategoriesSchema (plural, exact match)
          `${dataTypeCapitalized}${paramCapitalized}Schema`,
          // Try: ProductCategorySchema (singular)
          `${dataTypeCapitalized}${paramCapitalized.replace(/s$/, '')}Schema`,
          // Try: just the param name capitalized (CategoriesSchema)
          `${paramCapitalized}Schema`,
          // Try: singular form
          `${paramCapitalized.replace(/s$/, '')}Schema`,
        ];

        for (const enumSchemaName of possibleNames) {
          if (module[enumSchemaName]) {
            const enumSchema = module[enumSchemaName];
            const enumDef = enumSchema._def;
            if (
              (enumDef?.type === 'enum' || enumDef?.typeName === 'ZodEnum') &&
              enumDef.values
            ) {
              parameter.possibleValues = enumDef.values;
              break;
            }
          }
        }
      }

      parameters[key] = parameter;
    }

    return {
      dataType: dataTypeValue,
      category: categorizeField(dataTypeValue),
      description: generateFieldDescription(dataTypeValue),
      parameters,
    };
  } catch (error) {
    console.error(`❌ Error parsing ${schemaName}:`, error);
    return null;
  }
}

/**
 * Parse base field config schema
 */
function parseBaseFieldConfig(baseSchema: any): Record<string, FieldParameter> {
  try {
    // Handle both ZodObject and extended schemas
    let shape: any;

    if (typeof baseSchema._def.shape === 'function') {
      shape = baseSchema._def.shape();
    } else if (baseSchema._def.shape) {
      shape = baseSchema._def.shape;
    } else {
      console.warn('⚠️  Cannot find shape in BaseFieldConfigSchema');
      return {};
    }

    const parameters: Record<string, FieldParameter> = {};

    for (const [key, value] of Object.entries(shape)) {
      if (key === 'dataType') continue; // Skip dataType in base

      const fieldDef = (value as any)._def;
      const openapiMetadata = fieldDef?.openapi;

      parameters[key] = extractParameterInfo(fieldDef, key, openapiMetadata);
    }

    return parameters;
  } catch (error) {
    console.error('❌ Error parsing BaseFieldConfigSchema:', error);
    return {};
  }
}

/**
 * Main schema generation function
 */
async function generateSchema(): Promise<void> {
  console.log('🚀 Starting schema generation...\n');

  const fieldsDir = join(rootDir, 'src/schema/fields');
  const outputPath = join(rootDir, 'public/schema.json');

  // Read all field files
  const fieldFiles = readdirSync(fieldsDir)
    .filter((file) => file.endsWith('-field.ts'))
    .sort();

  console.log(`📂 Found ${fieldFiles.length} field definition files\n`);

  const fields: Record<string, FieldSchema> = {};
  let successCount = 0;
  let skipCount = 0;

  // Import BaseFieldConfigSchema
  const baseFieldModule = await import('../src/schema/base-field-config.js');
  const baseParameters = parseBaseFieldConfig(
    baseFieldModule.BaseFieldConfigSchema
  );

  console.log('✅ Parsed BaseFieldConfigSchema\n');

  // Process each field file
  for (const file of fieldFiles) {
    const modulePath = `../src/schema/fields/${file}`;

    try {
      const module = await import(modulePath);

      // Find the field schema export (prioritize *FieldSchema or *Field pattern)
      // This handles cases where multiple schemas are exported (e.g., ProductCategorySchema + ProductFieldSchema)
      const schemaExports = Object.entries(module).filter(([key]) =>
        key.toLowerCase().includes('schema')
      );

      // Priority: FieldSchema > Field > Schema
      const schemaExport =
        schemaExports.find(([key]) => key.endsWith('FieldSchema')) ||
        schemaExports.find(
          ([key]) =>
            key.toLowerCase().includes('field') &&
            key.toLowerCase().includes('schema')
        ) ||
        schemaExports[0];

      if (!schemaExport) {
        console.warn(`⚠️  No schema found in ${file}`);
        skipCount++;
        continue;
      }

      const [schemaName, schema] = schemaExport;
      const fieldSchema = parseFieldSchema(schema, schemaName, module);

      if (fieldSchema) {
        fields[fieldSchema.dataType] = fieldSchema;
        console.log(
          `✅ ${fieldSchema.dataType.padEnd(20)} → ${fieldSchema.category}`
        );
        successCount++;
      } else {
        skipCount++;
      }
    } catch (error) {
      console.error(`❌ Error importing ${file}:`, error);
      skipCount++;
    }
  }

  // Generate final schema
  const apiSchema: APISchema = {
    version: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    baseParameters,
    fields,
  };

  // Write to file
  writeFileSync(outputPath, JSON.stringify(apiSchema, null, 2), 'utf-8');

  console.log('\n' + '='.repeat(60));
  console.log('📊 Schema Generation Summary:');
  console.log('='.repeat(60));
  console.log(`✅ Successfully parsed: ${successCount} fields`);
  console.log(`⚠️  Skipped: ${skipCount} fields`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(
    `📦 Total categories: ${new Set(Object.values(fields).map((f) => f.category)).size}`
  );
  console.log('✨ Schema generation completed successfully!\n');
}

// Run the generator
generateSchema().catch((error) => {
  console.error('💥 Fatal error during schema generation:', error);
  process.exit(1);
});
