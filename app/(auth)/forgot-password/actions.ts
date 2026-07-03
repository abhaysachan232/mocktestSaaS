"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateResetToken } from "@/lib/jwt";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas/forgot-password";
import { actionError, actionSuccess } from "@/lib/action-response";

export async function forgotPasswordAction(data: ForgotPasswordFormData) {
  try {
    const validatedData = forgotPasswordSchema.parse(data);

    const user = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
        isActive: true,

        student: {
          is: {
            mobile: validatedData.mobile,
            dob: new Date(validatedData.dob),
          },
        },
      },

      include: {
        student: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid details",
      };
    }

    const token = generateResetToken(user.id);
    const cookieStore = await cookies();

    cookieStore.set("reset-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
      path: "/",
    });

    return actionSuccess("Verification successful")
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Something went wrong")
  }
}
