// app/api/admin/create-coaching/route.ts

import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { connectDB } from "../../../../lib/db";

import { User } from "../../../../models/User";

export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      email,
      password,
      logo,
      couponCode,
      commission,
    } = body;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !couponCode
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields are required",
        },

        {
          status: 400,
        }
      );
    }

    // Check Existing User
    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email already exists",
        },

        {
          status: 400,
        }
      );
    }

    // Check Existing Coupon
    const existingCoupon =
      await User.findOne({
        couponCode,
      });

    if (existingCoupon) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Coupon already exists",
        },

        {
          status: 400,
        }
      );
    }

    // Hash Password
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // Create Coaching Admin
    const coaching =
      await User.create({
        name,

        email,

        password:
          hashedPassword,

        logo,

        couponCode,

        commission:
          commission || 27,

        role: "owner",

        isActive: true,
      });

    return NextResponse.json({
      success: true,

      message:
        "Coaching Created Successfully 🚀",

      coaching,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal Server Error",
      },

      {
        status: 500,
      }
    );
  }
}