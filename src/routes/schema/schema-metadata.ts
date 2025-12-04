export const schemaMetadata = {
  int: {
    dataType: 'int',
    description: 'Generates integer values within specified range',
    parameters: {
      min: {
        type: 'number',
        required: false,
        description: 'Minimum value for the generated integer (inclusive)',
        example: 1,
      },
      max: {
        type: 'number',
        required: false,
        description: 'Maximum value for the generated integer (inclusive)',
        example: 100,
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
    validation: {
      rules: ['min must be less than or equal to max'],
    },
  },
  float: {
    dataType: 'float',
    description: 'Generates floating point numbers with configurable precision',
    parameters: {
      min: {
        type: 'number',
        required: false,
        description: 'Minimum value for the float',
        example: 0.0,
      },
      max: {
        type: 'number',
        required: false,
        description: 'Maximum value for the float',
        example: 100.0,
      },
      precision: {
        type: 'number',
        required: false,
        description: 'Number of decimal places (0-10, default: 2)',
        example: 2,
        min: 0,
        max: 10,
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
    validation: {
      rules: ['min must be less than or equal to max'],
    },
  },
  string: {
    dataType: 'string',
    description: 'Generates text content (words, sentences, or paragraphs)',
    parameters: {
      kind: {
        type: 'enum',
        required: true,
        description:
          'Type of string to generate: word (single word), sentence (multiple words), or paragraph (multiple sentences)',
        enum: ['word', 'sentence', 'paragraph'],
        example: 'sentence',
      },
      lang: {
        type: 'enum',
        required: false,
        description:
          'Language code for generated text (tr, en, or any for random)',
        enum: ['tr', 'en', 'any'],
        example: 'en',
      },
      min: {
        type: 'number',
        required: false,
        description:
          'Minimum length - for word: word count, for sentence: word count, for paragraph: word count per paragraph',
        example: 5,
      },
      max: {
        type: 'number',
        required: false,
        description:
          'Maximum length - for word: word count, for sentence: word count, for paragraph: word count per paragraph',
        example: 10,
      },
      paragraphs: {
        type: 'number',
        required: false,
        description:
          'Number of paragraphs to generate (only applicable when kind is "paragraph")',
        example: 3,
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
    validation: {
      rules: [
        'min must be less than or equal to max',
        'paragraphs field is only applicable when kind is "paragraph"',
      ],
    },
  },
  boolean: {
    dataType: 'boolean',
    description: 'Generates true or false values',
    parameters: {
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  array: {
    dataType: 'array',
    description:
      'Generates arrays by repeating item generation or picking from predefined data',
    parameters: {
      item: {
        type: 'object',
        required: false,
        description:
          'Schema definition for each item in the array (can be any field type including nested objects). Required if data is not provided.',
      },
      count: {
        type: 'number',
        required: false,
        description:
          'Number of items to generate in the array (when using item schema)',
        example: 5,
      },
      data: {
        type: 'array',
        required: false,
        description:
          'Predefined array of values to randomly pick from. If provided, pickCount is required.',
        example: ['red', 'blue', 'green', 'yellow'],
      },
      pickCount: {
        type: 'number',
        required: false,
        description:
          'Number of items to randomly pick from the data array. Required when data is provided.',
        example: 2,
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
    validation: {
      rules: [
        'Array field must have either (item + optional count) OR (data + pickCount)',
        'Cannot have both item/count and data/pickCount',
      ],
    },
  },
  object: {
    dataType: 'object',
    description: 'Generates nested object structures with multiple fields',
    parameters: {
      fields: {
        type: 'object',
        required: true,
        description:
          'Nested field definitions for the object (key-value pairs where values are field schemas)',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  name: {
    dataType: 'name',
    description: 'Generates person names with language and format options',
    parameters: {
      lang: {
        type: 'enum',
        required: false,
        description:
          'Language code for name generation (tr, en, or any for random)',
        enum: ['tr', 'en', 'any'],
        example: 'en',
      },
      format: {
        type: 'enum',
        required: false,
        description:
          'Name format: first (given name only), last (surname only), or full (complete name)',
        enum: ['first', 'last', 'full'],
        example: 'full',
      },
      gender: {
        type: 'enum',
        required: false,
        description:
          'Gender for name selection (male, female, or any for random)',
        enum: ['male', 'female', 'any'],
        example: 'male',
      },
      tripleNameRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating three-part names instead of two-part names (only applicable when format is "full")',
        example: 0.3,
        min: 0,
        max: 1,
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
    validation: {
      rules: [
        'tripleNameRate can only be used when format is "full" or undefined',
      ],
    },
  },
  email: {
    dataType: 'email',
    description:
      'Generates email addresses with custom domains and name-based usernames',
    parameters: {
      domains: {
        type: 'array',
        required: false,
        description:
          'Optional list of domain names to use for email generation (e.g., ["example.com", "test.org"])',
        example: ['example.com', 'company.org'],
      },
      basedOn: {
        type: 'string',
        required: false,
        description:
          'Optional field name to base the email username on. If specified, will use the value from that field to generate the email username',
        example: 'name',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  phone: {
    dataType: 'phone',
    description: 'Generates Turkish phone numbers',
    parameters: {
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  username: {
    dataType: 'username',
    description: 'Generates usernames with various formats and patterns',
    parameters: {
      basedOn: {
        type: 'string',
        required: false,
        description:
          'Optional field name to base the username on. If specified, will use the value from that field to generate the username',
        example: 'name',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  url: {
    dataType: 'url',
    description: 'Generates URLs with optional platform-specific formats',
    parameters: {
      platform: {
        type: 'enum',
        required: false,
        description:
          'Optional social media or service platform. If specified, generates platform-specific URL',
        enum: [
          'x',
          'twitter',
          'discord',
          'telegram',
          'github',
          'linkedin',
          'instagram',
          'facebook',
          'youtube',
          'twitch',
          'tiktok',
          'snapchat',
          'reddit',
          'pinterest',
          'medium',
          'stackoverflow',
          'behance',
          'dribbble',
          'devto',
          'hashnode',
          'codepen',
          'steam',
          'xbox',
          'playstation',
          'epicgames',
          'spotify',
          'soundcloud',
          'vimeo',
          'patreon',
        ],
        example: 'github',
      },
      basedOn: {
        type: 'string',
        required: false,
        description: 'Optional field name to base the URL path/username on',
        example: 'name',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  ip: {
    dataType: 'ip',
    description: 'Generates IPv4 or IPv6 addresses',
    parameters: {
      version: {
        type: 'enum',
        required: false,
        description: 'IP version: v4 or v6',
        enum: ['v4', 'v6'],
        default: 'v4',
        example: 'v4',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  mac: {
    dataType: 'mac',
    description: 'Generates MAC addresses in standard format',
    parameters: {
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  uuid: {
    dataType: 'uuid',
    description: 'Generates UUID v4 (universally unique identifiers)',
    parameters: {
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  date: {
    dataType: 'date',
    description: 'Generates dates in timestamp or ISO format',
    parameters: {
      format: {
        type: 'enum',
        required: false,
        description:
          'Date format: timestamp (Unix timestamp in ms) or iso (ISO 8601 string)',
        enum: ['timestamp', 'iso'],
        default: 'iso',
        example: 'iso',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  hash: {
    dataType: 'hash',
    description: 'Generates cryptographic hash values',
    parameters: {
      algorithm: {
        type: 'enum',
        required: false,
        description: 'Hash algorithm to use',
        enum: ['md5', 'sha1', 'sha256', 'sha512'],
        default: 'sha256',
        example: 'sha256',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  price: {
    dataType: 'price',
    description: 'Generates price values with currency symbols',
    parameters: {
      min: {
        type: 'number',
        required: false,
        description: 'Minimum price value',
        default: 0,
        example: 0,
      },
      max: {
        type: 'number',
        required: false,
        description: 'Maximum price value',
        default: 10000,
        example: 10000,
      },
      currency: {
        type: 'string',
        required: false,
        description: 'Currency symbol or code to append',
        default: '$',
        example: '$',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  currency: {
    dataType: 'currency',
    description: 'Generates ISO 4217 currency codes',
    parameters: {
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  iban: {
    dataType: 'iban',
    description: 'Generates International Bank Account Numbers',
    parameters: {
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  city: {
    dataType: 'city',
    description: 'Generates city names with optional geographic filtering',
    parameters: {
      continents: {
        type: 'array',
        required: false,
        description: 'Filter cities by continents',
        enum: [
          'africa',
          'asia',
          'europe',
          'north-america',
          'south-america',
          'oceania',
        ],
      },
      countries: {
        type: 'array',
        required: false,
        description: 'Filter cities by country codes (ISO 3166-1 alpha-2)',
        enum: [
          'DE',
          'FR',
          'IT',
          'ES',
          'GB',
          'NL',
          'BE',
          'CH',
          'AT',
          'PL',
          'TR',
          'CN',
          'JP',
          'IN',
          'KR',
          'TH',
          'VN',
          'SG',
          'MY',
          'ID',
          'AE',
          'US',
          'CA',
          'MX',
          'BR',
          'AR',
          'CL',
          'CO',
          'PE',
          'EG',
          'NG',
          'ZA',
          'KE',
          'MA',
          'AU',
          'NZ',
        ],
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
    validation: {
      rules: ['Cannot filter by both continents and countries. Choose one.'],
    },
  },
  country: {
    dataType: 'country',
    description: 'Generates country names with optional continent filtering',
    parameters: {
      continents: {
        type: 'array',
        required: false,
        description: 'Filter countries by continents',
        enum: [
          'africa',
          'asia',
          'europe',
          'north-america',
          'south-america',
          'oceania',
        ],
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  location: {
    dataType: 'location',
    description:
      'Generates geographic coordinates (latitude/longitude) with optional filtering',
    parameters: {
      continents: {
        type: 'array',
        required: false,
        description: 'Filter locations by continents',
        enum: [
          'africa',
          'asia',
          'europe',
          'north-america',
          'south-america',
          'oceania',
        ],
      },
      countries: {
        type: 'array',
        required: false,
        description: 'Filter locations by country codes (ISO 3166-1 alpha-2)',
        enum: [
          'DE',
          'FR',
          'IT',
          'ES',
          'GB',
          'NL',
          'BE',
          'CH',
          'AT',
          'PL',
          'TR',
          'CN',
          'JP',
          'IN',
          'KR',
          'TH',
          'VN',
          'SG',
          'MY',
          'ID',
          'AE',
          'US',
          'CA',
          'MX',
          'BR',
          'AR',
          'CL',
          'CO',
          'PE',
          'EG',
          'NG',
          'ZA',
          'KE',
          'MA',
          'AU',
          'NZ',
        ],
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
    validation: {
      rules: ['Cannot filter by both continents and countries. Choose one.'],
    },
  },
  zipCode: {
    dataType: 'zipCode',
    description: 'Generates ZIP/postal codes',
    parameters: {
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  cryptoAddress: {
    dataType: 'cryptoAddress',
    description: 'Generates cryptocurrency wallet addresses',
    parameters: {
      platform: {
        type: 'enum',
        required: false,
        description: 'Blockchain platform (Ethereum, Bitcoin, Solana)',
        enum: ['eth', 'btc', 'sol'],
        default: 'eth',
        example: 'eth',
      },
      isPrivate: {
        type: 'boolean',
        required: false,
        description: 'Generate private key instead of public address',
        default: false,
        example: false,
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  cryptoHash: {
    dataType: 'cryptoHash',
    description: 'Generates cryptocurrency transaction hashes',
    parameters: {
      platform: {
        type: 'enum',
        required: false,
        description: 'Blockchain platform (Ethereum, Bitcoin, Solana)',
        enum: ['eth', 'btc', 'sol'],
        default: 'eth',
        example: 'eth',
      },
      min: {
        type: 'number',
        required: false,
        description:
          'Minimum length for random hash (if specified, generates custom length hash instead of transaction hash)',
        example: 32,
      },
      max: {
        type: 'number',
        required: false,
        description: 'Maximum length for random hash',
        example: 64,
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
    validation: {
      rules: ['min must be less than or equal to max'],
    },
  },
  color: {
    dataType: 'color',
    description: 'Generates color values in various formats',
    parameters: {
      format: {
        type: 'enum',
        required: false,
        description: 'Color format (hex, rgb, or hsl)',
        enum: ['hex', 'rgb', 'hsl'],
        default: 'hex',
        example: 'hex',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  fileName: {
    dataType: 'fileName',
    description: 'Generates realistic file names with common extensions',
    parameters: {
      extension: {
        type: 'string',
        required: false,
        description:
          'File extension (without dot). If not provided, random extension will be used',
        example: 'pdf',
      },
      extensions: {
        type: 'array',
        required: false,
        description:
          'Array of file extensions to randomly choose from. Overrides extension field if provided',
        example: ['mp4', 'doc', 'ppt'],
      },
      basedOn: {
        type: 'string',
        required: false,
        description:
          'Field name to base the filename on (uses string field value)',
        example: 'title',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
  },
  fileSize: {
    dataType: 'fileSize',
    description: 'Generates file size values with unit formatting',
    parameters: {
      min: {
        type: 'number',
        required: false,
        description: 'Minimum file size in bytes',
        default: 1,
        example: 1024,
      },
      max: {
        type: 'number',
        required: false,
        description: 'Maximum file size in bytes (default: 10MB)',
        default: 10485760,
        example: 5242880,
      },
      unit: {
        type: 'enum',
        required: false,
        description: 'Display unit for file size',
        enum: ['B', 'KB', 'MB', 'GB'],
        default: 'MB',
        example: 'MB',
      },
      nullable: {
        type: 'boolean',
        required: false,
        description: 'Whether this field can generate null values',
        example: true,
      },
      nullableRate: {
        type: 'number',
        required: false,
        description:
          'Probability (0-1) of generating null values when nullable is true',
        example: 0.2,
        min: 0,
        max: 1,
      },
    },
    validation: {
      rules: ['min must be less than or equal to max'],
    },
  },
};
