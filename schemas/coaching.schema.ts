import { z } from "zod";

const codeSchema = z
  .string()
  .trim()
  .min(3, "Code must be at least 3 characters")
  .max(30, "Code cannot exceed 30 characters")
  .transform((value) => value.toUpperCase())
  .refine(
    (value) => /^[A-Z0-9_-]+$/.test(value),
    "Code can contain only letters, numbers, _ and -",
  );

const mobileSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number");

const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .transform((value) => value.toLowerCase());

export const createCoachingSchema = z.object({
  code: codeSchema,
  coachingName: z.string().trim().min(2, "Coaching name is required").max(100),
  ownerName: z.string().trim().min(2, "Owner name is required").max(100),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
  mobile: mobileSchema,
  address: z.string().trim().min(5, "Address is required").max(500),
  idNumber: z.string().trim().min(4, "ID number is required").max(50),
});

export const updateCoachingSchema = z.object({
  id: z.string().min(1),
  code: codeSchema,
  coachingName: z.string().trim().min(2, "Coaching name is required").max(100),
  ownerName: z.string().trim().min(2, "Owner name is required").max(100),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
  mobile: mobileSchema,
  address: z.string().trim().min(5, "Address is required").max(500),
  idNumber: z.string().trim().min(4, "ID number is required").max(50),
  isActive: z.boolean(),
});

export type CreateCoachingInput = z.infer<typeof createCoachingSchema>;
export type UpdateCoachingInput = z.infer<typeof updateCoachingSchema>;
