import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email"),
  mobile: z
    .string(),
    // .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
  dob: z.string().refine(
    (value) => {
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      return age >= 1;
    },
    {
      message: "Age must be at least 13 years",
    },
  ),
  password: z
    .string()
    // .min(8, "Password must be at least 8 characters")
    // .regex(/[A-Z]/, "Password must contain one uppercase letter")
    // .regex(/[a-z]/, "Password must contain one lowercase letter")
    // .regex(/[0-9]/, "Password must contain one number")
    // .regex(/[^A-Za-z0-9]/, "Password must contain one special character"),
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
