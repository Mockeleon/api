import { z } from '@hono/zod-openapi';

import { ArrayFieldConfigSchema } from './fields/array-field.js';
import { BooleanFieldConfigSchema } from './fields/boolean-field.js';
import { CityFieldConfigSchema } from './fields/city-field.js';
import { ColorFieldSchema } from './fields/color-field.js';
import { CountryFieldConfigSchema } from './fields/country-field.js';
import { CryptoAddressFieldSchema } from './fields/crypto-address-field.js';
import { CryptoHashFieldSchema } from './fields/crypto-hash-field.js';
import { CurrencyFieldConfigSchema } from './fields/currency-field.js';
import { DateFieldConfigSchema } from './fields/date-field.js';
import { EmailFieldConfigSchema } from './fields/email-field.js';
import { FileNameFieldSchema } from './fields/file-name-field.js';
import { FileSizeFieldSchema } from './fields/file-size-field.js';
import { FloatFieldConfigSchema } from './fields/float-field.js';
import { HashFieldConfigSchema } from './fields/hash-field.js';
import { IbanFieldConfigSchema } from './fields/iban-field.js';
import { IntFieldConfigSchema } from './fields/int-field.js';
import { IpFieldConfigSchema } from './fields/ip-field.js';
import { LocationFieldConfigSchema } from './fields/location-field.js';
import { MacFieldConfigSchema } from './fields/mac-field.js';
import { NameFieldConfigSchema } from './fields/name-field.js';
import { ObjectFieldConfigSchema } from './fields/object-field.js';
import { PhoneFieldConfigSchema } from './fields/phone-field.js';
import { PriceFieldConfigSchema } from './fields/price-field.js';
import { ProductFieldSchema } from './fields/product-field.js';
import { StreetFieldSchema } from './fields/street-field.js';
import { StringFieldConfigSchema } from './fields/string-field.js';
import { UrlFieldConfigSchema } from './fields/url-field.js';
import { UsernameFieldConfigSchema } from './fields/username-field.js';
import { UuidFieldConfigSchema } from './fields/uuid-field.js';
import { ZipCodeFieldConfigSchema } from './fields/zipcode-field.js';

export { BaseFieldConfigSchema } from './base-field-config.js';
export type { BaseFieldConfig } from './base-field-config.js';

// Define FieldConfig with proper recursive types
// Note: We use z.any() for recursive fields to maintain OpenAPI compatibility
// The actual validation happens at runtime in the service layer
export const FieldConfigSchema = z.discriminatedUnion('dataType', [
  IntFieldConfigSchema,
  FloatFieldConfigSchema,
  BooleanFieldConfigSchema,
  StringFieldConfigSchema,
  NameFieldConfigSchema,
  EmailFieldConfigSchema,
  PhoneFieldConfigSchema,
  UsernameFieldConfigSchema,
  UrlFieldConfigSchema,
  IpFieldConfigSchema,
  MacFieldConfigSchema,
  UuidFieldConfigSchema,
  DateFieldConfigSchema,
  HashFieldConfigSchema,
  PriceFieldConfigSchema,
  CurrencyFieldConfigSchema,
  IbanFieldConfigSchema,
  CountryFieldConfigSchema,
  CityFieldConfigSchema,
  LocationFieldConfigSchema,
  ZipCodeFieldConfigSchema,
  CryptoAddressFieldSchema,
  CryptoHashFieldSchema,
  ColorFieldSchema,
  FileSizeFieldSchema,
  FileNameFieldSchema,
  StreetFieldSchema,
  ProductFieldSchema,
  ObjectFieldConfigSchema,
  ArrayFieldConfigSchema,
]);

export type FieldConfig =
  | z.infer<typeof IntFieldConfigSchema>
  | z.infer<typeof FloatFieldConfigSchema>
  | z.infer<typeof BooleanFieldConfigSchema>
  | z.infer<typeof StringFieldConfigSchema>
  | z.infer<typeof NameFieldConfigSchema>
  | z.infer<typeof EmailFieldConfigSchema>
  | z.infer<typeof PhoneFieldConfigSchema>
  | z.infer<typeof UsernameFieldConfigSchema>
  | z.infer<typeof UrlFieldConfigSchema>
  | z.infer<typeof IpFieldConfigSchema>
  | z.infer<typeof MacFieldConfigSchema>
  | z.infer<typeof UuidFieldConfigSchema>
  | z.infer<typeof DateFieldConfigSchema>
  | z.infer<typeof HashFieldConfigSchema>
  | z.infer<typeof PriceFieldConfigSchema>
  | z.infer<typeof CurrencyFieldConfigSchema>
  | z.infer<typeof IbanFieldConfigSchema>
  | z.infer<typeof CountryFieldConfigSchema>
  | z.infer<typeof CityFieldConfigSchema>
  | z.infer<typeof LocationFieldConfigSchema>
  | z.infer<typeof ZipCodeFieldConfigSchema>
  | z.infer<typeof CryptoAddressFieldSchema>
  | z.infer<typeof CryptoHashFieldSchema>
  | z.infer<typeof ColorFieldSchema>
  | z.infer<typeof FileSizeFieldSchema>
  | z.infer<typeof FileNameFieldSchema>
  | z.infer<typeof StreetFieldSchema>
  | z.infer<typeof ProductFieldSchema>
  | (z.infer<typeof ObjectFieldConfigSchema> & {
      fields: Record<string, FieldConfig>;
    })
  | (z.infer<typeof ArrayFieldConfigSchema> & { item?: FieldConfig });

export const SchemaSchema = z.record(z.string(), FieldConfigSchema);

export type Schema = z.infer<typeof SchemaSchema>;
