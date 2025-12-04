# Contributing to Mockeleon API

Thank you for your interest in contributing to Mockeleon API! This guide will help you get started.

## 📋 Table of Contents

- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Adding a New Field Type](#adding-a-new-field-type)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Cross-Repository Changes](#cross-repository-changes)

## 🚀 Development Setup

### Prerequisites

- Node.js 18+ or 20+
- npm or pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Mockeleon/api.git
cd api

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run tests
npm test

# Start development server
npm run dev
```

The API will be available at `http://localhost:4000`

### Environment Variables

```env
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
LOG_LEVEL=info
API_VERSION=v1
API_DOMAIN=http://localhost:4000
```

## 🤝 How to Contribute

### Reporting Bugs

Open an issue with:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS)
- API request/response examples

### Suggesting Features

Open an issue describing:

- The problem you're solving
- Your proposed solution
- Example API usage
- Alternatives considered

### Good First Issues

Look for issues labeled:

- `good first issue` - Simple tasks for newcomers
- `help wanted` - Tasks where we need help
- `bug` - Bug fixes

## ➕ Adding a New Field Type

Adding a new field type requires 6 steps:

### Step 1: Create Field Schema

Create `src/schema/fields/your-field.ts`:

```typescript
import { z } from '@hono/zod-openapi';
import { BaseFieldConfigSchema } from '../base-field-config';

export const YourFieldSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('yourField').openapi({
    description: 'Your field type description',
    example: 'yourField',
  }),
  option1: z.string().optional().openapi({
    description: 'Option description',
    example: 'value',
  }),
}).openapi('YourField');

export type YourField = z.infer<typeof YourFieldSchema>;
```

### Step 2: Add to Data Types

Edit `src/schema/data-types.ts`:

```typescript
export const YourCategoryDataTypeSchema = z.enum(['yourField', 'otherField']);

// Update main DataTypeSchema
export const DataTypeSchema = z.union([
  // ... existing types
  YourCategoryDataTypeSchema,
]);
```

### Step 3: Add to Field Config

Edit `src/schema/field-config.ts`:

```typescript
import { YourFieldSchema } from './fields/your-field';

export const FieldConfigSchema = z.discriminatedUnion('dataType', [
  // ... existing fields
  YourFieldSchema,
]);
```

### Step 4: Create Generator

Create `src/services/generators/your-field.generator.ts`:

```typescript
import type { YourField } from '../../schema/fields/your-field';

export function generateYourField(config: YourField): string {
  // Handle nullable
  if (config.nullable && Math.random() < (config.nullableRate ?? 0.1)) {
    return null;
  }

  // Your generation logic here
  return 'generated value';
}
```

### Step 5: Register Generator

Edit `src/services/mockeleon.service.ts`:

```typescript
import { generateYourField } from './generators/your-field.generator';

// In generateFieldValue method:
case 'yourField':
  return generateYourField(config);
```

### Step 6: Write Tests

Create `tests/generators/your-field.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { testRequest } from '../helpers/setup';

describe('YourField Generator', () => {
  it('should generate valid yourField', async () => {
    const response = await testRequest({
      schema: {
        field: { dataType: 'yourField' },
      },
      count: 10,
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data).toHaveLength(10);

    // Validate each generated value
    data.data.forEach((item: any) => {
      expect(item.field).toBeDefined();
      // Add specific validation
    });
  });

  it('should respect nullable option', async () => {
    const response = await testRequest({
      schema: {
        field: {
          dataType: 'yourField',
          nullable: true,
          nullableRate: 0.5,
        },
      },
      count: 100,
    });

    const data = await response.json();
    const nullCount = data.data.filter(
      (item: any) => item.field === null
    ).length;

    // Should have some nulls (not all, not none)
    expect(nullCount).toBeGreaterThan(0);
    expect(nullCount).toBeLessThan(100);
  });
});
```

## 📐 Code Standards

### TypeScript

- **Strict mode enabled** - No `any` types
- **Explicit return types** on public functions
- **Use type imports**: `import type { Type } from './types'`
- **Zod for validation** - All schemas use Zod

### File Naming

- **kebab-case**: `email-field.ts`, `name.generator.ts`
- **Descriptive names**: `crypto-address-field.ts` not `ca-field.ts`
- **Consistent suffixes**: `.generator.ts`, `.schema.ts`, `.types.ts`

### Code Organization

```typescript
// 1. Type imports
import type { YourType } from './types';

// 2. Regular imports
import { z } from 'zod';

// 3. Constants
const MAX_LENGTH = 100;

// 4. Main export
export function yourFunction() {
  // implementation
}

// 5. Helper functions (not exported)
function helperFunction() {
  // implementation
}
```

### Comments

Use JSDoc for public APIs:

````typescript
/**
 * Generates a realistic email address based on a name
 *
 * @param config - Field configuration
 * @param context - Previously generated fields
 * @returns Email address string or null
 *
 * @example
 * ```typescript
 * generateEmail({ dataType: 'email', basedOn: 'name' }, { name: 'John Doe' })
 * // Returns: 'john.doe@example.com'
 * ```
 */
export function generateEmail(
  config: EmailField,
  context?: Record<string, any>
): string | null {
  // implementation
}
````

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm test -- your-field.test.ts
```

### Test Requirements

- ✅ All new features must have tests
- ✅ Maintain coverage above 80%
- ✅ Test happy path and edge cases
- ✅ Test validation errors
- ✅ Test nullable behavior

### Test Structure

```typescript
describe('Feature', () => {
  describe('specific behavior', () => {
    it('should do something', async () => {
      // Arrange
      const input = createInput();

      // Act
      const result = await doSomething(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

1. **Run all checks**:

   ```bash
   npm run build    # Must succeed
   npm test         # All tests pass
   npm run lint     # No errors
   ```

2. **Update documentation** if needed

3. **Write clear commits**:

   ```bash
   git commit -m "feat: add credit card field type

   - Implements Luhn algorithm validation
   - Supports Visa, Mastercard, Amex
   - Adds masking option

   Closes #123"
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Code refactoring
- `chore`: Maintenance

**Examples:**

```
feat(fields): add credit card generator
fix(rate-limit): prevent memory leak
docs(readme): update field list
test(email): add basedOn tests
```

### PR Checklist

- [ ] Tests added and passing
- [ ] Code follows style guide
- [ ] Documentation updated (README, OpenAPI)
- [ ] No breaking changes (or documented)
- [ ] Linked related documentation PR

## 🔗 Cross-Repository Changes

⚠️ **Important**: When you add or modify field types, you **MUST** also update the documentation repository.

### Process for Adding/Changing Fields

1. **Make API changes in this repository**
   - Add field schema
   - Create generator
   - Write tests
   - Update OpenAPI docs

2. **Create corresponding documentation PR**
   - Repository: [mockeleon-docs](https://github.com/Mockeleon/docs)
   - Add `/content/fields/{field-name}.md`
   - Update sidebar in `config/site.ts`
   - Include examples matching API

3. **Link the PRs**
   - In API PR description: `Docs: Mockeleon/docs#123`
   - In docs PR description: `API: Mockeleon/api#456`

4. **Coordinate merging**
   - API PR should merge first
   - Docs PR follows after API is deployed

### What Needs Documentation?

| Change Type        | Documentation Required |
| ------------------ | ---------------------- |
| New field type     | ✅ New field doc page  |
| Changed parameters | ✅ Update field doc    |
| New feature        | ✅ Update guides       |
| Bug fix            | ❌ Usually not needed  |
| Refactor           | ❌ Internal change     |

### Example Cross-Repo PR

**API PR Title:**

```
feat: add product field type (+ docs PR #123)
```

**API PR Description:**

```markdown
## Changes

- Add product field with category support
- 10 categories, 250+ products
- English and Turkish support

## Related PRs

- Documentation: Mockeleon/docs#123

## Testing

- All tests passing
- Coverage maintained at 85%
```

**Docs PR Title:**

```
docs: add product field documentation (API #456)
```

## 📞 Questions?

- 📖 Check [README.md](README.md)
- 💬 Open a GitHub Discussion
- 🐛 Create an issue for bugs
- 📧 Email for security issues only

## 🙏 Thank You!

Your contributions make Mockeleon better for everyone!

---

**Happy coding! 🦎**
