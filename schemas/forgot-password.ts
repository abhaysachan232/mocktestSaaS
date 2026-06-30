// schemas/forgot-password-schema.ts

import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email"),
  mobile: z.string().min(2, "Mobile number must be 10 digits"),
  dob: z.string().min(1, "Date of birth is required"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
