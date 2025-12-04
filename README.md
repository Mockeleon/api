# Mockeleon API

A powerful REST API for generating realistic mock data with customizable schemas. Built with TypeScript, Hono, and Zod validation. Perfect for testing, prototyping, and development workflows.

## Why Mockeleon?

Mockeleon simplifies mock data generation by providing:

- **Rich Data Types**: 30+ field types including primitives, personal data, locations, financial data, and complex structures
- **Intelligent Relations**: Generate related fields automatically (e.g., email from name, country from city)
- **Production Ready**: Type-safe, well-tested, with comprehensive error handling and rate limiting
- **Developer Friendly**: OpenAPI documentation, intuitive schema syntax, and detailed examples

## Key Features

### Data Types

- **Primitives**: int, float, boolean, string, date, uuid, hash
- **Personal**: name, email, phone, username
- **Location**: city, country, street, zipcode, location (lat/lng)
- **Internet**: url, ip, mac, color
- **Financial**: price, currency, iban
- **Files**: fileName, fileSize
- **Crypto**: cryptoAddress, cryptoHash
- **Complex**: array, object (nested structures)

### Advanced Capabilities

- **Relational Data**: `basedOn` parameter to generate dependent fields
- **Multi-language**: Turkish and English support for names, products, streets
- **Geographic Consistency**: 200+ cities across 35 countries with automatic matching
- **Character Normalization**: Turkish character handling for usernames and filenames
- **Flexible Arrays**: Generate or pick from predefined data
- **Nullable Fields**: Control null probability for realistic data

## Quick Start

### Installation

```bash
git clone https://github.com/Mockeleon/api.git
cd api
npm install
```

### Configuration

## Usage Examples

### Basic User Data

Generate users with names, emails, and ages:

```bash
curl -X POST http://localhost:4000/api/mock \
  -H "Content-Type: application/json" \
  -d '{
    "schema": {
      "id": { "dataType": "int", "min": 1, "max": 1000 },
      "name": { "dataType": "name", "format": "full" },
      "email": { "dataType": "email", "basedOn": "name" },
      "age": { "dataType": "int", "min": 18, "max": 65 }
    },
    "count": 3
  }'
```

### Nested Objects

Create complex data structures:

## Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run test suite (133 tests)
npm run test:watch   # Run tests in watch mode
npm run lint         # Lint code with ESLint
npm run format       # Format code with Prettier
npm run typecheck    # Type check without emitting
```

## Project Structure

```
api/
├── src/
│   ├── config/          # Configuration and logger setup
│   ├── middlewares/     # Rate limiting, error handling, metrics
│   ├── routes/          # API endpoints
│   │   ├── mockeleon/   # Main data generation endpoint
│   │   ├── health/      # Health check endpoint
│   │   └── schema/      # Schema metadata endpoint
│   ├── schema/          # Zod validation schemas
│   │   └── fields/      # 30 field type schemas
│   ├── services/        # Business logic
│   │   └── generators/  # Data generators for each field type
│   └── types/           # TypeScript type definitions
├── tests/               # Test suite (133 tests)
└── ecosystem.config.js  # PM2 configuration for production
```

## API Endpoints

### POST /api/mock

Generate mock data based on schema. Max 1,500 records per request.

### GET /api/schema

Get available field types and their parameters.

### GET /health

Health check endpoint with uptime information.

### GET /docs

Interactive OpenAPI/Swagger documentation.

## Documentation

- **API Docs**: Visit `/docs` endpoint for interactive documentation
- **Field Types**: Visit `/api/schema` for complete field type reference
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- **Full Documentation**: [https://github.com/Mockeleon/docs](https://github.com/Mockeleon/docs)

## Testing

Comprehensive test suite with 133 tests covering all field types:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Documentation

For detailed API documentation, visit `/docs` endpoint or see [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/Mockeleon/api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Mockeleon/api/discussions)
