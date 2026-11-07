import { z } from 'zod';
import { EventType } from '../../../generated/prisma';

export const QueryIntentSchema = z.object({
  event_type: z.enum(EventType).nullable().default(null),
});

export const SelectionSchema = z.object({
  post_ids: z.array(z.number().int()),
  message: z.string(),
});

export type QueryIntent = z.infer<typeof QueryIntentSchema>;
export type Selection = z.infer<typeof SelectionSchema>;
