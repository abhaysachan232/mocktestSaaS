import { NextResponse }from "next/server";

import { connectDB }
from "../../../../lib/db";

import { User }
from "../../../../models/User";

import { Test }
from "../../../../models/Test";

export async function GET() {
  try {
    await connectDB();

    // Students
    const students =
      await User.find({
        role: "student",
      }).select( 
        "name email"
      );

    // Coachings
    const coachings =
      await User.find({
        role: "owner",
      }).select(
        "name email logo couponCode commission"
      );

    // Tests
    const tests =
      await Test.find()
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // Dashboard Stats
    const totalStudents =
      students.length;

    const totalTests =
      await Test.countDocuments();

    const revenue =
      students.length * 97;

    const activeUsers =
      await User.countDocuments({
        isActive: true,
      });

    return NextResponse.json({
      success: true,

      data: {
        totalStudents,

        totalTests,

        revenue,

        activeUsers,

        coachings,

        students,

        recentTests:
          tests.map(
            (test: {
              _id: string;
              title: string;
              questions?: unknown[];
              isActive: boolean;
            }) => ({
              _id:
                test._id,

              title:
                test.title,

              totalQuestions:
                test.questions
                  ?.length || 0,

              students: 0,

              status:
                test.isActive
                  ? "Active"
                  : "Inactive",
            })
          ),
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },

      {
        status: 500,
      }
    );
  }
}