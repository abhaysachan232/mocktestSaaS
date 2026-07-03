"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyResetToken } from "@/lib/jwt";
import { actionError, actionSuccess } from "@/lib/action-response";

export async function resetPasswordAction(password: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("reset-token")?.value;

    if (!token) {
      return actionError("Reset session expired");
    }

    const payload = verifyResetToken(token);

    if (payload.purpose !== "password-reset") {
      return actionError("Invalid reset session");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: {
        id: payload.userId,
      },

      data: {
        password: hashedPassword,
      },
    });

    cookieStore.delete("reset-token");
    return actionSuccess("Password reset successfully");
  } catch(error) {
    return actionError(error instanceof Error ? error.message : "Invalid or expired session");
  }
}
