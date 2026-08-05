"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { examSchema } from "@/schemas/exam";

export async function getSubjects() {
  return prisma.subject.findMany({
    include: { topics: true },
    orderBy: { name: "asc" },
  });
}

export async function getTopicsBySubjectIds(subjectIds: string[]) {
  if (subjectIds.length === 0) return [];

  return prisma.topic.findMany({
    where: {
      subjectId: {
        in: subjectIds,
      },
    },
    orderBy: [
      {
        subjectId: "asc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function createExam(values: unknown) {
  const parsed = examSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Form mein kuch fields galat hain",
    };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized. Pehle login karo." };
  }

  const {
    name,
    examDate,
    duration,
    totalMarks,
    totalQuestions,
    subjectIds,
    topics,
  } = parsed.data;

  try {
    const exam = await prisma.exam.create({
      data: {
        coachingId: session.user.id,
        name,
        examDate,
        duration,
        totalMarks,
        totalQuestions,
        subjects: {
          create: subjectIds.map((subjectId) => ({ subjectId })),
        },
        topics: {
          create: topics.map((t) => ({
            subjectId: t.subjectId,
            topicId: t.topicId,
          })),
        },
      },
      include: {
        subjects: { include: { subject: true } },
        topics: { include: { topic: true } },
      },
    });

    revalidatePath("/dashboard/exams");
    return { success: true, data: exam };
  } catch (error) {
    console.error("createExam error:", error);
    return { success: false, message: "Exam create karte waqt error aa gaya" };
  }
}

export async function getExams() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return prisma.exam.findMany({
    where: {
      coachingId: session.user.id,
    },
    include: {
      subjects: {
        include: {
          subject: true,
        },
      },
      topics: {
        include: {
          topic: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
