"use server";

import { prisma } from "@/lib/prisma";
import { AttemptStatus } from "@/generated/prisma/enums";

export async function getTestResult(attemptId: string, userId: string) {
  try {
    if (!attemptId) {
      return {
        success: false,
        error: "Attempt ID is required.",
      };
    }

    if (!userId) {
      return {
        success: false,
        error: "User ID is required.",
      };
    }

    const attempt = await prisma.testAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
      },

      include: {
        test: {
          select: {
            id: true,
            name: true,
            description: true,
            totalQuestions: true,
            totalMarks: true,
            duration: true,
            negativeMarking: true,
            negativeMarks: true,
          },
        },

        result: true,

        answers: {
          orderBy: {
            question: {
              id: "asc",
            },
          },

          include: {
            question: {
              select: {
                id: true,
                type: true,
                content: true,

                options: {
                  select: {
                    id: true,
                    content: true,
                    isCorrect: true,
                  },
                },

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

    if (!attempt) {
      return {
        success: false,
        error: "Test attempt not found.",
      };
    }

    if (!attempt.result) {
      return {
        success: false,
        error: "Result is not available yet.",
      };
    }

    if (
      attempt.status !== AttemptStatus.SUBMITTED &&
      attempt.status !== AttemptStatus.EXPIRED
    ) {
      return {
        success: false,
        error: "This test has not been submitted yet.",
      };
    }

    /*
     * --------------------------------------------------
     * QUESTION ANALYSIS
     * --------------------------------------------------
     */

    const questionAnalysis = attempt.answers.map((answer) => {
      const question = answer.question;

      const selectedOptionIds = answer.selectedOptionIds ?? [];

      const selectedOptions = question.options.filter((option) =>
        selectedOptionIds.includes(option.id),
      );

      const correctOptions = question.options.filter(
        (option) => option.isCorrect,
      );

      return {
        questionId: question.id,

        type: question.type,

        content: question.content,
        options: question.options,
        subject: question.subject,

        topic: question.topic,

        selectedOptionIds,

        selectedOptions,

        correctOptions,

        isAttempted: answer.isAttempted,

        isCorrect: answer.isCorrect,
      };
    });

    return {
      success: true,

      data: {
        attempt: {
          id: attempt.id,
          status: attempt.status,
          startedAt: attempt.startedAt,
          submittedAt: attempt.submittedAt,
        },

        test: attempt.test,

        result: attempt.result,

        questionAnalysis,
      },
    };
  } catch (error) {
    console.error("GET_TEST_RESULT_ERROR:", error);

    return {
      success: false,
      error: "Unable to load test result.",
    };
  }
}
