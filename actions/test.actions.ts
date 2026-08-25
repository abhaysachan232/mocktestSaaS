"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { testSchema, type TestFormValues } from "@/schemas/test";

type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export async function getTests() {
  return prisma.test.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      exam: {
        select: {
          id: true,
          name: true,
        },
      },

      _count: {
        select: {
          testQuestions: true,
        },
      },
    },
  });
}

export async function getTestById(id: string) {
  return prisma.test.findUnique({
    where: {
      id,
    },

    include: {
      exam: {
        select: {
          id: true,
          name: true,
        },
      },

      testQuestions: {
        orderBy: {
          order: "asc",
        },

        select: {
          questionId: true,
          order: true,
        },
      },
    },
  });
}

export async function getTestExams() {
  return prisma.exam.findMany({
    orderBy: {
      name: "asc",
    },

    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

export async function getQuestionsForTest(examId: string) {
  const exam = await prisma.exam.findUnique({
    where: {
      id: examId,
    },

    select: {
      id: true,

      examTopics: {
        select: {
          topicId: true,
        },
      },
    },
  });

  if (!exam) {
    return [];
  }

  const topicIds = exam.examTopics.map((item) => item.topicId);
  if (topicIds.length === 0) {
    return [];
  }

  return prisma.question.findMany({
    where: {
      topicId: {
        in: topicIds,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      type: true,
      content: true,

      subject: {
        select: {
          id: true,
          name: true,
        },
      },

      topic: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

async function validateTestQuestions(examId: string, questionIds: string[]) {
  const exam = await prisma.exam.findUnique({
    where: {
      id: examId,
    },

    select: {
      id: true,

      examTopics: {
        select: {
          topicId: true,
        },
      },
    },
  });

  if (!exam) {
    return {
      valid: false,
      message: "Selected exam not found",
    };
  }

  const topicIds = new Set(exam.examTopics.map((item) => item.topicId));
  const questions = await prisma.question.findMany({
    where: {
      id: {
        in: questionIds,
      },
    },

    select: {
      id: true,
      topicId: true,
    },
  });

  if (questions.length !== questionIds.length) {
    return {
      valid: false,
      message: "One or more selected questions are invalid",
    };
  }

  const invalidQuestion = questions.some(
    (question) => !topicIds.has(question.topicId),
  );

  if (invalidQuestion) {
    return {
      valid: false,
      message: "Selected question does not belong to the selected exam",
    };
  }

  return {
    valid: true,
    message: "",
  };
}

export async function createTest(
  values: TestFormValues,
): Promise<ActionResponse> {
  const parsed = testSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid test data",
    };
  }

  const data = parsed.data;

  try {
    const existing = await prisma.test.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existing) {
      return {
        success: false,
        message: "A test with this slug already exists",
      };
    }

    const questionValidation = await validateTestQuestions(
      data.examId,
      data.questionIds,
    );

    if (!questionValidation.valid) {
      return {
        success: false,
        message: questionValidation.message,
      };
    }

    const test = await prisma.$transaction(async (tx) => {
      const created = await tx.test.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          testType: data.testType,
          examId: data.examId,
          duration: data.duration,
          totalMarks: data.totalMarks,
          totalQuestions: data.totalQuestions,
          negativeMarking: data.negativeMarking,
          negativeMarks: data.negativeMarking ? data.negativeMarks : null,
          status: "DRAFT",
        },
      });

      await tx.testQuestion.createMany({
        data: data.questionIds.map((questionId, index) => ({
          testId: created.id,
          questionId,
          order: index + 1,
        })),
      });

      return created;
    });

    revalidatePath("/tests");

    return {
      success: true,
      message: "Test created successfully",
      data: test,
    };
  } catch (error) {
    console.error("CREATE_TEST_ERROR", error);

    return {
      success: false,
      message: "Failed to create test",
    };
  }
}

export async function updateTest(
  id: string,
  values: TestFormValues,
): Promise<ActionResponse> {
  const parsed = testSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid test data",
    };
  }

  const data = parsed.data;

  try {
    const existing = await prisma.test.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        status: true,
      },
    });

    if (!existing) {
      return {
        success: false,
        message: "Test not found",
      };
    }

    if (existing.status === "PUBLISHED") {
      return {
        success: false,
        message: "Unpublish the test before editing",
      };
    }

    const duplicate = await prisma.test.findFirst({
      where: {
        slug: data.slug,

        NOT: {
          id,
        },
      },
    });

    if (duplicate) {
      return {
        success: false,
        message: "Another test already uses this slug",
      };
    }

    const questionValidation = await validateTestQuestions(
      data.examId,
      data.questionIds,
    );

    if (!questionValidation.valid) {
      return {
        success: false,
        message: questionValidation.message,
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.test.update({
        where: {
          id,
        },

        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          testType: data.testType,
          examId: data.examId,
          duration: data.duration,
          totalMarks: data.totalMarks,
          totalQuestions: data.totalQuestions,
          negativeMarking: data.negativeMarking,
          negativeMarks: data.negativeMarking ? data.negativeMarks : null,
        },
      });

      await tx.testQuestion.deleteMany({
        where: {
          testId: id,
        },
      });

      await tx.testQuestion.createMany({
        data: data.questionIds.map((questionId, index) => ({
          testId: id,
          questionId,
          order: index + 1,
        })),
      });
    });

    revalidatePath("/tests");
    revalidatePath(`/tests/${id}/edit`);

    return {
      success: true,
      message: "Test updated successfully",
    };
  } catch (error) {
    console.error("UPDATE_TEST_ERROR", error);

    return {
      success: false,
      message: "Failed to update test",
    };
  }
}

export async function deleteTest(id: string): Promise<ActionResponse> {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        status: true,
      },
    });

    if (!test) {
      return {
        success: false,
        message: "Test not found",
      };
    }

    if (test.status === "PUBLISHED") {
      return {
        success: false,
        message: "Unpublish the test before deleting",
      };
    }

    await prisma.test.delete({
      where: {
        id,
      },
    });

    revalidatePath("/tests");

    return {
      success: true,
      message: "Test deleted successfully",
    };
  } catch (error) {
    console.error("DELETE_TEST_ERROR", error);

    return {
      success: false,
      message: "Failed to delete test",
    };
  }
}

export async function publishTest(id: string): Promise<ActionResponse> {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id,
      },

      include: {
        testQuestions: {
          select: {
            questionId: true,
          },
        },
      },
    });

    if (!test) {
      return {
        success: false,
        message: "Test not found",
      };
    }

    if (test.status === "PUBLISHED") {
      return {
        success: false,
        message: "Test is already published",
      };
    }

    if (test.status === "ARCHIVED") {
      return {
        success: false,
        message: "Archived test cannot be published",
      };
    }

    if (test.testQuestions.length === 0) {
      return {
        success: false,
        message: "Test must contain at least one question",
      };
    }

    if (test.totalQuestions !== test.testQuestions.length) {
      return {
        success: false,
        message: "Total questions do not match selected questions",
      };
    }

    await prisma.test.update({
      where: {
        id,
      },

      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    revalidatePath("/tests");
    revalidatePath("/student/tests");

    return {
      success: true,
      message: "Test published successfully",
    };
  } catch (error) {
    console.error("PUBLISH_TEST_ERROR", error);

    return {
      success: false,
      message: "Failed to publish test",
    };
  }
}

export async function unpublishTest(id: string): Promise<ActionResponse> {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        status: true,
      },
    });

    if (!test) {
      return {
        success: false,
        message: "Test not found",
      };
    }

    if (test.status !== "PUBLISHED") {
      return {
        success: false,
        message: "Test is not published",
      };
    }

    await prisma.test.update({
      where: {
        id,
      },

      data: {
        status: "DRAFT",
        publishedAt: null,
      },
    });

    revalidatePath("/tests");
    revalidatePath("/student/tests");

    return {
      success: true,
      message: "Test unpublished successfully",
    };
  } catch (error) {
    console.error("UNPUBLISH_TEST_ERROR", error);

    return {
      success: false,
      message: "Failed to unpublish test",
    };
  }
}

export async function archiveTest(id: string): Promise<ActionResponse> {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id,
      },
    });

    if (!test) {
      return {
        success: false,
        message: "Test not found",
      };
    }

    await prisma.test.update({
      where: {
        id,
      },

      data: {
        status: "ARCHIVED",
      },
    });

    revalidatePath("/tests");
    revalidatePath("/student/tests");

    return {
      success: true,
      message: "Test archived successfully",
    };
  } catch (error) {
    console.error("ARCHIVE_TEST_ERROR", error);

    return {
      success: false,
      message: "Failed to archive test",
    };
  }
}

export async function getPublishedTests() {
  return prisma.test.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      testType: true,
      duration: true,
      totalMarks: true,
      totalQuestions: true,
      negativeMarking: true,
      negativeMarks: true,
      publishedAt: true,
      exam: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getTestForEngine(id: string) {
  return prisma.test.findUnique({
    where: {
      id,
      status: "PUBLISHED",
    },

    select: {
      id: true,
      name: true,
      description: true,
      duration: true,
      totalMarks: true,
      totalQuestions: true,
      negativeMarking: true,
      negativeMarks: true,

      testQuestions: {
        orderBy: {
          order: "asc",
        },

        select: {
          order: true,

          question: {
            select: {
              id: true,
              type: true,
              content: true,
              options: true, // agar Question model me options field hai

              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },

              topic: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
