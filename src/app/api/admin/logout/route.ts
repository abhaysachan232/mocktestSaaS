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

    // Delete Cookie
    response.cookies.delete(
      "adminToken"
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