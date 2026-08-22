"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminDashboard() {
  const [students, coachings] = await Promise.all([
    prisma.student.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    }),

    prisma.coaching.findMany({
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
    }),
  ]);

  return {
    students,
    coachings: coachings.map((coaching) => ({
      id: coaching.id,
      code: coaching.code,
      coachingName: coaching.coachingName,
      ownerName: coaching.ownerName,
      mobile: coaching.mobile,
      address: coaching.address,
      logo: coaching.logo,
      email: coaching.users[0]?.email ?? null,
    })),
  };
}

export async function getCoachingDashboard(coachingId: string) {
  const coaching = await prisma.coaching.findUnique({
    where: {
      id: coachingId,
    },
  });

  const students = await prisma.student.findMany({
    where: {
      user: {
        coachingId,
      },
    },

    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return {
    coaching,
    students,
  };
}


export async function getStudentDashboard(userId: string) {
  return prisma.student.findFirst({
    where: {
      userId,
    },

    include: {
      user: {
        include: {
          coaching: true,
        },
      },
    },
  });
}

