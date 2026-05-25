// app/api/logout/route.ts

import { NextResponse }
from "next/server";

export async function POST() {
  try {
    const response =
      NextResponse.json({
        success: true,

        message:
          "Logout successful",
      });

    // Remove token cookie
    response.cookies.set(
      "token",
      "",
      {
        expires:
          new Date(0),

        path: "/",
      }
    );

    // Remove userId cookie
    response.cookies.set(
      "userId",
      "",
      {
        expires:
          new Date(0),

        path: "/",
      }
    );

    // Remove role cookie
    response.cookies.set(
      "role",
      "",
      {
        expires:
          new Date(0),

        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message:
          "Logout failed",
      },

      {
        status: 500,
      }
    );
  }
}