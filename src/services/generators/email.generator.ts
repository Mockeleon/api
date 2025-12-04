import type { EmailFieldConfig, FieldConfig } from '../../schema/index.js';

import { EMAIL_DOMAINS } from './data/email/domains.js';
import {
  FIRST_NAMES_FEMALE_EN,
  FIRST_NAMES_MALE_EN,
  LAST_NAMES_EN,
} from './data/names/en.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';
import { parseNameValue } from './utils/name-parser.js';
import { shouldReturnNull } from './utils/nullable-helper.js';
import { randomArrayItem, randomInt } from './utils/random-helper.js';
import { sanitizeDomain } from './utils/sanitization.js';


/** Generates email addresses with custom domains and name-based usernames */
export class EmailGenerator implements IDataGenerator<EmailFieldConfig> {
  private readonly firstNames = [
    ...FIRST_NAMES_MALE_EN,
    ...FIRST_NAMES_FEMALE_EN,
  ];
  private readonly lastNames = LAST_NAMES_EN;

  canHandle(config: FieldConfig): config is EmailFieldConfig {
    return config.dataType === 'email';
  }

  generate(
    config: EmailFieldConfig,
    context?: GeneratorContext
  ): string | null {
    if (shouldReturnNull(config)) return null;

    let domains: string[];
    if (config.domains && config.domains.length > 0) {
      domains = config.domains.map((d) => sanitizeDomain(d));
    } else {
      domains = [...EMAIL_DOMAINS];
    }

    const baseValue =
      config.basedOn && context && config.basedOn in context
        ? context[config.basedOn]
        : undefined;

    const username = this.generateUsername(baseValue);
    const domain = randomArrayItem(domains);
    const formattedDomain = `@${domain}`;

    return `${username}${formattedDomain}`;
  }

  private generateUsername(baseValue?: unknown): string {
    let firstName: string;
    let lastName: string;

    if (typeof baseValue === 'string' && baseValue.trim() !== '') {
      const parsed = parseNameValue(baseValue);
      if (parsed) {
        firstName = parsed.firstName;
        lastName = parsed.lastName;
      } else {
        firstName = this.randomFirstName().toLowerCase();
        lastName = this.randomLastName().toLowerCase();
      }
    } else {
      firstName = this.randomFirstName().toLowerCase();
      lastName = this.randomLastName().toLowerCase();
    }

    const formats = [
      () => `${firstName}.${lastName}`,
      () => `${firstName}_${lastName}`,
      () => `${firstName}${lastName}`,
      () => `${firstName}${randomInt(1, 999)}`,
      () => `${lastName}${randomInt(1, 999)}`,
      () => `${firstName.charAt(0)}.${lastName}`,
      () => `${firstName}.${lastName}${randomInt(1, 99)}`,
      () => firstName,
      () => lastName,
    ];

    return randomArrayItem(formats)();
  }

  private randomFirstName(): string {
    return randomArrayItem(this.firstNames);
  }

  private randomLastName(): string {
    return randomArrayItem(this.lastNames);
  }
}
