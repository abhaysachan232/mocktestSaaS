"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { examSchema } from "@/schemas/exam";
import { revalidatePath } from "next/cache";

type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

type UserContext = {
  id: string;
  role: string;
};

async function getUserContext(): Promise<UserContext | null> {
  const session = await auth();

  if (!session?.user?.id || !session.user.role) {
    return null;
  }

  return {
    id: session.user.id,
    role: session.user.role,
  };
}

function canManageExams(role: string) {
  return role === "ADMIN" || role === "COACHING";
}

/**
 * Create Exam
 *
 * ADMIN    -> allowed
 * COACHING -> allowed
 * STUDENT  -> denied
 */
export async function createExam(values: unknown): Promise<ActionResponse> {
  try {
    const user = await getUserContext();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    if (!canManageExams(user.role)) {
      return {
        success: false,
        message: "You are not allowed to create exams",
      };
    }

    const parsed = examSchema.safeParse(values);

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid exam data",
      };
    }

    const { name, slug, description, subjectIds, topicIds } = parsed.data;

    /**
     * Slug is globally unique in Prisma.
     */
    const existingExam = await prisma.exam.findUnique({
      where: {
        slug,
      },

      select: {
        id: true,
      },
    });

    if (existingExam) {
      return {
        success: false,
        message: "Exam with this slug already exists",
      };
    }

    /**
     * Validate selected Subjects.
     */
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

    /**
     * Validate selected Topics.
     */
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

    if (topics.length !== topicIds.length) {
      return {
        success: false,
        message: "One or more selected topics are invalid",
      };
    }

    /**
     * Every Topic must belong to one of selected Subjects.
     */
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

          /**
           * Ownership
           *
           * Admin    -> admin userId
           * Coaching -> coaching userId
           */
          userId: user.id,
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

/**
 * Get Exams
 *
 * ADMIN    -> all exams
 * COACHING -> own exams
 */
export async function getExams() {
  const user = await getUserContext();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!canManageExams(user.role)) {
    throw new Error("You are not allowed to view exams");
  }

  return prisma.exam.findMany({
    where:
      user.role === "ADMIN"
        ? {}
        : {
            userId: user.id,
          },

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

      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Get Exam By ID
 *
 * ADMIN    -> any exam
 * COACHING -> own exam only
 */
export async function getExamById(id: string) {
  const user = await getUserContext();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!canManageExams(user.role)) {
    throw new Error("You are not allowed to view exams");
  }

  return prisma.exam.findFirst({
    where: {
      id,

      ...(user.role === "ADMIN"
        ? {}
        : {
            userId: user.id,
          }),
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

      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Update Exam
 *
 * ADMIN    -> any exam
 * COACHING -> own exam
 */
export async function updateExam(
  id: string,
  values: unknown,
): Promise<ActionResponse> {
  try {
    const user = await getUserContext();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    if (!canManageExams(user.role)) {
      return {
        success: false,
        message: "You are not allowed to update exams",
      };
    }

    const parsed = examSchema.safeParse(values);

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid exam data",
      };
    }

    const { name, slug, description, subjectIds, topicIds } = parsed.data;

    /**
     * Ownership check.
     */
    const existingExam = await prisma.exam.findFirst({
      where: {
        id,

        ...(user.role === "ADMIN"
          ? {}
          : {
              userId: user.id,
            }),
      },

      select: {
        id: true,
      },
    });

    if (!existingExam) {
      return {
        success: false,
        message: "Exam not found",
      };
    }

    /**
     * Slug duplicate check.
     */
    const duplicate = await prisma.exam.findFirst({
      where: {
        slug,

        NOT: {
          id,
        },
      },

      select: {
        id: true,
      },
    });

    if (duplicate) {
      return {
        success: false,
        message: "Another exam already uses this slug",
      };
    }

    /**
     * Validate Subjects.
     */
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

    /**
     * Validate Topics.
     */
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

    if (topics.length !== topicIds.length) {
      return {
        success: false,
        message: "One or more selected topics are invalid",
      };
    }

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
      /**
       * Update only after ownership was verified above.
       */
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

/**
 * Delete Exam
 *
 * ADMIN    -> any exam
 * COACHING -> own exam
 */
export async function deleteExam(id: string): Promise<ActionResponse> {
  try {
    const user = await getUserContext();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    if (!canManageExams(user.role)) {
      return {
        success: false,
        message: "You are not allowed to delete exams",
      };
    }

    /**
     * Ownership check.
     */
    const exam = await prisma.exam.findFirst({
      where: {
        id,

        ...(user.role === "ADMIN"
          ? {}
          : {
              userId: user.id,
            }),
      },

      select: {
        id: true,
      },
    });

    if (!exam) {
      return {
        success: false,
        message: "Exam not found",
      };
    }

    /**
     * Exam relations use onDelete: Cascade
     * according to the Prisma schema.
     */
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

/**
 * Global Subjects + Topics.
 *
 * Coaching does NOT own Subjects.
 */
export async function getSubjectsWithTopics() {
  const user = await getUserContext();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!canManageExams(user.role)) {
    throw new Error("You are not allowed to access subjects");
  }

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
