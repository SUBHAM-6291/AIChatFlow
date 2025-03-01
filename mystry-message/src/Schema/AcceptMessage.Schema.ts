import { z } from 'zod';

// Define the schema
export const AcceptMessageSchema = z.object({
  acceptMessage: z.boolean(), // Renamed to follow camelCase convention
});

// Export the inferred TypeScript type
export type AcceptMessageSchema = z.infer<typeof AcceptMessageSchema>;