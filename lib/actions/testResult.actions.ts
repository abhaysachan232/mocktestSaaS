"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // adjust to your prisma client singleton path
import { auth } from "@/lib/auth";
import { calculateResult } from "@/lib/scoring";

// ---------------------------------------------------------------------------
// Auth: replace this with your real session lookup (next-auth, lucia, etc).
// Every action below trusts this for ownership checks — do not skip it.
// ---------------------------------------------------------------------------
async function getCurrentUserId(): Promise<string> {
  // Example with next-auth:
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user.id;
  throw new Error(
    "getCurrentUserId() is a placeholder — wire it to your auth setup",
  );
}

// ---------------------------------------------------------------------------
// 1. Start (or resume) a test attempt
// ---------------------------------------------------------------------------
export async function startTestAttempt(testId: string) {
  const userId = await getCurrentUserId();

  const test = await prisma.test.findUniqueOrThrow({
    where: { id: testId },
  });

  if (test.status !== "PUBLISHED") {
    throw new Error("This test is not available right now.");
  }

  // Resume an existing in-progress attempt instead of creating a duplicate.
  const existing = await prisma.testAttempt.findFirst({
    where: { testId, userId, status: "IN_PROGRESS" },
  });

  if (existing) {
    if (existing.expiresAt > new Date()) {
      redirect(`/test/attempt/${existing.id}`);
    }
    // Expired but never finalized — close it out before starting fresh.
    await finalizeExpiredAttempt(existing.id);
  }

  const attempt = await prisma.testAttempt.create({
    data: {
      testId,
      userId,
      expiresAt: new Date(Date.now() + test.duration * 60 * 1000),
    },
  });

  redirect(`/test/attempt/${attempt.id}`);
}

// ---------------------------------------------------------------------------
// 2. Load everything the test-taking page needs
// ---------------------------------------------------------------------------
export async function getTestAttemptData(attemptId: string) {
  const userId = await getCurrentUserId();

  const attempt = await prisma.testAttempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: {
      test: true,
      answers: true,
    },
  });

  if (attempt.userId !== userId) {
    throw new Error("Not your attempt.");
  }

  if (attempt.status !== "IN_PROGRESS") {
    return { attempt, questions: [], expired: true as const };
  }

  if (attempt.expiresAt <= new Date()) {
    await finalizeExpiredAttempt(attempt.id);
    return { attempt, questions: [], expired: true as const };
  }

  const testQuestions = await prisma.testQuestion.findMany({
    where: { testId: attempt.testId },
    orderBy: { order: "asc" },
    include: {
      question: {
        include: {
          // Never send isCorrect to the client while the attempt is live.
          options: { select: { id: true, content: true } },
        },
      },
    },
  });

  const questions = testQuestions.map((tq) => ({
    order: tq.order,
    id: tq.question.id,
    type: tq.question.type,
    content: tq.question.content,
    options: tq.question.options,
  }));

  return { attempt, questions, expired: false as const };
}

// ---------------------------------------------------------------------------
// 3. Save a single answer (called on every option click / mark for review)
// ---------------------------------------------------------------------------
export async function saveAnswer(input: {
  attemptId: string;
  questionId: string;
  selectedOptionIds: string[];
  markedForReview?: boolean;
}) {
  const userId = await getCurrentUserId();

  const attempt = await prisma.testAttempt.findUniqueOrThrow({
    where: { id: input.attemptId },
    select: { userId: true, status: true, expiresAt: true },
  });

  if (attempt.userId !== userId) throw new Error("Not your attempt.");
  if (attempt.status !== "IN_PROGRESS") throw new Error("Attempt is closed.");
  if (attempt.expiresAt <= new Date()) throw new Error("Time is up.");

  await prisma.attemptAnswer.upsert({
    where: {
      attemptId_questionId: {
        attemptId: input.attemptId,
        questionId: input.questionId,
      },
    },
    create: {
      attemptId: input.attemptId,
      questionId: input.questionId,
      selectedOptionIds: input.selectedOptionIds,
      isAttempted: input.selectedOptionIds.length > 0,
      markedForReview: input.markedForReview ?? false,
    },
    update: {
      selectedOptionIds: input.selectedOptionIds,
      isAttempted: input.selectedOptionIds.length > 0,
      markedForReview: input.markedForReview ?? false,
    },
  });

  return { ok: true };
}

// ---------------------------------------------------------------------------
// 4. Submit (manual or auto on timeout)
// ---------------------------------------------------------------------------
export async function submitTestAttempt(attemptId: string) {
  const userId = await getCurrentUserId();

  const attempt = await prisma.testAttempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: { test: true, answers: true },
  });

  if (attempt.userId !== userId) throw new Error("Not your attempt.");
  if (attempt.status !== "IN_PROGRESS") {
    // Already submitted/expired — just return the existing result.
    const result = await prisma.result.findUnique({ where: { attemptId } });
    return { attemptId, result };
  }

  const testQuestions = await prisma.testQuestion.findMany({
    where: { testId: attempt.testId },
    include: { question: { include: { options: true } } },
  });

  const questionsForScoring = testQuestions.map((tq) => ({
    id: tq.question.id,
    correctOptionIds: tq.question.options
      .filter((o) => o.isCorrect)
      .map((o) => o.id),
  }));

  const scored = calculateResult(
    attempt.test,
    questionsForScoring,
    attempt.answers,
  );

  await prisma.$transaction([
    ...scored.perQuestion.map((pq) =>
      prisma.attemptAnswer.updateMany({
        where: { attemptId, questionId: pq.questionId },
        data: { isCorrect: pq.isCorrect },
      }),
    ),
    prisma.testAttempt.update({
      where: { id: attemptId },
      data: { status: "SUBMITTED", submittedAt: new Date() },
    }),
    prisma.result.create({
      data: {
        attemptId,
        score: scored.score,
        totalMarks: scored.totalMarks,
        correctCount: scored.correctCount,
        wrongCount: scored.wrongCount,
        unattemptedCount: scored.unattemptedCount,
        accuracy: scored.accuracy,
      },
    }),
  ]);

  revalidatePath(`/test/attempt/${attemptId}`);
  redirect(`/dashboard?tab=results&attemptId=${attemptId}`);
}

// ---------------------------------------------------------------------------
// 5. Result + question-wise review data (used by the result page)
// ---------------------------------------------------------------------------
export type ResultReviewQuestion = {
  id: string;
  order: number;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
  content: unknown;
  solution: unknown;
  options: { id: string; content: unknown; isCorrect: boolean }[];
  studentAnswer: {
    selectedOptionIds: string[];
    isAttempted: boolean;
    isCorrect: boolean;
    markedForReview: boolean;
  };
};

export async function getTestResult(attemptId: string) {
  const userId = await getCurrentUserId();

  const attempt = await prisma.testAttempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: { test: true, answers: true, result: true },
  });

  if (attempt.userId !== userId) {
    throw new Error("Not your attempt.");
  }

  if (attempt.status === "IN_PROGRESS") {
    // Not finished yet — caller should redirect back to the test page.
    return { attempt, result: null, questions: [] as ResultReviewQuestion[], inProgress: true as const };
  }

  const testQuestions = await prisma.testQuestion.findMany({
    where: { testId: attempt.testId },
    orderBy: { order: "asc" },
    include: { question: { include: { options: true } } },
  });

  const answerByQuestion = new Map(attempt.answers.map((a) => [a.questionId, a]));

  const questions: ResultReviewQuestion[] = testQuestions.map((tq) => {
    const answer = answerByQuestion.get(tq.question.id);

    return {
      id: tq.question.id,
      order: tq.order,
      type: tq.question.type,
      content: tq.question.content,
      solution: tq.question.solution,
      options: tq.question.options.map((o) => ({
        id: o.id,
        content: o.content,
        isCorrect: o.isCorrect,
      })),
      studentAnswer: {
        selectedOptionIds: answer?.selectedOptionIds ?? [],
        isAttempted: answer?.isAttempted ?? false,
        isCorrect: answer?.isCorrect ?? false,
        markedForReview: answer?.markedForReview ?? false,
      },
    };
  });

  return { attempt, result: attempt.result, questions, inProgress: false as const };
}

// ---------------------------------------------------------------------------
// Helper: close out an attempt whose timer ran out without a manual submit
// (e.g. student closed the tab). Marks whatever was saved as final.
// ---------------------------------------------------------------------------
async function finalizeExpiredAttempt(attemptId: string) {
  const attempt = await prisma.testAttempt.findUnique({
    where: { id: attemptId },
    include: { test: true, answers: true },
  });
  if (!attempt || attempt.status !== "IN_PROGRESS") return;

  const testQuestions = await prisma.testQuestion.findMany({
    where: { testId: attempt.testId },
    include: { question: { include: { options: true } } },
  });

  const questionsForScoring = testQuestions.map((tq) => ({
    id: tq.question.id,
    correctOptionIds: tq.question.options
      .filter((o) => o.isCorrect)
      .map((o) => o.id),
  }));

  const scored = calculateResult(
    attempt.test,
    questionsForScoring,
    attempt.answers,
  );

  await prisma.$transaction([
    prisma.testAttempt.update({
      where: { id: attemptId },
      data: { status: "EXPIRED", submittedAt: new Date() },
    }),
    prisma.result.upsert({
      where: { attemptId },
      create: {
        attemptId,
        score: scored.score,
        totalMarks: scored.totalMarks,
        correctCount: scored.correctCount,
        wrongCount: scored.wrongCount,
        unattemptedCount: scored.unattemptedCount,
        accuracy: scored.accuracy,
      },
      update: {},
    }),
  ]);
}