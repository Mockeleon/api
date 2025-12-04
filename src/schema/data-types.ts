import { z } from '@hono/zod-openapi';

export const PrimitiveDataTypeSchema = z.enum([
  'int',
  'float',
  'string',
  'boolean',
]);
export type PrimitiveDataType = z.infer<typeof PrimitiveDataTypeSchema>;

export const ComplexDataTypeSchema = z.enum(['object', 'array']);
export type ComplexDataType = z.infer<typeof ComplexDataTypeSchema>;

export const PersonDataTypeSchema = z.enum([
  'name',
  'email',
  'phone',
  'username',
]);
export type PersonDataType = z.infer<typeof PersonDataTypeSchema>;

export const InternetDataTypeSchema = z.enum(['url', 'ip', 'mac', 'uuid']);
export type InternetDataType = z.infer<typeof InternetDataTypeSchema>;

export const FinancialDataTypeSchema = z.enum(['price', 'currency', 'iban']);
export type FinancialDataType = z.infer<typeof FinancialDataTypeSchema>;

export const UtilityDataTypeSchema = z.enum(['date', 'hash']);
export type UtilityDataType = z.infer<typeof UtilityDataTypeSchema>;

export const LocationDataTypeSchema = z.enum([
  'country',
  'city',
  'location',
  'zipCode',
  'street',
]);
export type LocationDataType = z.infer<typeof LocationDataTypeSchema>;

export const CryptoDataTypeSchema = z.enum(['cryptoAddress', 'cryptoHash']);
export type CryptoDataType = z.infer<typeof CryptoDataTypeSchema>;

export const MediaDataTypeSchema = z.enum(['color']);
export type MediaDataType = z.infer<typeof MediaDataTypeSchema>;

export const FileDataTypeSchema = z.enum(['fileSize', 'fileName']);
export type FileDataType = z.infer<typeof FileDataTypeSchema>;

export const CommerceDataTypeSchema = z.enum(['product']);
export type CommerceDataType = z.infer<typeof CommerceDataTypeSchema>;

export const DataTypeSchema = z.union([
  PrimitiveDataTypeSchema,
  PersonDataTypeSchema,
  InternetDataTypeSchema,
  FinancialDataTypeSchema,
  UtilityDataTypeSchema,
  LocationDataTypeSchema,
  CryptoDataTypeSchema,
  MediaDataTypeSchema,
  FileDataTypeSchema,
  CommerceDataTypeSchema,
  ComplexDataTypeSchema,
]);
export type DataType = z.infer<typeof DataTypeSchema>;

export const LanguageCodeSchema = z.enum(['tr', 'en', 'any']);
export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

export const GenderSchema = z.enum(['male', 'female', 'any']);
export type Gender = z.infer<typeof GenderSchema>;

export const StringKindSchema = z.enum(['word', 'sentence', 'paragraph']);
export type StringKind = z.infer<typeof StringKindSchema>;
