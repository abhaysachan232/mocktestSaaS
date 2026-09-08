"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AttemptStatus, QuestionType } from "@/generated/prisma/enums";

/* =========================================================
   TYPES
========================================================= */

type ActionResult<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      message: string;
    };

type TestAttemptSession = {
  id: string;
  testId: string;
  userId: string;
  status: AttemptStatus;
  startedAt: Date;
  expiresAt: Date;
};

type AttemptAnswerData = {
  id: string;
  questionId: string;
  selectedOptionIds: string[];
  isAttempted: boolean;
  markedForReview: boolean;
};

type SubmitResult = {
  attemptId: string;
  resultId: string;
  status: AttemptStatus;

  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;

  totalMarks: number;
  positiveMarks: number;
  negativeMarks: number;
  obtainedMarks: number;

  percentage: number;
  accuracy: number;
  timeTaken: number;
};

/* =========================================================
   AUTH
========================================================= */

async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await auth();

  return session?.user?.id ?? null;
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      ),
    ),
  ];
}

function roundNumber(value: number, decimals = 2): number {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function calculateTimeTaken(
  startedAt: Date,
  endAt: Date,
): number {
  const seconds = Math.floor(
    (endAt.getTime() - startedAt.getTime()) / 1000,
  );

  return Math.max(0, seconds);
}

/**
 * PostgreSQL transaction advisory lock.
 *
 * IMPORTANT:
 * Same resource string must always produce the same lock.
 */
async function lockAttempt(
  tx: Parameters<typeof prisma.$transaction>[0] extends (
    arg: infer T,
  ) => unknown
    ? T
    : never,
  attemptId: string,
): Promise<void> {
  await tx.$executeRaw`
    SELECT pg_advisory_xact_lock(
      hashtext(${`attempt:${attemptId}`})
    );
  `;
}

async function lockStart(
  tx: Parameters<typeof prisma.$transaction>[0] extends (
    arg: infer T,
  ) => unknown
    ? T
    : never,
  userId: string,
  testId: string,
): Promise<void> {
  await tx.$executeRaw`
    SELECT pg_advisory_xact_lock(
      hashtext(${`start:${userId}:${testId}`})
    );
  `;
}

/* =========================================================
   START ATTEMPT
========================================================= */

export async function startTestAttempt(
  testId: string,
): Promise<
  ActionResult<{
    attemptId: string;
    startedAt: Date;
    expiresAt: Date;
    resumed: boolean;
  }>
> {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!testId || typeof testId !== "string") {
    return {
      success: false,
      message: "Invalid test ID",
    };
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        await lockStart(tx, userId, testId);

        const test = await tx.test.findUnique({
          where: {
            id: testId,
          },
          select: {
            id: true,
            status: true,
            duration: true,
            testQuestions: {
              select: {
                questionId: true,
              },
            },
          },
        });

        if (!test) {
          throw new Error("Test not found");
        }

        if (test.status !== "PUBLISHED") {
          throw new Error("Test is not published");
        }

        if (test.testQuestions.length === 0) {
          throw new Error("Test has no questions");
        }

        const now = new Date();

        const existingAttempt =
          await tx.testAttempt.findFirst({
            where: {
              testId,
              userId,
              status: AttemptStatus.IN_PROGRESS,
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              id: true,
              startedAt: true,
              expiresAt: true,
            },
          });

        /*
         * Resume active attempt.
         */
        if (
          existingAttempt &&
          existingAttempt.expiresAt.getTime() > now.getTime()
        ) {
          return {
            attemptId: existingAttempt.id,
            startedAt: existingAttempt.startedAt,
            expiresAt: existingAttempt.expiresAt,
            resumed: true,
          };
        }

        /*
         * Existing attempt has expired.
         */
        if (existingAttempt) {
          await tx.testAttempt.update({
            where: {
              id: existingAttempt.id,
            },
            data: {
              status: AttemptStatus.EXPIRED,
              submittedAt: existingAttempt.expiresAt,
            },
          });
        }

        const startedAt = new Date();

        const expiresAt = new Date(
          startedAt.getTime() +
            test.duration * 60 * 1000,
        );

        const attempt = await tx.testAttempt.create({
          data: {
            testId,
            userId,
            status: AttemptStatus.IN_PROGRESS,
            startedAt,
            expiresAt,

            answers: {
              create: test.testQuestions.map(
                ({ questionId }) => ({
                  questionId,
                  selectedOptionIds: [],
                  isAttempted: false,
                  isCorrect: false,
                  markedForReview: false,
                }),
              ),
            },
          },

          select: {
            id: true,
            startedAt: true,
            expiresAt: true,
          },
        });

        return {
          attemptId: attempt.id,
          startedAt: attempt.startedAt,
          expiresAt: attempt.expiresAt,
          resumed: false,
        };
      },
      {
        isolationLevel: "Serializable",
      },
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("startTestAttempt error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to start test",
    };
  }
}

/* =========================================================
   GET ATTEMPT
========================================================= */

export async function getTestAttempt(
  attemptId: string,
): Promise<ActionResult<TestAttemptSession>> {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!attemptId || typeof attemptId !== "string") {
    return {
      success: false,
      message: "Invalid attempt ID",
    };
  }

  try {
    const attempt =
      await prisma.testAttempt.findFirst({
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
          expiresAt: true,
        },
      });

    if (!attempt) {
      return {
        success: false,
        message: "Attempt not found",
      };
    }

    return {
      success: true,
      data: attempt,
    };
  } catch (error) {
    console.error("getTestAttempt error:", error);

    return {
      success: false,
      message: "Unable to load attempt",
    };
  }
}

/* =========================================================
   SAVE ANSWER
========================================================= */

export async function saveAttemptAnswer(input: {
  attemptId: string;
  questionId: string;
  selectedOptionIds: string[];
}): Promise<ActionResult<AttemptAnswerData>> {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!input || typeof input !== "object") {
    return {
      success: false,
      message: "Invalid answer payload",
    };
  }

  if (
    typeof input.attemptId !== "string" ||
    !input.attemptId
  ) {
    return {
      success: false,
      message: "Invalid attempt ID",
    };
  }

  if (
    typeof input.questionId !== "string" ||
    !input.questionId
  ) {
    return {
      success: false,
      message: "Invalid question ID",
    };
  }

  if (!Array.isArray(input.selectedOptionIds)) {
    return {
      success: false,
      message: "Invalid selected options",
    };
  }

  const selectedOptionIds = normalizeStringArray(
    input.selectedOptionIds,
  );

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        /*
         * Prevent save vs submit race.
         */
        await lockAttempt(tx, input.attemptId);

        const attempt =
          await tx.testAttempt.findFirst({
            where: {
              id: input.attemptId,
              userId,
            },
            select: {
              id: true,
              testId: true,
              status: true,
              expiresAt: true,
            },
          });

        if (!attempt) {
          throw new Error("Attempt not found");
        }

        if (
          attempt.status !==
          AttemptStatus.IN_PROGRESS
        ) {
          throw new Error(
            "Attempt is no longer active",
          );
        }

        const now = new Date();

        /*
         * Server is authoritative for expiry.
         */
        if (
          now.getTime() >=
          attempt.expiresAt.getTime()
        ) {
          await tx.testAttempt.update({
            where: {
              id: attempt.id,
            },
            data: {
              status: AttemptStatus.EXPIRED,
              submittedAt: attempt.expiresAt,
            },
          });

          throw new Error("Time expired");
        }

        /*
         * Verify question exists.
         */
        const question =
          await tx.question.findUnique({
            where: {
              id: input.questionId,
            },
            select: {
              id: true,
              type: true,
              options: {
                select: {
                  id: true,
                },
              },
            },
          });

        if (!question) {
          throw new Error("Question not found");
        }

        /*
         * Verify question belongs to this test.
         */
        const belongsToTest =
          await tx.testQuestion.findUnique({
            where: {
              testId_questionId: {
                testId: attempt.testId,
                questionId: question.id,
              },
            },
            select: {
              questionId: true,
            },
          });

        if (!belongsToTest) {
          throw new Error(
            "Question does not belong to this test",
          );
        }

        /*
         * Verify selected options belong to question.
         */
        const validOptionIds = new Set(
          question.options.map(
            (option) => option.id,
          ),
        );

        const hasInvalidOption =
          selectedOptionIds.some(
            (optionId) =>
              !validOptionIds.has(optionId),
          );

        if (hasInvalidOption) {
          throw new Error(
            "Invalid option selected",
          );
        }

        /*
         * SINGLE_CHOICE => max one option.
         */
        if (
          question.type ===
            QuestionType.SINGLE_CHOICE &&
          selectedOptionIds.length > 1
        ) {
          throw new Error(
            "Single choice question allows only one option",
          );
        }

        const isAttempted =
          selectedOptionIds.length > 0;

        const answer =
          await tx.attemptAnswer.upsert({
            where: {
              attemptId_questionId: {
                attemptId: attempt.id,
                questionId: question.id,
              },
            },

            create: {
              attemptId: attempt.id,
              questionId: question.id,
              selectedOptionIds,
              isAttempted,
              isCorrect: false,
            },

            update: {
              selectedOptionIds,
              isAttempted,

              /*
               * Final correctness is calculated
               * only during submission.
               */
              isCorrect: false,
            },

            select: {
              id: true,
              questionId: true,
              selectedOptionIds: true,
              isAttempted: true,
              markedForReview: true,
            },
          });

        return {
          ...answer,
          selectedOptionIds:
            normalizeStringArray(
              answer.selectedOptionIds,
            ),
        };
      },
      {
        isolationLevel: "Serializable",
      },
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(
      "saveAttemptAnswer error:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to save answer",
    };
  }
}

/* =========================================================
   TOGGLE MARK FOR REVIEW
========================================================= */

export async function toggleAttemptMark(input: {
  attemptId: string;
  questionId: string;
  markedForReview: boolean;
}): Promise<
  ActionResult<{
    answerId: string;
    markedForReview: boolean;
  }>
> {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!input || typeof input !== "object") {
    return {
      success: false,
      message: "Invalid payload",
    };
  }

  if (
    typeof input.attemptId !== "string" ||
    !input.attemptId
  ) {
    return {
      success: false,
      message: "Invalid attempt ID",
    };
  }

  if (
    typeof input.questionId !== "string" ||
    !input.questionId
  ) {
    return {
      success: false,
      message: "Invalid question ID",
    };
  }

  if (
    typeof input.markedForReview !== "boolean"
  ) {
    return {
      success: false,
      message: "Invalid review status",
    };
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        await lockAttempt(
          tx,
          input.attemptId,
        );

        const attempt =
          await tx.testAttempt.findFirst({
            where: {
              id: input.attemptId,
              userId,
            },
            select: {
              id: true,
              testId: true,
              status: true,
              expiresAt: true,
            },
          });

        if (!attempt) {
          throw new Error("Attempt not found");
        }

        if (
          attempt.status !==
          AttemptStatus.IN_PROGRESS
        ) {
          throw new Error(
            "Attempt is no longer active",
          );
        }

        const now = new Date();

        if (
          now.getTime() >=
          attempt.expiresAt.getTime()
        ) {
          await tx.testAttempt.update({
            where: {
              id: attempt.id,
            },
            data: {
              status: AttemptStatus.EXPIRED,
              submittedAt: attempt.expiresAt,
            },
          });

          throw new Error("Time expired");
        }

        const belongsToTest =
          await tx.testQuestion.findUnique({
            where: {
              testId_questionId: {
                testId: attempt.testId,
                questionId: input.questionId,
              },
            },
            select: {
              questionId: true,
            },
          });

        if (!belongsToTest) {
          throw new Error(
            "Question does not belong to this test",
          );
        }

        const answer =
          await tx.attemptAnswer.upsert({
            where: {
              attemptId_questionId: {
                attemptId: attempt.id,
                questionId: input.questionId,
              },
            },

            create: {
              attemptId: attempt.id,
              questionId: input.questionId,
              selectedOptionIds: [],
              isAttempted: false,
              isCorrect: false,
              markedForReview:
                input.markedForReview,
            },

            update: {
              markedForReview:
                input.markedForReview,
            },

            select: {
              id: true,
              markedForReview: true,
            },
          });

        return {
          answerId: answer.id,
          markedForReview:
            answer.markedForReview,
        };
      },
      {
        isolationLevel: "Serializable",
      },
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(
      "toggleAttemptMark error:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update review status",
    };
  }
}

/* =========================================================
   SUBMIT ATTEMPT
========================================================= */

export async function submitTestAttempt(
  attemptId: string,
): Promise<ActionResult<SubmitResult>> {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!attemptId || typeof attemptId !== "string") {
    return {
      success: false,
      message: "Invalid attempt ID",
    };
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        await lockAttempt(tx, attemptId);

        const attempt =
          await tx.testAttempt.findFirst({
            where: {
              id: attemptId,
              userId,
            },

            include: {
              test: {
                select: {
                  id: true,
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

                      question: {
                        select: {
                          id: true,
                          type: true,

                          options: {
                            select: {
                              id: true,
                              isCorrect: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },

              answers: {
                select: {
                  id: true,
                  questionId: true,
                  selectedOptionIds: true,
                  isAttempted: true,
                  isCorrect: true,
                  markedForReview: true,
                },
              },

              result: true,
            },
          });

        if (!attempt) {
          throw new Error("Attempt not found");
        }

        /*
         * IDEMPOTENCY
         */
        if (attempt.result) {
          return {
            attemptId: attempt.id,
            resultId: attempt.result.id,
            status: attempt.status,

            totalQuestions:
              attempt.result.totalQuestions,

            attempted:
              attempt.result.attempted,

            correct:
              attempt.result.correct,

            incorrect:
              attempt.result.incorrect,

            skipped:
              attempt.result.skipped,

            totalMarks:
              attempt.result.totalMarks,

            positiveMarks:
              attempt.result.positiveMarks,

            negativeMarks:
              attempt.result.negativeMarks,

            obtainedMarks:
              attempt.result.obtainedMarks,

            percentage:
              attempt.result.percentage,

            accuracy:
              attempt.result.accuracy,

            timeTaken:
              attempt.result.timeTaken,
          };
        }

        /*
         * Only IN_PROGRESS and EXPIRED can reach finalization.
         */
        if (
          attempt.status !==
            AttemptStatus.IN_PROGRESS &&
          attempt.status !==
            AttemptStatus.EXPIRED
        ) {
          throw new Error(
            "Attempt cannot be submitted",
          );
        }

        const now = new Date();

        const isExpired =
          attempt.status ===
            AttemptStatus.EXPIRED ||
          now.getTime() >=
            attempt.expiresAt.getTime();

        const effectiveEnd = isExpired
          ? attempt.expiresAt
          : now;

        const timeTaken =
          calculateTimeTaken(
            attempt.startedAt,
            effectiveEnd,
          );

        const testQuestions =
          attempt.test.testQuestions;

        const totalQuestions =
          testQuestions.length;

        const answerMap = new Map(
          attempt.answers.map((answer) => [
            answer.questionId,
            answer,
          ]),
        );

        let attempted = 0;
        let correct = 0;
        let incorrect = 0;
        let skipped = 0;

        let positiveMarks = 0;
        let negativeMarks = 0;

        const questionMarks =
          totalQuestions > 0
            ? attempt.test.totalMarks /
              totalQuestions
            : 0;

        const answerUpdates: Array<{
          id: string;
          isCorrect: boolean;
        }> = [];

        for (const testQuestion of testQuestions) {
          const answer = answerMap.get(
            testQuestion.questionId,
          );

          if (!answer) {
            skipped += 1;
            continue;
          }

          const selectedOptionIds =
            normalizeStringArray(
              answer.selectedOptionIds,
            );

          if (selectedOptionIds.length === 0) {
            skipped += 1;

            answerUpdates.push({
              id: answer.id,
              isCorrect: false,
            });

            continue;
          }

          attempted += 1;

          const correctOptionIds =
            testQuestion.question.options
              .filter(
                (option) => option.isCorrect,
              )
              .map((option) => option.id);

          const selectedSet = new Set(
            selectedOptionIds,
          );

          const correctSet = new Set(
            correctOptionIds,
          );

          const isCorrect =
            selectedSet.size ===
              correctSet.size &&
            selectedOptionIds.every(
              (id) => correctSet.has(id),
            );

          if (isCorrect) {
            correct += 1;
            positiveMarks += questionMarks;
          } else {
            incorrect += 1;

            if (
              attempt.test.negativeMarking &&
              attempt.test.negativeMarks > 0
            ) {
              negativeMarks +=
                attempt.test.negativeMarks;
            }
          }

          answerUpdates.push({
            id: answer.id,
            isCorrect,
          });
        }

        /*
         * Ensure counts always reconcile.
         */
        skipped = Math.max(
          0,
          totalQuestions - attempted,
        );

        positiveMarks =
          roundNumber(positiveMarks);

        negativeMarks =
          roundNumber(negativeMarks);

        const obtainedMarks =
          roundNumber(
            positiveMarks -
              negativeMarks,
          );

        const percentage =
          attempt.test.totalMarks > 0
            ? Math.max(
                0,
                roundNumber(
                  (obtainedMarks /
                    attempt.test.totalMarks) *
                    100,
                ),
              )
            : 0;

        const accuracy =
          attempted > 0
            ? roundNumber(
                (correct / attempted) *
                  100,
              )
            : 0;

        const finalStatus = isExpired
          ? AttemptStatus.EXPIRED
          : AttemptStatus.SUBMITTED;

        /*
         * Persist correctness.
         */
        for (const update of answerUpdates) {
          await tx.attemptAnswer.update({
            where: {
              id: update.id,
            },

            data: {
              isCorrect:
                update.isCorrect,
            },
          });
        }

        /*
         * Finalize attempt.
         */
        await tx.testAttempt.update({
          where: {
            id: attempt.id,
          },

          data: {
            status: finalStatus,
            submittedAt: effectiveEnd,
          },
        });

        /*
         * Create result exactly once.
         */
        const createdResult =
          await tx.result.upsert({
            where: {
              attemptId: attempt.id,
            },

            create: {
              attemptId: attempt.id,

              totalQuestions,
              attempted,
              correct,
              incorrect,
              skipped,

              totalMarks:
                attempt.test.totalMarks,

              positiveMarks,
              negativeMarks,
              obtainedMarks,

              percentage,
              accuracy,
              timeTaken,
            },

            update: {
              totalQuestions,
              attempted,
              correct,
              incorrect,
              skipped,

              totalMarks:
                attempt.test.totalMarks,

              positiveMarks,
              negativeMarks,
              obtainedMarks,

              percentage,
              accuracy,
              timeTaken,
            },
          });

        return {
          attemptId: attempt.id,
          resultId: createdResult.id,
          status: finalStatus,

          totalQuestions,
          attempted,
          correct,
          incorrect,
          skipped,

          totalMarks:
            attempt.test.totalMarks,

          positiveMarks,
          negativeMarks,
          obtainedMarks,

          percentage,
          accuracy,
          timeTaken,
        };
      },

      {
        isolationLevel: "Serializable",
      },
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(
      "submitTestAttempt error:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to submit test",
    };
  }
}

/* =========================================================
   GET ATTEMPT ANSWERS
========================================================= */

export async function getAttemptAnswers(
  attemptId: string,
): Promise<ActionResult<AttemptAnswerData[]>> {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!attemptId || typeof attemptId !== "string") {
    return {
      success: false,
      message: "Invalid attempt ID",
    };
  }

  try {
    const attempt =
      await prisma.testAttempt.findFirst({
        where: {
          id: attemptId,
          userId,
        },

        select: {
          id: true,
        },
      });

    if (!attempt) {
      return {
        success: false,
        message: "Attempt not found",
      };
    }

    const answers =
      await prisma.attemptAnswer.findMany({
        where: {
          attemptId: attempt.id,
        },

        orderBy: {
          createdAt: "asc",
        },

        select: {
          id: true,
          questionId: true,
          selectedOptionIds: true,
          isAttempted: true,
          markedForReview: true,
        },
      });

    /*
     * Always return normalized arrays.
     */
    const normalizedAnswers =
      answers.map((answer) => ({
        ...answer,

        selectedOptionIds:
          normalizeStringArray(
            answer.selectedOptionIds,
          ),
      }));

    return {
      success: true,
      data: normalizedAnswers,
    };
  } catch (error) {
    console.error(
      "getAttemptAnswers error:",
      error,
    );

    return {
      success: false,
      message:
        "Unable to load attempt answers",
    };
  }
}
