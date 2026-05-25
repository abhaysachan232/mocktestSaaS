import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const { email, password } =
      body;

    // YOUR ADMIN LOGIN
    if (
      email ===
        "abhaysachan232@gmail.com" &&
      password === "Abhay@123"
    ) {
      const response =
        NextResponse.json({
          success: true,
          message:
            "Admin Login Successful",
        });

      // Admin cookie
      response.cookies.set(
        "adminToken",
        "adminloggedin",
        {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          path: "/",
        }
      );

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid Admin Credentials",
      },
      {
        status: 401,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}