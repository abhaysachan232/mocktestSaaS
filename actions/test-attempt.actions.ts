"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AttemptStatus } from "@/generated/prisma/enums";

type StartTestAttemptResult =
  | {
      success: true;
      attemptId: string;
    }
  | {
      success: false;
      error: string;
    };

export async function getTestAttempt(attemptId: string) {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      return null;
    }

    const attempt = await prisma.testAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
      },
      select: {
        id: true,
        testId: true,
        userId: true,
        status: true,
        startedAt: true,
        submittedAt: true,
      },
    });

    return attempt;
  } catch (error) {
    console.error("GET_TEST_ATTEMPT_ERROR:", error);
    return null;
  }
}

export async function startTestAttempt(
  userId: string,
  testId: string,
): Promise<StartTestAttemptResult> {
  try {
    // ----------------------------------------
    // 1. Validate testId
    // ----------------------------------------

    if (!testId) {
      return {
        success: false,
        error: "Test ID is required",
      };
    }

    // ----------------------------------------
    // 2. Get logged-in user
    // ----------------------------------------

    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // ----------------------------------------
    // 3. Verify user
    // ----------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: "Your account is inactive",
      };
    }

    // if (user.role !== "STUDENT") {
    //   return {
    //     success: false,
    //     error: "Only students can start a test",
    //   };
    // }

    // ----------------------------------------
    // 4. Get test
    // ----------------------------------------

    const test = await prisma.test.findUnique({
      where: {
        id: testId,
      },
      select: {
        id: true,
        name: true,
        status: true,
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
            questionId: true,
            order: true,
          },
        },
      },
    });

    // ----------------------------------------
    // 5. Test existence
    // ----------------------------------------

    if (!test) {
      return {
        success: false,
        error: "Test not found",
      };
    }

    // ----------------------------------------
    // 6. Test must be published
    // ----------------------------------------

    if (test.status !== "PUBLISHED") {
      return {
        success: false,
        error: "This test is not available",
      };
    }

    // ----------------------------------------
    // 7. Test must contain questions
    // ----------------------------------------

    if (test.testQuestions.length === 0) {
      return {
        success: false,
        error: "This test does not contain any questions",
      };
    }

    // ----------------------------------------
    // 8. Check existing active attempt
    // ----------------------------------------

    const existingAttempt = await prisma.testAttempt.findFirst({
      where: {
        testId,
        userId,
        status: "IN_PROGRESS",
      },

      orderBy: {
        startedAt: "desc",
      },

      select: {
        id: true,
      },
    });

    // ----------------------------------------
    // 9. Resume existing attempt
    // ----------------------------------------

    if (existingAttempt) {
      return {
        success: true,
        attemptId: existingAttempt.id,
      };
    }

    // ----------------------------------------
    // 10. Create new attempt
    // ----------------------------------------

    const attempt = await prisma.$transaction(async (tx) => {
      // Create attempt
      const newAttempt = await tx.testAttempt.create({
        data: {
          testId,
          userId,
          status: "IN_PROGRESS",
        },

        select: {
          id: true,
        },
      });

      // Create blank answer records
      await tx.attemptAnswer.createMany({
        data: test.testQuestions.map((testQuestion) => ({
          attemptId: newAttempt.id,

          questionId: testQuestion.questionId,

          selectedOptionIds: [],

          isCorrect: false,
        })),
      });

      return newAttempt;
    });

    // ----------------------------------------
    // 11. Return attempt ID
    // ----------------------------------------

    return {
      success: true,
      attemptId: attempt.id,
    };
  } catch (error) {
    console.error("START_TEST_ATTEMPT_ERROR:", error);

    return {
      success: false,
      error: "Unable to start test",
    };
  }
}

type SaveAttemptAnswerResult =
  | {
      success: true;
      answer: {
        id: string;
        attemptId: string;
        questionId: string;
        selectedOptionIds: string[];
      };
    }
  | {
      success: false;
      error: string;
    };

export async function saveAttemptAnswer(
  attemptId: string,
  questionId: string,
  selectedOptionIds: string[],
): Promise<SaveAttemptAnswerResult> {
  try {
    // ----------------------------------------
    // 1. Validate input
    // ----------------------------------------

    if (!attemptId) {
      return {
        success: false,
        error: "Attempt ID is required",
      };
    }

    if (!questionId) {
      return {
        success: false,
        error: "Question ID is required",
      };
    }

    if (!Array.isArray(selectedOptionIds)) {
      return {
        success: false,
        error: "Selected options must be an array",
      };
    }

    // ----------------------------------------
    // 2. Authentication
    // ----------------------------------------

    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // ----------------------------------------
    // 3. Get attempt
    // ----------------------------------------

    const attempt = await prisma.testAttempt.findUnique({
      where: {
        id: attemptId,
      },

      select: {
        id: true,
        userId: true,
        testId: true,
        status: true,
      },
    });

    if (!attempt) {
      return {
        success: false,
        error: "Attempt not found",
      };
    }

    // ----------------------------------------
    // 4. Ownership check
    // ----------------------------------------

    if (attempt.userId !== userId) {
      return {
        success: false,
        error: "You are not allowed to modify this attempt",
      };
    }

    // ----------------------------------------
    // 5. Attempt must be active
    // ----------------------------------------

    if (attempt.status !== "IN_PROGRESS") {
      return {
        success: false,
        error: "This attempt is no longer active",
      };
    }

    // ----------------------------------------
    // 6. Verify question belongs to test
    // ----------------------------------------

    const testQuestion = await prisma.testQuestion.findUnique({
      where: {
        testId_questionId: {
          testId: attempt.testId,
          questionId,
        },
      },

      select: {
        questionId: true,
      },
    });

    if (!testQuestion) {
      return {
        success: false,
        error: "Question does not belong to this test",
      };
    }

    // ----------------------------------------
    // 7. Remove duplicate option IDs
    // ----------------------------------------

    const uniqueOptionIds = [...new Set(selectedOptionIds)];

    // ----------------------------------------
    // 8. Empty array = clear answer
    // ----------------------------------------

    if (uniqueOptionIds.length === 0) {
      const answer = await prisma.attemptAnswer.update({
        where: {
          attemptId_questionId: {
            attemptId,
            questionId,
          },
        },

        data: {
          selectedOptionIds: [],
          isCorrect: false,
        },

        select: {
          id: true,
          attemptId: true,
          questionId: true,
          selectedOptionIds: true,
        },
      });

      return {
        success: true,
        answer,
      };
    }

    // ----------------------------------------
    // 9. Verify options belong to question
    // ----------------------------------------

    const validOptions = await prisma.questionOption.findMany({
      where: {
        questionId,

        id: {
          in: uniqueOptionIds,
        },
      },

      select: {
        id: true,
      },
    });

    const validOptionIds = new Set(validOptions.map((option) => option.id));

    // ----------------------------------------
    // 10. Detect invalid option IDs
    // ----------------------------------------

    const invalidOptionIds = uniqueOptionIds.filter(
      (optionId) => !validOptionIds.has(optionId),
    );

    if (invalidOptionIds.length > 0) {
      return {
        success: false,
        error: "One or more selected options are invalid",
      };
    }

    // ----------------------------------------
    // 11. Validate question type
    // ----------------------------------------

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },

      select: {
        type: true,
      },
    });

    if (!question) {
      return {
        success: false,
        error: "Question not found",
      };
    }

    // ----------------------------------------
    // 12. SINGLE_CHOICE validation
    // ----------------------------------------

    if (question.type === "SINGLE_CHOICE" && uniqueOptionIds.length > 1) {
      return {
        success: false,
        error: "Only one option can be selected for this question",
      };
    }

    // ----------------------------------------
    // 13. Save answer
    // ----------------------------------------

    const answer = await prisma.attemptAnswer.update({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },

      data: {
        selectedOptionIds: uniqueOptionIds,

        // Evaluation happens during submit
        isCorrect: false,
      },

      select: {
        id: true,
        attemptId: true,
        questionId: true,
        selectedOptionIds: true,
      },
    });

    return {
      success: true,
      answer,
    };
  } catch (error) {
    console.error("SAVE_ATTEMPT_ANSWER_ERROR:", error);

    return {
      success: false,
      error: "Unable to save answer",
    };
  }
}

interface SubmitTestAttemptInput {
  testId: string;
  attemptId: string;
  answers: Record<string, string[]>;
  timeRemaining: number;
}

interface SubmitTestAttemptInput {
  attemptId: string;
}

export async function submitTestAttempt({ attemptId }: SubmitTestAttemptInput) {
  console.log('submitTestAttempt', attemptId)
  try {
    const attempt = await prisma.testAttempt.findUnique({
      where: {
        id: attemptId,
      },
      include: {
        test: {
          include: {
            testQuestions: {
              orderBy: {
                order: "asc",
              },
              include: {
                question: {
                  include: {
                    options: true,
                  },
                },
              },
            },
          },
        },
        answers: true,
      },
    });

    if (!attempt) {
      return {
        success: false,
        error: "Test attempt not found.",
      };
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      return {
        success: false,
        error: "This test attempt is already completed.",
      };
    }

    const { test, answers } = attempt;

    /*
     * --------------------------------------------------
     * MARKS PER QUESTION
     * --------------------------------------------------
     */

    const totalQuestions = test.totalQuestions;

    const marksPerQuestion =
      totalQuestions > 0 ? test.totalMarks / totalQuestions : 0;

    /*
     * --------------------------------------------------
     * CALCULATE ANSWERS
     * --------------------------------------------------
     */

    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    /*
     * --------------------------------------------------
     * UPDATE AttemptAnswer
     * --------------------------------------------------
     */

    for (const testQuestion of test.testQuestions) {
      const question = testQuestion.question;

      const answer = answers.find((item) => item.questionId === question.id);

      /*
       * No answer record
       */

      if (!answer) {
        skipped++;
        continue;
      }

      const selectedIds = answer.selectedOptionIds ?? [];

      /*
       * Empty selection
       */

      if (selectedIds.length === 0) {
        await prisma.attemptAnswer.update({
          where: {
            id: answer.id,
          },
          data: {
            isAttempted: false,
            isCorrect: false,
          },
        });

        skipped++;

        continue;
      }

      attempted++;

      /*
       * ------------------------------------------------
       * CORRECT OPTION IDS
       * ------------------------------------------------
       */

      const correctIds = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.id);

      /*
       * Sort before comparison
       */

      const selectedSorted = [...selectedIds].sort();

      const correctSorted = [...correctIds].sort();

      const isCorrect =
        selectedSorted.length === correctSorted.length &&
        selectedSorted.every((id, index) => id === correctSorted[index]);

      /*
       * ------------------------------------------------
       * UPDATE ANSWER
       * ------------------------------------------------
       */

      await prisma.attemptAnswer.update({
        where: {
          id: answer.id,
        },
        data: {
          isAttempted: true,
          isCorrect,
        },
      });

      if (isCorrect) {
        correct++;
      } else {
        incorrect++;
      }
    }

    /*
     * --------------------------------------------------
     * MARKS
     * --------------------------------------------------
     */

    const positiveMarks = correct * marksPerQuestion;

    const negativeMarks = test.negativeMarking
      ? incorrect * (test.negativeMarks ?? 0)
      : 0;

    const marksObtained = positiveMarks - negativeMarks;

    const skippedQuestions = totalQuestions - attempted;

    /*
     * --------------------------------------------------
     * PERCENTAGE
     * --------------------------------------------------
     */

    const percentage =
      test.totalMarks > 0 ? (marksObtained / test.totalMarks) * 100 : 0;

    /*
     * --------------------------------------------------
     * ACCURACY
     * --------------------------------------------------
     */

    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

    /*
     * --------------------------------------------------
     * TIME TAKEN
     * --------------------------------------------------
     */

    const now = new Date();

    const timeTaken = Math.floor(
      (now.getTime() - attempt.startedAt.getTime()) / 1000,
    );

    /*
     * --------------------------------------------------
     * CREATE RESULT + SUBMIT ATTEMPT
     * --------------------------------------------------
     */

    const result = await prisma.$transaction(async (tx) => {
      await tx.testAttempt.update({
        where: {
          id: attempt.id,
        },
        data: {
          status: AttemptStatus.SUBMITTED,
          submittedAt: now,
        },
      });

      return tx.result.create({
        data: {
          attemptId: attempt.id,

          totalQuestions,

          attempted,

          correct,

          incorrect,

          skipped: skippedQuestions,

          totalMarks: test.totalMarks,

          marksObtained,

          positiveMarks,

          negativeMarks,

          percentage,

          accuracy,

          timeTaken,
        },
      });
    });

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("SUBMIT_TEST_ATTEMPT_ERROR:", error);

    return {
      success: false,
      error: "Unable to submit test.",
    };
  }
}
