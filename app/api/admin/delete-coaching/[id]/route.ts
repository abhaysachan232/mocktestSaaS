// app/api/admin/delete-coaching/[id]/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB }
from "../../../../../lib/db";

import { User }
from "../../../../../models/User";

export async function DELETE(
  req: NextRequest,

  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    // Next.js 15 Fix
    const { id } =
      await params;

    console.log(
      "Connected to DB"
    );

    console.log(
      "Deleting Coaching:",
      id
    );

    // Delete Coaching
    const deletedUser =
      await User.findByIdAndDelete(
        id
      );

    console.log(
      deletedUser
    );

    // Not Found
    if (!deletedUser) {
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

    return NextResponse.json({
      success: true,

      message:
        "Coaching deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message:
          "Delete failed",
      },

      {
        status: 500,
      }
    );
  }
}