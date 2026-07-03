"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { RegisterSchema, registerSchema } from "@/schemas/register";
import { ROLES } from "@/lib/constans";

export async function registerUser(data: RegisterSchema) {
  try {
    const validatedData = registerSchema.parse(data);

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: ROLES.STUDENT,

        student: {
          create: {
            name: validatedData.name,
            mobile: validatedData.mobile,
            dob: new Date(validatedData.dob),
          },
        },
      },
    });

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error: unknown) {
    console.error("REGISTER ERROR:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const prismaError = error as {
        code: string;
        meta?: {
          target?: string[];
        };
      };

      if (prismaError.code === "P2002") {
        const field = prismaError.meta?.target?.[0];

        return {
          success: false,
          message:
            field === "email"
              ? "Email already registered"
              : field === "mobile"
                ? "Mobile number already registered"
                : "Duplicate record found",
        };
      }
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
    };
  }
}
