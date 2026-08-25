"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuestionFormValues, questionSchema } from "@/schemas/question";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await auth();
  return session?.user?.id;
}

export async function getQuestionSubjects() {
  const userId = await getUserId();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
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
}



export async function createQuestion(payload: QuestionFormValues) {
  console.log(
    "========== CREATE QUESTION ACTION ==========",
  );

  console.log(
    "createQuestion received:",
    JSON.stringify(payload, null, 2),
  );
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
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

    const data = payload;

    const { subjectId, topicId, type, content, options } = data;
    console.log("Parsed question:", subjectId, topicId, type, content, options);

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        subjectId,
      },
    });

    if (!topic) {
      return {
        success: false,
        error: "Topic does not belong to selected subject",
      };
    }

    // Convert Tiptap JSON into plain JSON
    const plainContent = JSON.parse(JSON.stringify(content));

    console.log("plainContent", plainContent);

    const plainOptions = options.map((option) => ({
      content: JSON.parse(JSON.stringify(option.content)),
      isCorrect: option.isCorrect,
    }));

    const question = await prisma.question.create({
      data: {
        userId,
        subjectId,
        topicId,
        type,
        content: plainContent,
        options: {
          create: plainOptions,
        },
      },
    });

    revalidatePath("/questions");

    return {
      success: true,
      data: question,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to create question",
    };
  }
}

export async function getQuestions() {
  const userId = await getUserId();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
      data: [],
    };
  }

  const questions = await prisma.question.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      subject: true,
      topic: true,
      options: true,
    },
  });

  return {
    success: true,
    data: questions,
  };
}

export async function getQuestionById(id: string) {
  const userId = await getUserId();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
      data: null,
    };
  }

  const question = await prisma.question.findFirst({
    where: {
      id,
      userId,
    },

    include: {
      subject: true,
      topic: true,

      options: {
        orderBy: {
          id: "asc",
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
}

export async function updateQuestion(id: string, input: QuestionInput) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const parsed = questionSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid question",
      };
    }

    const existing = await prisma.question.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return {
        success: false,
        error: "Question not found",
      };
    }

    const { subjectId, topicId, type, content, options } = parsed.data;

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        subjectId,
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
          options: {
            create: options.map((option) => ({
              content: option.content,

              isCorrect: option.isCorrect,
            })),
          },
        },

        include: {
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
    console.error(error);

    return {
      success: false,
      error: "Failed to update question",
    };
  }
}

export async function deleteQuestion(id: string) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const question = await prisma.question.findFirst({
      where: {
        id,
        userId,
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

    await prisma.$transaction(async (tx) => {
      // Delete options first
      await tx.questionOption.deleteMany({
        where: {
          questionId: id,
        },
      });

      // Then delete question
      await tx.question.delete({
        where: {
          id,
        },
      });
    });

    revalidatePath("/questions");

    return {
      success: true,
    };
  } catch (error) {
    console.error("deleteQuestion error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete question",
    };
  }
}
