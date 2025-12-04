/**
 * Common email domain providers
 * Used for generating realistic email addresses when no custom domains are specified
 * Note: Domains without @ prefix (@ is added by the generator)
 */
export const EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'aol.com',
  'zoho.com',
  'gmx.com',
] as const;
