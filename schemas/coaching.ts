import { z } from "zod";
import {
  emailSchema,
  mobileSchema,
  nameSchema,
  passwordSchema,
} from "@/schemas/shared";

export const coachingRegisterSchema = z.object({
  coachingName: nameSchema,
  ownerName: nameSchema,
  email: emailSchema,
  mobile: mobileSchema,
  password: passwordSchema,
  address: z.string().min(10, "Address required"),
  idNumber: z.string().min(4, "ID Number required"),
  idProof: z.any().optional(),
});

export type CoachingRegisterInput = z.infer<typeof coachingRegisterSchema>;
