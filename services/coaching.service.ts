import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { CoachingRegisterInput } from "@/schemas/coaching";
import { ROLES } from "@/lib/constans";

export async function getAllCoachings() {
  return prisma.coaching.findMany({
    include: {
      users: {
        where: {
          role: "COACHING",
        },
        select: {
          email: true,
        },
      },
    },

    orderBy: {
      coachingName: "asc",
    },
  });
}

export async function getCoachingById(coachingId: string) {
  return prisma.coaching.findUnique({
    where: {
      id: coachingId,
    },

    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
        },
      },
    },
  });
}

export async function createCoaching(data: CoachingRegisterInput) {
  console.log("idProof", data.idProof, data.idProof[0])
  const [existingEmail, existingMobile] = await Promise.all([
    prisma.user.findUnique({
      where: {
        email: data.email,
      },
    }),

    prisma.coaching.findUnique({
      where: {
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
        code: crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase(),

        coachingName: data.coachingName,
        ownerName: data.ownerName,
        mobile: data.mobile,
        address: data.address,
        idNumber: data.idNumber,
        idProof: "",
        logo: "",
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
