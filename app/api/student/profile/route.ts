// app/api/student/profile/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import jwt from "jsonwebtoken";

import { cookies }
from "next/headers";

import { connectDB }
from "../../../../lib/db";

import { User }
from "../../../../models/User";

export async function GET(
  req: NextRequest
) {
  try {
    // Connect DB
    await connectDB();

    // Cookie
    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        "token"
      )?.value;

    // Unauthorized
    if (!token) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Unauthorized",
        },

        {
          status: 401,
        }
      );
    }

    // Verify JWT
  const decoded =
      jwt.verify(
        token,
       "loggedin"
      ) as {
        id: string;
      };

    // Find Student
    const student =
      await User.findById(
        decoded.id
      )
        .select(
          "-password"
        )
        .populate(
          "coachingId",
          "name logo couponCode"
        );

    // Student Not Found
    if (!student) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Student not found",
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

        profile: {
          _id:
            student._id,

          name:
            student.name,

          email:
            student.email,

          mobile:
            student.mobile,

          course:
            student.course,

          role:
            student.role,

          image:
            student.image,

          coaching:
            student.coachingId
              ? {
                  name:
                    (
                      student.coachingId as any
                    )
                      .name,

                  logo:
                    (
                      student.coachingId as any
                    )
                      .logo,

                  couponCode:
                    (
                      student.coachingId as any
                    )
                      .couponCode,
                }
              : null,
        },
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
          "Failed to fetch profile",
      },

      {
        status: 500,
      }
    );
  }
}