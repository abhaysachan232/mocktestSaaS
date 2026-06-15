import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB }
from "../../../../../lib/db";

import { User }
from "../../../../../models/User";

import { Result }
from "../../../../../models/Result";

export async function GET(
  req: NextRequest,

  {
    params,
  }: {
    params: Promise<{
      studentId: string;
    }>;
  }
) {
  try {
    // DB
    await connectDB();

    // Params
    const {
      studentId,
    } = await params;

    // Student
    const student =
      await User.findById(
        studentId
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

    // Results
    const results =
      await Result.find({
        student:
          studentId,
      });

    // Total Tests
    const totalTests =
      results.length;

    // Average Score
    const averageScore =
      totalTests > 0
        ? Math.round(
            results.reduce(
              (
                acc:any,
                item:any
              ) =>
                acc +
                item.score,
              0
            ) / totalTests
          )
        : 0;

    // Best Rank
    const bestRank =
      totalTests > 0
        ? Math.min(
            ...results.map(
              (
                item:any
              ) =>
                item.rank
            )
          )
        : 0;

    // Weak Subjects
    const weakSubjectsCount = 3;

    return NextResponse.json(
      {
        success: true,

        stats: {
          student: {
            _id:
              student._id,

            name:
              student.name,

            email:
              student.email,

            mobile:
              student.mobile,

            course:
              student.course,

            role:
              student.role,
          },

          totalTests,

          averageScore,

          bestRank,

          weakSubjectsCount,
        },
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
          "Failed to fetch stats",
      },

      {
        status: 500,
      }
    );
  }
}