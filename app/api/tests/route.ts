import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB Connected Successfully",
    });
  } catch (error) {
    console.error("MONGO ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        fullError: error,
      },
      { status: 500 }
    );
  }
}