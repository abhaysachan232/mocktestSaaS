import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "../../../../lib/db";

import { Result } from "../../../../models/Result";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  try {
    await connectDB();

    const result = await Result.findById(
      params.id
    )
      .populate("student")
      .populate("test");

    if (!result) {
      return NextResponse.json(
        {
          error: "Result not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch result",
      },
      {
        status: 500,
      }
    );
  }
}