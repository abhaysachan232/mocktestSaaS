"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { RegisterResult, registerSchema } from "@/lib/validations/register";
import z from "zod";

export async function registerUser(
  formData: FormData,
): Promise<RegisterResult> {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      mobile: formData.get("mobile"),
      dob: formData.get("dob"),
      password: formData.get("password"),
    };

    const validatedFields = registerSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const tree = z.treeifyError(validatedFields.error);

      return {
        success: false,
        errors: {
          name: tree.properties?.name?.errors,
          email: tree.properties?.email?.errors,
          mobile: tree.properties?.mobile?.errors,
          dob: tree.properties?.dob?.errors,
          password: tree.properties?.password?.errors,
        },
      };
    }

    const { name, email, mobile, dob, password } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        errors: {
          email: ["Email already registered"],
        },
      };
    }

    const existingMobile = await prisma.user.findFirst({
      where: {
        mobile,
      },
    });

    if (existingMobile) {
      return {
        success: false,
        errors: {
          mobile: ["Mobile number already registered"],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        dob: new Date(dob),
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account created successfully. Please verify your email.",
    };
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return {
      success: false,
      errors: {
        general: ["Something went wrong. Please try again."],
      },
    };
  }
}
