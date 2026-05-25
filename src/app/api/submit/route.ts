import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "../../../lib/db";

import { Test } from "../../../models/Test";

import { Result } from "../../../models/Result";

import { calculateGrade } from "../../../lib/grading";
import { AnyAaaaRecord } from "node:dns";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      testId,
      studentId,
      answers,
      timeTakenSecs,
    } = await req.json();

    const test = await Test.findById(testId);

    if (!test) {
      return NextResponse.json(
        {
          error: "Test not found",
        },
        {
          status: 404,
        }
      );
    }

    const { score, subjectScores } =
      calculateGrade(
        test.questions,
        answers
      );

    const percentage = Math.round(
      (score / test.totalMarks) * 100
    );

    const result = await Result.create({
      student: studentId,

      test: testId,

      answers,

      score,

      totalMarks: test.totalMarks,

      percentage,

      timeTakenSecs,

      subjectScores,
    });

    // Rank Calculation

    const allResults = await Result.find({
      test: testId,
    }).sort({
      score: -1,
      timeTakenSecs: 1,
    });

    for (let i = 0; i < allResults.length; i++) {
      allResults[i].rank = i + 1;

      allResults[i].totalAttempts =
        allResults.length;

      await allResults[i].save();
    }

    const savedResult =
      await Result.findById(result._id);

    return NextResponse.json({
      success: true,

      result: savedResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Submit failed",
      },
      {
        status: 500,
      }
    );
  }
}