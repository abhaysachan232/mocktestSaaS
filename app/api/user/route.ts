import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    include: {
      enrollments: true,
      attempts: true,
    },
  });

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        mobile: body.mobile,
        dob: body.dob,
        role: body.role || "STUDENT", // ✅ default
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "User creation failed" }, { status: 500 });
  }
}