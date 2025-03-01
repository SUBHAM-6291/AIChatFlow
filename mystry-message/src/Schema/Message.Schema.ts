// @/Models/User.Model.ts
import { z } from 'zod';

// Base schema for message content
export const messageSchema = z.object({
  content: z.string()
    .min(10, { message: 'Content must be at least 10 characters' })
    .max(300, { message: 'Content must not be longer than 300 characters' }),
});

// Full schema including _id and optional title
export const fullMessageSchema = messageSchema.extend({
  _id: z.string(),
  title: z.string().optional(), // Optional title
});

// Export the inferred TypeScript type
export type Message = z.infer<typeof fullMessageSchema>;