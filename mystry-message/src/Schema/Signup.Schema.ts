import { z } from 'zod';

export const usernameValidation = z.string()
  .min(2, 'Username must be at least 2 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const signupSchema = z.object({
  username: usernameValidation, // Fixed reference from Validation to usernameValidation
  email: z.string().email({ message: 'Invalid email address' }), // Fixed typo in "address" and semicolon
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }) // Fixed typo in "characters" and semicolon
});