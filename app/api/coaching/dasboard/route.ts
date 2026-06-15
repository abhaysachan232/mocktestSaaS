// app/api/coaching/dashboard/route.ts

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "../../../../lib/db";

import { User } from "../../../../models/User";

import { Test } from "../../../../models/Test";

// Example Result Model
import { Result } from "../../../../models/Result";

export async function GET(
  req: NextRequest
) {
  try {
    await connectDB();

    // Get Coaching Cookie
    const coachingId =
      req.cookies.get(
        "userId"
      )?.value;

    if (!coachingId) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Unauthorized",
        },

        {
          status: 401,
        }
      );
    }

    // Coaching Data
    const coaching =
      await User.findById(
        coachingId
      );

    if (!coaching) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Coaching not found",
        },

        {
          status: 404,
        }
      );
    }

    // Students
    const students =
      await User.find({
        coachingId:
          coaching._id,

        role: "student",
      });

    // Total Revenue
    const revenue =
      students.length *
      (coaching.commission ||
        27);

    // Total Tests
    const totalTests =
      await Test.countDocuments();

    // Student Analytics
    const studentAnalytics =
      await Promise.all(
        students.map(
          async (student) => {
            // Student Results
            const results =
              await Result.find({
                studentId:
                  student._id,
              });

            const exams =
              results.length;

            let totalScore = 0;

            const subjects:
              Record<
                string,
                number[]
              > = {};

            results.forEach(
              (result: typeof Result.prototype) => {
                totalScore +=
                  result.score;

                Object.entries(
                  result.subjectsPerformance ||
                    {}
                ).forEach(
                  ([
                    subject,
                    score,
                  ]) => {
                    if (
                      !subjects[
                        subject
                      ]
                    ) {
                      subjects[
                        subject
                      ] = [];
                    }

                    subjects[
                      subject
                    ].push(
                      Number(
                        score
                      )
                    );
                  }
                );
              }
            );

            // Average Score
            const avgScore =
              exams > 0
                ? Math.round(
                    totalScore /
                      exams
                  )
                : 0;

            // Strong / Weak Subject
            let weak =
              "N/A";

            let strong =
              "N/A";

            let lowest =
              Infinity;

            let highest = 0;

            Object.entries(
              subjects
            ).forEach(
              ([
                subject,
                scores,
              ]) => {
                const avg =
                  scores.reduce(
                    (
                      a,
                      b
                    ) =>
                      a + b,
                    0
                  ) /
                  scores.length;

                if (
                  avg < lowest
                ) {
                  lowest = avg;

                  weak =
                    subject;
                }

                if (
                  avg >
                  highest
                ) {
                  highest =
                    avg;

                  strong =
                    subject;
                }
              }
            );

            // Improvement %
            const firstHalf =
              results
                .slice(
                  0,
                  Math.floor(
                    exams / 2
                  )
                )
                .reduce(
                  (
                    acc: number,
                    item: typeof Result.prototype
                  ) => acc + item.score,
                  0
                );

            const secondHalf =
              results
                .slice(
                  Math.floor(
                    exams / 2
                  )
                )
                .reduce(
                  (
                    acc: number,
                    item: typeof Result.prototype
                  ) => acc + item.score,
                  0
                );

            const improvement =
              exams > 1
                ? Math.round(
                    ((secondHalf -
                      firstHalf) /
                      Math.max(
                        firstHalf,
                        1
                      )) *
                      100
                  )
                : 0;

            return {
              _id: student._id,

              name: student.name,

              exams,

              avgScore,

              weak,

              strong,

              improvement: `${improvement}%`,
            };
          }
        )
      );

    return NextResponse.json({
      success: true,

      data: {
        coaching: {
          name:
            coaching.name,

          logo:
            coaching.logo,

          couponCode:
            coaching.couponCode,

          totalStudents:
            students.length,

          revenue,

          totalTests,
        },

        students:
          studentAnalytics,
      },
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