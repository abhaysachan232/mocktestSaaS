import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

export function errorResponse(error: unknown, status = 500) {
  console.error(error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: error.issues[0]?.message,
        errors: error.issues,
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    },
    {
      status,
    },
  );
}
