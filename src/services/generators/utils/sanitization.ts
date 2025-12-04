/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitize and validate email domain
 * @param domain - Domain string (with or without @ prefix)
 * @returns Cleaned domain without @ prefix
 * @throws Error if domain format is invalid
 */
export function sanitizeDomain(domain: string): string {
  if (typeof domain !== 'string' || domain.trim() === '') {
    throw new Error('Domain must be a non-empty string');
  }

  // Remove @ prefix if exists
  const cleaned = domain.trim().startsWith('@')
    ? domain.trim().slice(1)
    : domain.trim();

  // Validate format: alphanumeric, dots, hyphens only
  // Must start with alphanumeric, end with TLD (2+ chars)
  if (
    !/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(
      cleaned
    )
  ) {
    throw new Error(
      `Invalid domain format: "${domain}". Domain must contain only letters, numbers, dots, and hyphens.`
    );
  }

  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i, // onclick=, onerror=, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(domain)) {
      throw new Error(
        `Domain contains potentially dangerous content: "${domain}"`
      );
    }
  }

  return cleaned;
}

/**
 * Validate array data is safe for generation
 * @param data - Array of data items
 * @throws Error if data is invalid or unsafe
 */
export function validateArrayData(data: unknown): asserts data is unknown[] {
  if (!Array.isArray(data)) {
    throw new Error('data must be an array');
  }

  if (data.length === 0) {
    throw new Error('data must be a non-empty array');
  }

  // Ensure all items are JSON-serializable (no functions, symbols, undefined, etc.)
  try {
    const serialized = JSON.stringify(data);
    // Also ensure it can be parsed back (catches circular references)
    JSON.parse(serialized);
  } catch {
    throw new Error(
      'Array data must be JSON-serializable (no functions, symbols, circular references, or undefined values)'
    );
  }

  // Check for potentially dangerous strings in array items
  const checkForDangerousContent = (item: unknown): boolean => {
    if (typeof item === 'string') {
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
      ];
      return dangerousPatterns.some((pattern) => pattern.test(item));
    }
    if (Array.isArray(item)) {
      return item.some(checkForDangerousContent);
    }
    if (item !== null && typeof item === 'object') {
      return Object.values(item).some(checkForDangerousContent);
    }
    return false;
  };

  if (data.some(checkForDangerousContent)) {
    throw new Error('Array data contains potentially dangerous content');
  }
}

/**
 * Sanitize string value for safe output
 * Removes or escapes potentially dangerous characters
 * @param value - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(value: string): string {
  if (typeof value !== 'string') {
    return String(value);
  }

  // Remove null bytes
  let cleaned = value.replace(/\0/g, '');

  // Escape HTML special characters
  cleaned = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return cleaned;
}
