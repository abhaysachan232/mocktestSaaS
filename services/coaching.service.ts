import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { CoachingRegisterInput } from "@/schemas/coaching";

export async function getAllCoachings() {
  return prisma.coaching.findMany({
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
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { mobile: data.mobile }],
    },
  });

  if (existingUser) {
    throw new Error("Email or Mobile already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.$transaction(async (tx) => {
    const coaching = await tx.coaching.create({
      data: {
        code: crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase(),

        coachingName: data.coachingName,
        ownerName: data.ownerName,
        address: data.address,
        idNumber: data.idNumber,
      },
    });

    const user = await tx.user.create({
      data: {
        name: data.ownerName,
        email: data.email,
        mobile: data.mobile,
        password: hashedPassword,
        role: "COACHING",
        coachingId: coaching.id,
      },
    });

    return {
      coaching,
      user,
    };
  });
}
