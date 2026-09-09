"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type QuestionFormValues, questionSchema } from "@/schemas/question";
import { revalidatePath } from "next/cache";

type ActionResponse<T = unknown> = {
  success: boolean;
  error?: string;
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

function canManageQuestions(role: string) {
  return role === "ADMIN" || role === "COACHING";
}

/**
 * Returns all global Subjects + Topics.
 *
 * Subjects are NOT owned by Coaching.
 * Both Admin and Coaching can use them while creating Questions.
 */
export async function getQuestionSubjects(): Promise<ActionResponse> {
  try {
    const user = await getUserContext();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        data: [],
      };
    }

    if (!canManageQuestions(user.role)) {
      return {
        success: false,
        error: "You are not allowed to manage questions",
        data: [],
      };
    }

    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,

        topics: {
          orderBy: {
            name: "asc",
          },

          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      data: subjects,
    };
  } catch (error) {
    console.error("GET_QUESTION_SUBJECTS_ERROR:", error);

    return {
      success: false,
      error: "Failed to load subjects",
      data: [],
    };
  }
}

/**
 * Create Question
 *
 * ADMIN    -> can create
 * COACHING -> can create
 * STUDENT  -> cannot create
 */
export async function createQuestion(
  payload: QuestionFormValues,
): Promise<ActionResponse> {
  try {
    const user = await getUserContext();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!canManageQuestions(user.role)) {
      return {
        success: false,
        error: "You are not allowed to create questions",
      };
    }

    const parsed = questionSchema.safeParse(payload);

    if (!parsed.success) {
      console.error("Question validation error:", parsed.error.flatten());

      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid question",
      };
    }

    const { subjectId, topicId, type, content, solution, options } =
      parsed.data;

    /**
     * Make sure selected Topic belongs to selected Subject.
     */
    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        subjectId,
      },

      select: {
        id: true,
      },
    });

    if (!topic) {
      return {
        success: false,
        error: "Topic does not belong to selected subject",
      };
    }

    const question = await prisma.question.create({
      data: {
        userId: user.id,
        subjectId,
        topicId,
        type,
        content,
        solution,

        options: {
          create: options.map((option) => ({
            content: option.content,
            isCorrect: option.isCorrect,
          })),
        },
      },

      include: {
        subject: true,
        topic: true,
        options: true,
      },
    });

    revalidatePath("/questions");

    return {
      success: true,
      data: question,
    };
  } catch (error) {
    console.error("CREATE_QUESTION_ERROR:", error);

    return {
      success: false,
      error: "Failed to create question",
    };
  }
}

/**
 * Get Questions
 *
 * ADMIN    -> all questions
 * COACHING -> only own questions
 */
export async function getQuestions(): Promise<ActionResponse> {
  try {
    const user = await getUserContext();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        data: [],
      };
    }

    if (!canManageQuestions(user.role)) {
      return {
        success: false,
        error: "You are not allowed to view questions",
        data: [],
      };
    }

    const questions = await prisma.question.findMany({
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
        subject: true,
        topic: true,
        options: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      success: true,
      data: questions,
    };
  } catch (error) {
    console.error("GET_QUESTIONS_ERROR:", error);

    return {
      success: false,
      error: "Failed to load questions",
      data: [],
    };
  }
}

/**
 * Get Question By ID
 *
 * ADMIN    -> any question
 * COACHING -> own question only
 */
export async function getQuestionById(id: string): Promise<ActionResponse> {
  try {
    const user = await getUserContext();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        data: null,
      };
    }

    if (!canManageQuestions(user.role)) {
      return {
        success: false,
        error: "You are not allowed to view questions",
        data: null,
      };
    }

    const question = await prisma.question.findFirst({
      where: {
        id,

        ...(user.role === "ADMIN"
          ? {}
          : {
              userId: user.id,
            }),
      },

      include: {
        subject: true,
        topic: true,

        options: {
          orderBy: {
            id: "asc",
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

    if (!question) {
      return {
        success: false,
        error: "Question not found",
        data: null,
      };
    }

    return {
      success: true,
      data: question,
    };
  } catch (error) {
    console.error("GET_QUESTION_BY_ID_ERROR:", error);

    return {
      success: false,
      error: "Failed to load question",
      data: null,
    };
  }
}

/**
 * Update Question
 *
 * ADMIN    -> can update any question
 * COACHING -> can update own question only
 */
export async function updateQuestion(
  id: string,
  input: QuestionFormValues,
): Promise<ActionResponse> {
  try {
    const user = await getUserContext();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!canManageQuestions(user.role)) {
      return {
        success: false,
        error: "You are not allowed to update questions",
      };
    }

    const parsed = questionSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid question",
      };
    }

    /**
     * Ownership check.
     *
     * Admin can update any question.
     * Coaching can update only its own question.
     */
    const existing = await prisma.question.findFirst({
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

    if (!existing) {
      return {
        success: false,
        error: "Question not found",
      };
    }

    const { subjectId, topicId, type, content, solution, options } =
      parsed.data;

    /**
     * Validate Topic -> Subject relation.
     */
    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        subjectId,
      },

      select: {
        id: true,
      },
    });

    if (!topic) {
      return {
        success: false,
        error: "Invalid subject/topic",
      };
    }

    const question = await prisma.$transaction(async (tx) => {
      await tx.questionOption.deleteMany({
        where: {
          questionId: id,
        },
      });

      return tx.question.update({
        where: {
          id,
        },

        data: {
          subjectId,
          topicId,
          type,
          content,
          solution,

          options: {
            create: options.map((option) => ({
              content: option.content,
              isCorrect: option.isCorrect,
            })),
          },
        },

        include: {
          subject: true,
          topic: true,
          options: true,
        },
      });
    });

    revalidatePath("/questions");
    revalidatePath(`/questions/${id}/edit`);

    return {
      success: true,
      data: question,
    };
  } catch (error) {
    console.error("UPDATE_QUESTION_ERROR:", error);

    return {
      success: false,
      error: "Failed to update question",
    };
  }
}

/**
 * Delete Question
 *
 * ADMIN    -> can delete any question
 * COACHING -> can delete own question only
 */
export async function deleteQuestion(id: string): Promise<ActionResponse> {
  try {
    const user = await getUserContext();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!canManageQuestions(user.role)) {
      return {
        success: false,
        error: "You are not allowed to delete questions",
      };
    }

    const question = await prisma.question.findFirst({
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

    if (!question) {
      return {
        success: false,
        error: "Question not found",
      };
    }

    await prisma.question.delete({
      where: {
        id,
      },
    });

    revalidatePath("/questions");

    return {
      success: true,
    };
  } catch (error) {
    console.error("DELETE_QUESTION_ERROR:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete question",
    };
  }
}
