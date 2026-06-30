// schemas/forgot-password-schema.ts

import { z } from "zod";
import { dobSchema, emailSchema, mobileSchema } from "@/schemas/shared";

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  mobile: mobileSchema,
  dob: dobSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
