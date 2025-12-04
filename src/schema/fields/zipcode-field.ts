import { z } from 'zod';

export const ZipCodeFieldSchema = z.object({
  dataType: z.literal('zipCode'),
  name: z.string(),
});

export type ZipCodeField = z.infer<typeof ZipCodeFieldSchema>;
