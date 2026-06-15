import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../lib/db";
import { User } from "../../../models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, mobile, password, course, couponCode } = body;

    // Validation
    if (!name || !email || !mobile || !password || !course) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    // Existing User
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists",
        },
        {
          status: 400,
        },
      );
    }

    // Find Coaching
    let coachingId = null;
    if (couponCode) {
      const coaching = await User.findOne({
        couponCode: couponCode.toUpperCase(),

        role: "owner",
      });

      if (coaching) {
        coachingId = coaching._id;
      }
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,

      email,

      mobile,

      course,

      coachingId,

      password: hashedPassword,
    });

    // Safe Response
    const safeUser = {
      _id: user._id,

      name: user.name,

      email: user.email,

      mobile: user.mobile,

      course: user.course,

      role: user.role,

      coachingId: user.coachingId,
    };

    return NextResponse.json(
      {
        success: true,

        message: "User registered successfully",

        user: safeUser,
      },

      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    console.log(error);

    const message =
      error instanceof Error ? error.message : "Registration failed";

    return NextResponse.json(
      {
        success: false,

        error: message,
      },

      {
        status: 500,
      },
    );
  }
}
