// app/api/student/tests/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import jwt from "jsonwebtoken";

import { cookies }
from "next/headers";

import { connectDB }
from "../../../../lib/db";

import { User }
from "../../../../models/User";

import { Test }
from "../../../../models/Test";

export async function GET() {
  try {
    // Connect DB
    await connectDB();

    // Get Token
    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        "token"
      )?.value;

    // Unauthorized
    if (!token) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Unauthorized",
        },

        {
          status: 401,
        }
      );
    }

    // Verify JWT
   const decoded =
       jwt.verify(
         token,
        "loggedin"
       ) as {
         id: string;
       };

    // Find Student
    const student =
      await User.findById(
        decoded.id
      );

    if (!student) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Student not found",
        },

        {
          status: 404,
        }
      );
    }

    // Find Tests According To Course
    const tests =
      await Test.find({
        course:
          student.course,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json(
      {
        success: true,

        tests,
      },

      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to fetch tests",
      },

      {
        status: 500,
      }
    );
  }
}