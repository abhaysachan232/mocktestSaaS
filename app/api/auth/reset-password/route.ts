import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyResetToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return Response.json(
        {
          success: false,
          message: "Password is required",
        },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();

    const token = cookieStore.get("reset-token")?.value;

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Reset session expired",
        },
        { status: 401 },
      );
    }

    const payload = verifyResetToken(token);

    if (payload.purpose !== "password-reset") {
      return Response.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    cookieStore.delete("reset-token");

    return Response.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Invalid or expired session",
      },
      { status: 401 },
    );
  }
}
