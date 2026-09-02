"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";

import TestHeader from "./header/TestHeader";
import QuestionSection from "./QuestionSection";
import QuestionPalette from "./palette/QuestionPalette";
import NavigationButtons from "./navigation/NavigationButtons";
import MarkForReviewButton from "./navigation/MarkForReviewButton";
import ClearResponseButton from "./navigation/ClearResponseButton";
import TestFooter from "./mobile/TestFooter";
import MobileQuestionPalette from "./mobile/MobileQuestionPalette";
import SubmitButton from "./submit/SubmitButton";
import SubmitModal from "./submit/SubmitModal";
import Calculator from "./tools/Calculator";

import { useTestSession } from "@/hooks/useTestSession";
import { startTestAttempt } from "@/actions/test-attempt.actions";

/* =========================================================
   TYPES
========================================================= */

export interface TestEngineOption {
  id: string;
  content: JSONContent;
  isCorrect: boolean;
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

  /**
   * Existing TestAttempt ID.
   *
   * undefined:
   *     Start screen
   *
   * defined:
   *     Attempt page
   */
  attemptId?: string;

  /**
   * Logged-in student's User ID.
   */
  userId: string;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TestEngine({
  test,
  attemptId,
  userId,
}: TestEngineProps) {
  const router = useRouter();

  /* =======================================================
     UI STATE
  ======================================================= */

  const [testStarted, setTestStarted] = useState(Boolean(attemptId));

  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);

  const [calculatorOpen, setCalculatorOpen] = useState(false);

  /* =======================================================
     TIME EXPIRED
  ======================================================= */

  async function handleTimeExpired() {
    await handleSubmit();
  }

  /* =======================================================
     TEST SESSION
  ======================================================= */

  const session = useTestSession(test, attemptId ?? "", handleTimeExpired);

  const {
    questions,
    currentIndex,
    currentQuestion,

    goTo,
    nextQuestion,
    previousQuestion,

    isFirstQuestion,
    isLastQuestion,

    answers,
    attempted,

    selectCurrentAnswer,
    clearCurrentAnswer,

    markedQuestions,
    markedCount,

    toggleCurrentMark,
    isMarked,
    getStatus,

    remainingSeconds,
    startTimer,
    pauseTimer,

    result,

    submit,
    isSubmitting,

    saveStatus,
    saveError,
  } = session;

  const totalQuestions = questions.length;

  /* =======================================================
     START TIMER
  ======================================================= */

  useEffect(() => {
    if (!attemptId) {
      return;
    }

    setTestStarted(true);

    startTimer();
  }, [attemptId, startTimer]);

  /* =======================================================
     SUBMIT TEST
  ======================================================= */

  async function handleSubmit() {
    /*
     * Stop timer immediately.
     */
    pauseTimer();

    const response = await submit({
      testId: test.id,
      attemptId,
      answers,

      markedQuestions: Array.from(markedQuestions),

      timeRemaining: remainingSeconds,
    });

    console.log("response", response);

    if (!response.success) {
      console.error("TEST_SUBMIT_ERROR:", response.error);

      return;
    }

    /*
     * Close modal.
     */
    setSubmitModalOpen(false);

    console.log("Test submitted successfully");

    console.log("Result:", result);

    /*
     * After PHASE 8.4/8.5:
     *
     * router.replace(
     *   `/student/tests/${test.id}/result/${attemptId}`
     * );
     */

    if (attemptId) {
      router.push(`/student/tests/${test.id}/result/${attemptId}`);
    }
  }

  /* =======================================================
     START TEST
  ======================================================= */

  async function handleStartTest() {
    if (!userId) {
      alert("User not found.");

      return;
    }

    try {
      /*
       * Create TestAttempt.
       */
      const response = await startTestAttempt(userId, test.id);

      if (!response.success) {
        alert(response.error);

        return;
      }

      /*
       * IMPORTANT:
       *
       * Timer is NOT started here.
       *
       * We navigate to the attempt page.
       *
       * Attempt page receives attemptId.
       *
       * useEffect above starts timer.
       */

      router.push(`/student/tests/${test.id}/attempt/${response.attemptId}`);
    } catch (error) {
      console.error("START_TEST_ERROR:", error);

      alert("Unable to start test. Please try again.");
    }
  }

  /* =======================================================
     EMPTY TEST
  ======================================================= */

  if (!questions.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-bold text-red-700">
            No Questions Available
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-600">
            This test does not contain any questions.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     START SCREEN
  ======================================================= */

  if (!testStarted || !attemptId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-4">
        <div className="w-full max-w-md rounded-3xl border border-white bg-white p-6 shadow-xl sm:p-8">
          {/* Logo */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-lg">
            T
          </div>

          {/* Title */}

          <div className="mt-5 text-center">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {test.name}
            </h1>

            {test.description && (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {test.description}
              </p>
            )}
          </div>

          {/* Test Information */}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {totalQuestions}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Questions
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {test.duration}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">Minutes</p>
            </div>
          </div>

          {/* Instructions */}

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-sm font-bold text-amber-800">
              Test Instructions
            </h2>

            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-amber-700">
              <li>• Timer starts after clicking Start Test.</li>

              <li>• You can navigate between questions.</li>

              <li>• You can mark questions for review.</li>

              <li>• You can select or clear answers.</li>

              <li>• Multiple-choice questions may have multiple answers.</li>

              <li>• Test automatically submits when time ends.</li>
            </ul>
          </div>

          {/* Start Button */}

          <button
            type="button"
            onClick={handleStartTest}
            className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     CURRENT QUESTION SAFETY
  ======================================================= */

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="font-bold text-red-700">Question Not Found</h2>

          <p className="mt-1 text-sm text-red-600">
            Unable to load the current question.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     CURRENT ANSWER
  ======================================================= */

  const currentSelectedOptions = answers[currentQuestion.id] ?? [];

  const hasCurrentAnswer = currentSelectedOptions.length > 0;

  /* =======================================================
     MAIN TEST UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===================================================
          HEADER
      =================================================== */}

      <TestHeader
        title={test.name}
        description={test.description}
        currentQuestion={currentIndex + 1}
        totalQuestions={totalQuestions}
        timeRemaining={remainingSeconds}
        onMenuClick={() => setMobilePaletteOpen(true)}
        onSubmit={() => setSubmitModalOpen(true)}
      />

      <div className="mx-auto max-w-7xl px-3 py-4 pb-24 sm:px-5 sm:py-6 md:pb-8 lg:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* =================================================
              QUESTION SECTION
          ================================================= */}

          <div className="min-w-0">
            <QuestionSection
              questionNumber={currentIndex + 1}
              questionContent={currentQuestion.content}
              options={currentQuestion.options}
              questionType={currentQuestion.type}
              selectedOptions={currentSelectedOptions}
              onSelectOption={selectCurrentAnswer}
            />

            {/* =============================================
                DESKTOP ACTIONS
            ============================================= */}

            <div className="mt-4 hidden items-center justify-between gap-3 md:flex">
              {/* Left Actions */}

              <div className="flex items-center gap-2">
                <MarkForReviewButton
                  isMarked={isMarked(currentQuestion.id)}
                  onClick={toggleCurrentMark}
                />

                <ClearResponseButton
                  disabled={!hasCurrentAnswer}
                  onClick={clearCurrentAnswer}
                />
              </div>

              {/* Navigation */}

              <NavigationButtons
                isFirstQuestion={isFirstQuestion}
                isLastQuestion={isLastQuestion}
                onPrevious={previousQuestion}
                onNext={nextQuestion}
              />
            </div>

            {/* =============================================
                SAVE STATUS
            ============================================= */}

            {saveStatus === "saving" && (
              <p className="mt-2 text-right text-xs text-slate-400">
                Saving...
              </p>
            )}

            {saveStatus === "saved" && (
              <p className="mt-2 text-right text-xs text-green-600">Saved</p>
            )}

            {saveStatus === "error" && (
              <p className="mt-2 text-right text-xs text-red-600">
                {saveError ?? "Unable to save answer"}
              </p>
            )}
          </div>

          {/* =================================================
              DESKTOP SIDEBAR
          ================================================= */}

          <aside className="hidden space-y-4 lg:block">
            {/* Question Palette */}

            <QuestionPalette
              totalQuestions={totalQuestions}
              currentQuestion={currentIndex}
              getQuestionStatus={(index) => getStatus(index, currentIndex)}
              onQuestionClick={goTo}
            />

            {/* Sidebar Actions */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SubmitButton
                onClick={() => setSubmitModalOpen(true)}
                disabled={isSubmitting}
                label={isSubmitting ? "Submitting..." : "Submit Test"}
              />

              <button
                type="button"
                onClick={() => setCalculatorOpen(true)}
                className="mt-2.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                Open Calculator
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* =====================================================
          MOBILE FOOTER
      ===================================================== */}

      <TestFooter
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
        isMarked={isMarked(currentQuestion.id)}
        hasAnswer={hasCurrentAnswer}
        onPrevious={previousQuestion}
        onNext={nextQuestion}
        onMark={toggleCurrentMark}
        onClear={clearCurrentAnswer}
      />

      {/* =====================================================
          MOBILE QUESTION PALETTE
      ===================================================== */}

      <MobileQuestionPalette
        isOpen={mobilePaletteOpen}
        onClose={() => setMobilePaletteOpen(false)}
        totalQuestions={totalQuestions}
        currentQuestion={currentIndex}
        getQuestionStatus={(index) => getStatus(index, currentIndex)}
        onQuestionClick={goTo}
      />

      {/* =====================================================
          SUBMIT MODAL
      ===================================================== */}

      <SubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onConfirm={handleSubmit}
        totalQuestions={result.totalQuestions}
        attempted={result.attempted}
        unanswered={result.unanswered}
        marked={markedCount}
      />

      {/* =====================================================
          CALCULATOR
      ===================================================== */}

      <Calculator
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />
    </div>
  );
}
