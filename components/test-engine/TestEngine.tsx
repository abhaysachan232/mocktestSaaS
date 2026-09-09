"use client";

import { useCallback, useEffect } from "react";
import type { JSONContent } from "@tiptap/react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
} from "lucide-react";

import { useTestSession } from "@/hooks/useTestSession";
import QuestionSection from "./QuestionSection";
import TestHeader from "./header/TestHeader";

// ============================================================
// TYPES
// ============================================================

export interface TestEngineOption {
  id: string;
  content: JSONContent;
  questionId: string;
}

export interface TestEngineQuestion {
  id: string;

  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";

  content: JSONContent;

  options: TestEngineOption[];

  subject: {
    id: string;
    name: string;
  };

  topic: {
    id: string;
    name: string;
  };
}

export interface TestQuestion {
  order: number;
  question: TestEngineQuestion;
}

export interface TestEngineData {
  id: string;
  name: string;
  description: string | null;

  duration: number;

  totalMarks: number;
  totalQuestions: number;

  negativeMarking: boolean;
  negativeMarks: number | null;

  testQuestions: TestQuestion[];
}

interface TestEngineProps {
  test: TestEngineData;
  attemptId: string;
  expiresAt: Date | string;
}

// ============================================================
// COMPONENT
// ============================================================

export default function TestEngine({
  test,
  attemptId,
  expiresAt,
}: TestEngineProps) {
  const router = useRouter();

  const session = useTestSession(
    test,
    attemptId,
    expiresAt
  );

  const {
    questions,
    currentIndex,
    currentQuestion,

    nextQuestion,
    previousQuestion,

    isFirstQuestion,
    isLastQuestion,

    answers,

    selectCurrentAnswer,
    clearCurrentAnswer,

    toggleCurrentMark,
    isMarked,

    remainingSeconds,
    startTimer,
    pauseTimer,

    submit,
    isSubmitting,
    isSubmitted,
  } = session;

  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const totalQuestions = questions.length;

  const selectedOptions = currentQuestion
    ? answers[currentQuestion.id] ?? []
    : [];

  const hasResponse = selectedOptions.length > 0;

  const currentMarked = currentQuestion
    ? isMarked(currentQuestion.id)
    : false;

  // ==========================================================
  // TIMER
  // ==========================================================

  useEffect(() => {
    startTimer();

    return () => {
      pauseTimer();
    };
  }, [startTimer, pauseTimer]);

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = useCallback(async () => {
    if (!attemptId) {
      console.error("TEST_SUBMIT_ERROR: attemptId missing");
      return;
    }

    if (isSubmitting || isSubmitted) {
      return;
    }

    try {
      const response = await submit({
        attemptId,
      });

      if (!response.success) {
        console.error(
          "TEST_SUBMIT_FAILED:",
          response.message
        );
        return;
      }

      const resultId = response.data?.resultId;

      if (!resultId) {
        console.error(
          "TEST_SUBMIT_ERROR: Result ID missing",
          response
        );
        return;
      }

      // Stop timer before redirect
      pauseTimer();

      router.replace(
        `/student/tests/${test.id}/result/${resultId}`
      );
    } catch (error) {
      console.error(
        "TEST_SUBMIT_ERROR:",
        error
      );
    }
  }, [
    attemptId,
    isSubmitting,
    isSubmitted,
    submit,
    pauseTimer,
    router,
    test.id,
  ]);

  // ==========================================================
  // INVALID ATTEMPT
  // ==========================================================

  if (!attemptId) {
    return (
      <EngineMessage
        title="Invalid attempt"
        description="This test attempt could not be found."
      />
    );
  }

  // ==========================================================
  // LOADING / EMPTY QUESTIONS
  // ==========================================================

  if (!currentQuestion || totalQuestions === 0) {
    return (
      <EngineMessage
        title="No questions available"
        description="This test currently has no questions."
      />
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <TestHeader
        testName={test.name}
        description={test.description}
        currentQuestion={currentIndex + 1}
        totalQuestions={totalQuestions}
        remainingSeconds={remainingSeconds}
        onSubmit={handleSubmit}
      />

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <section className="min-w-0">
          {/* ==================================================
              QUESTION
          ================================================== */}

          <QuestionSection
            questionNumber={currentIndex + 1}
            questionContent={currentQuestion.content}
            options={currentQuestion.options ?? []}
            questionType={currentQuestion.type}
            selectedOptions={selectedOptions}
            onSelectOption={selectCurrentAnswer}
          />

          {/* ==================================================
              NAVIGATION
          ================================================== */}

          <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-200 pt-4 sm:gap-3">
            {/* ==================================================
                PREVIOUS
            ================================================== */}

            <button
              type="button"
              onClick={previousQuestion}
              disabled={isFirstQuestion}
              aria-label="Previous question"
              className="
                inline-flex
                min-h-10
                shrink-0
                items-center
                justify-center
                gap-1.5
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-50
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-40
                sm:gap-2
                sm:px-4
              "
            >
              <ChevronLeft
                className="h-4 w-4"
                aria-hidden="true"
              />

              <span className="hidden sm:inline">
                Previous
              </span>
            </button>

            {/* ==================================================
                CENTER CONTROLS
            ================================================== */}

            <div className="flex min-w-0 items-center justify-center gap-1.5 sm:gap-2">
              {/* =================================================
                  MARK FOR REVIEW
              ================================================= */}

              <button
                type="button"
                onClick={toggleCurrentMark}
                aria-pressed={currentMarked}
                aria-label={
                  currentMarked
                    ? "Remove mark for review"
                    : "Mark question for review"
                }
                title={
                  currentMarked
                    ? "Remove mark"
                    : "Mark for review"
                }
                className={[
                  "inline-flex",
                  "min-h-10",
                  "items-center",
                  "justify-center",
                  "gap-1.5",
                  "rounded-xl",
                  "border",
                  "px-2.5",
                  "py-2",
                  "text-xs",
                  "font-semibold",
                  "transition-colors",
                  "active:scale-[0.98]",
                  "sm:px-3",
                  "sm:text-sm",
                  currentMarked
                    ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                <Flag
                  className="h-4 w-4 shrink-0"
                  fill={
                    currentMarked
                      ? "currentColor"
                      : "none"
                  }
                  aria-hidden="true"
                />

                <span className="hidden sm:inline">
                  {currentMarked
                    ? "Marked"
                    : "Mark for Review"}
                </span>
              </button>

              {/* =================================================
                  CLEAR RESPONSE
              ================================================= */}

              <button
                type="button"
                onClick={clearCurrentAnswer}
                disabled={!hasResponse}
                aria-label="Clear response"
                title="Clear response"
                className="
                  inline-flex
                  min-h-10
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-2.5
                  py-2
                  text-xs
                  font-semibold
                  text-slate-700
                  transition-colors
                  hover:bg-slate-50
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  sm:px-3
                  sm:text-sm
                "
              >
                <RotateCcw
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                />

                <span className="hidden sm:inline">
                  Clear Response
                </span>
              </button>
            </div>

            {/* ==================================================
                NEXT
            ================================================== */}

            <button
              type="button"
              onClick={nextQuestion}
              disabled={isLastQuestion}
              aria-label="Next question"
              className="
                inline-flex
                min-h-10
                shrink-0
                items-center
                justify-center
                gap-1.5
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                px-3
                py-2
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:shadow-md
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-40
                sm:gap-2
                sm:px-5
              "
            >
              <span className="hidden sm:inline">
                Next
              </span>

              <ChevronRight
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

// ============================================================
// ENGINE MESSAGE
// ============================================================

interface EngineMessageProps {
  title: string;
  description: string;
}

function EngineMessage({
  title,
  description,
}: EngineMessageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
