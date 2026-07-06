import { z } from "zod";
import {
  emailSchema,
  mobileSchema,
  nameSchema,
  passwordSchema,
} from "@/schemas/shared";

export const coachingRegisterSchema = z.object({
  // id: z.string(),
  coachingName: nameSchema,
  ownerName: nameSchema,
  code: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: emailSchema,
  mobile: mobileSchema,
  password: passwordSchema,
  address: z.string().min(10, "Address required"),
  idNumber: z.string().min(4, "ID Number required"),
  idProof: z.any().optional(),
  logo: z.any().optional(),
  // code: z.string()
});

export type CoachingRegisterInput = z.infer<typeof coachingRegisterSchema>;
