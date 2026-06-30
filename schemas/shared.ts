import { z } from "zod";

export const emailSchema = z
  .email("Invalid email address")
  .trim()
  .toLowerCase();

export const mobileSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Invalid mobile number");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(50);

export const dobSchema = z.string().refine(
  (value) => {
    const dob = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 1;
  },
  {
    message: "Age must be at least 13 years",
  },
);

export const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters");
