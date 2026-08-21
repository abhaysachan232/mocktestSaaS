"use server";

import { prisma } from "@/lib/prisma";
import { examSchema } from "@/schemas/exam";
import { revalidatePath } from "next/cache";

type ActionResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};

export async function createExam(values: unknown): Promise<ActionResponse> {
  try {
    const parsed = examSchema.safeParse(values);

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid exam data",
      };
    }

    const { name, slug, description, subjectIds, topicIds } = parsed.data;
    const existingExam = await prisma.exam.findUnique({
      where: {
        slug,
      },
    });

    if (existingExam) {
      return {
        success: false,
        message: "Exam with this slug already exists",
      };
    }

    const subjects = await prisma.subject.findMany({
      where: {
        id: {
          in: subjectIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (subjects.length !== subjectIds.length) {
      return {
        success: false,
        message: "One or more selected subjects are invalid",
      };
    }

    const topics = await prisma.topic.findMany({
      where: {
        id: {
          in: topicIds,
        },
      },
      select: {
        id: true,
        subjectId: true,
      },
    });

    const invalidTopic = topics.some(
      (topic) => !subjectIds.includes(topic.subjectId),
    );

    if (invalidTopic) {
      return {
        success: false,
        message: "Selected topic does not belong to selected subject",
      };
    }

    const exam = await prisma.$transaction(async (tx) => {
      const createdExam = await tx.exam.create({
        data: {
          name,
          slug,
          description: description || null,
        },
      });

      if (subjectIds.length > 0) {
        await tx.examSubject.createMany({
          data: subjectIds.map((subjectId) => ({
            examId: createdExam.id,
            subjectId,
          })),
        });
      }

      if (topicIds.length > 0) {
        await tx.examTopic.createMany({
          data: topics.map((topic) => ({
            examId: createdExam.id,
            subjectId: topic.subjectId,
            topicId: topic.id,
          })),
        });
      }

      return createdExam;
    });

    revalidatePath("/exams");

    return {
      success: true,
      message: "Exam created successfully",
      data: exam,
    };
  } catch (error) {
    console.error("CREATE_EXAM_ERROR:", error);

    return {
      success: false,
      message: "Failed to create exam",
    };
  }
}

export async function getExams() {
  return prisma.exam.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      examSubjects: {
        include: {
          subject: true,
        },
      },
      examTopics: {
        include: {
          topic: true,
        },
      },
      _count: {
        select: {
          examSubjects: true,
          examTopics: true,
        },
      },
    },
  });
}

export async function getExamById(id: string) {
  return prisma.exam.findUnique({
    where: {
      id,
    },
    include: {
      examSubjects: {
        include: {
          subject: true,
        },
      },
      examTopics: {
        include: {
          topic: true,
        },
      },
    },
  });
}

export async function updateExam(
  id: string,
  values: unknown,
): Promise<ActionResponse> {
  try {
    const parsed = examSchema.safeParse(values);

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid exam data",
      };
    }

    const { name, slug, description, subjectIds, topicIds } = parsed.data;
    const existingExam = await prisma.exam.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    });

    if (existingExam) {
      return {
        success: false,
        message: "Another exam already uses this slug",
      };
    }

    const topics = await prisma.topic.findMany({
      where: {
        id: {
          in: topicIds,
        },
      },
      select: {
        id: true,
        subjectId: true,
      },
    });

    const invalidTopic = topics.some(
      (topic) => !subjectIds.includes(topic.subjectId),
    );

    if (invalidTopic) {
      return {
        success: false,
        message: "Selected topic does not belong to selected subject",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.exam.update({
        where: {
          id,
        },
        data: {
          name,
          slug,
          description: description || null,
        },
      });

      await tx.examSubject.deleteMany({
        where: {
          examId: id,
        },
      });

      await tx.examTopic.deleteMany({
        where: {
          examId: id,
        },
      });

      if (subjectIds.length > 0) {
        await tx.examSubject.createMany({
          data: subjectIds.map((subjectId) => ({
            examId: id,
            subjectId,
          })),
        });
      }

      if (topicIds.length > 0) {
        await tx.examTopic.createMany({
          data: topics.map((topic) => ({
            examId: id,
            subjectId: topic.subjectId,
            topicId: topic.id,
          })),
        });
      }
    });

    revalidatePath("/exams");
    revalidatePath(`/exams/${id}/edit`);

    return {
      success: true,
      message: "Exam updated successfully",
    };
  } catch (error) {
    console.error("UPDATE_EXAM_ERROR:", error);

    return {
      success: false,
      message: "Failed to update exam",
    };
  }
}

export async function deleteExam(id: string): Promise<ActionResponse> {
  try {
    const exam = await prisma.exam.findUnique({
      where: {
        id,
      },
    });

    if (!exam) {
      return {
        success: false,
        message: "Exam not found",
      };
    }

    await prisma.exam.delete({
      where: {
        id,
      },
    });

    revalidatePath("/exams");

    return {
      success: true,
      message: "Exam deleted successfully",
    };
  } catch (error) {
    console.error("DELETE_EXAM_ERROR:", error);

    return {
      success: false,
      message: "Failed to delete exam",
    };
  }
}

export async function getSubjectsWithTopics() {
  return prisma.subject.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      topics: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });
}
