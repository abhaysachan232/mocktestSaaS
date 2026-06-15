// app/api/student/results/route.ts

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

import { Result }
from "../../../../models/Result";

export async function GET(  
) {
  try {
    await connectDB();

    // Token
    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        "token"
      )?.value;

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

    // Student
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

    // Last 5 Results
    const results =
      await Result.find({
        student:
          student._id,
      })
        .populate(
          "test",
          "title"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    return NextResponse.json(
      {
        success: true,

        results,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to fetch results",
      },

      {
        status: 500,
      }
    );
  }
}