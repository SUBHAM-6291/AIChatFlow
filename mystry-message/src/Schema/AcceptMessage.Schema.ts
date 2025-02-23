import { z } from 'zod';

export const acceptingSchema = z.object({
  acceptmessage: z.boolean(),

});