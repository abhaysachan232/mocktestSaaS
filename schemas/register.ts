import { z } from "zod";
import {
  dobSchema,
  emailSchema,
  mobileSchema,
  nameSchema,
  passwordSchema,
} from "@/schemas/shared";

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  mobile: mobileSchema,
  dob: dobSchema,
  password: passwordSchema,
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export type RegisterResult = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    mobile?: string[];
    dob?: string[];
    password?: string[];
    general?: string[];
  };
};
