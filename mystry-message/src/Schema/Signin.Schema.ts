import { z } from 'zod';

// Fixed typo in schema name and aligned with sign-in page requirements
export const signinSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"), // Changed from username to identifier
  password: z.string().min(1, "Password is required"),
});