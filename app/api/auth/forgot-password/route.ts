import { prisma } from "@/lib/prisma";
import { generateResetToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, mobile, dob } = await req.json();

    if (!email || !mobile || !dob) {
      return Response.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
        mobile,
        isActive: true,
      },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid details",
        },
        { status: 400 },
      );
    }

    const dbDob = user.dob?.toISOString().split("T")[0];
    const inputDob = new Date(dob).toISOString().split("T")[0];

    if (dbDob !== inputDob) {
      return Response.json(
        {
          success: false,
          message: "Invalid details",
        },
        { status: 400 },
      );
    }

    const token = generateResetToken(user.id);

    const cookieStore = await cookies();

    cookieStore.set("reset-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    return Response.json({
      success: true,
      message: "Verification successful",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
