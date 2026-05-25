import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB }
from "../../../../lib/db";

import { Test }
from "../../../../models/Test";

export async function GET(
  req: NextRequest,

  {
    params,
  }: {
    params: Promise<{
      testId: string;
    }>;
  }
) {
  try {
    // DB
    await connectDB();

    // Params
    const {
      testId,
    } = await params;

    // Test
    const test =
      await Test.findById(
        testId
      );

    // Not Found
    if (!test) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Test not found",
        },

        {
          status: 404,
        }
      );
    }

    // Response
    return NextResponse.json(
      {
        success: true,

        test,
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
          "Failed to fetch test",
      },

      {
        status: 500,
      }
    );
  }
}