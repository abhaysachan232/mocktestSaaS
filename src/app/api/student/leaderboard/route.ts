// app/api/student/leaderboard/route.ts

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

    // All Results
    const allResults =
      await Result.find()
        .populate(
          "student",
          "name"
        )
        .sort({
          score: -1,
        });

    // Total Students
    const totalStudents =
      allResults.length;

    // Student Rank
    const studentIndex =
      allResults.findIndex(
        (item: { student?: { _id?: { toString: () => string } } }) =>
          item.student?._id?.toString() ===
          student._id.toString()
      );

    const studentRank =
      studentIndex + 1;

    // Top 10
    const topStudents =
      allResults.slice(
        0,
        10
      );

    // Around Current Student
    const start =
      Math.max(
        studentIndex - 5,
        0
      );

    const end =
      Math.min(
        studentIndex + 5,
        totalStudents
      );

    const nearbyStudents =
      allResults.slice(
        start,
        end
      );

    return NextResponse.json(
      {
        success: true,

        totalStudents,

        studentRank,

        topStudents,

        nearbyStudents,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to fetch leaderboard",
      },

      {
        status: 500,
      }
    );
  }
}