"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { CoachingRegisterInput } from "@/schemas/coaching";
import { ROLES } from "@/lib/constans";

export async function createCoaching(data: CoachingRegisterInput) {
  console.log('createCoaching', data)
  const [existingEmail, existingMobile] = await Promise.all([
    prisma.user.findUnique({
      where: {
        email: data.email,
      },
    }),

    prisma.coaching.findUnique({
      where: {
        code: data.code,
        mobile: data.mobile,
      },
    }),
  ]);

  if (existingEmail || existingMobile) {
    throw new Error("Coaching already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  return prisma.$transaction(async (tx) => {
    const coaching = await tx.coaching.create({
      data: {
        code: data.code,
        coachingName: data.coachingName,
        ownerName: data.ownerName,
        mobile: data.mobile,
        address: data.address,
        idNumber: data.idNumber,
        idProof: data.idProof,
        logo: data.logo,
      },
    });

    const user = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: ROLES.COACHING,
        coachingId: coaching.id,
      },
    });

    return {
      coaching,
      user,
    };
  });
}
