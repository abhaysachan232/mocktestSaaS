import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { connectDB } from "../../../lib/db";

import { User } from "../../../models/User";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Connect DB
    await connectDB();

    // Body
    const body = await req.json();

    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,

          error: "Email and password are required",
        },

        {
          status: 400,
        },
      );
    }

    // Find User
    const user = await User.findOne({
      email,
    });

    // User Not Found
    if (!user) {
      return NextResponse.json(
        {
          success: false,

          error: "User not found",
        },

        {
          status: 404,
        },
      );
    }

    // Password Check
    const isMatch = await bcrypt.compare(password, user.password);

    // Wrong Password
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,

          error: "Invalid password",
        },

        {
          status: 401,
        },
      );
    }

    // JWT Token
    const token = jwt.sign(
      {
        id: user._id,

        role: user.role,
      },

      process.env.JWT_SECRET!,

      {
        expiresIn: "7d",
      },
    );

    // Decide Redirect
    let redirectTo = "/dashboard";

    if (user.role === "admin") {
      redirectTo = "/admin";
    }

    if (user.role === "owner") {
      redirectTo = "/coaching/dashboard";
    }

    // Response
    const response = NextResponse.json({
      success: true,

      message: "Login Successful 🚀",

      redirectTo,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,
      },
    });

    // JWT Cookie
    response.cookies.set("token", token, {
      httpOnly: true,

      secure: false,

      sameSite: "strict",

      path: "/",

      maxAge: 60 * 60 * 24 * 7,
    });

    // Role Cookie
    response.cookies.set("role", user.role, {
      httpOnly: true,

      secure: false,

      sameSite: "strict",

      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        error: error instanceof Error ? error.message : "Server Error",
      },

      {
        status: 500,
      },
    );
  }
}
