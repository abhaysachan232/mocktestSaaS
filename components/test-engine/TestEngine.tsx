"use client";

import { useState } from "react";

import TestHeader from "./header/TestHeader";

import QuestionSection from "./question/QuestionSection";

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

/* =========================================================
   TYPES
========================================================= */

export interface TestEngineOption {
  id: string;
  text: string;
}

export interface TestEngineQuestion {
  id: string;
  question: string;

  options: TestEngineOption[];

  image?: string;
  imageAlt?: string;

  /*
   * Static version:
   * correctAnswer is available.
   *
   * Later API version:
   * Do NOT send correctAnswer to client.
   */
  correctAnswer?: string;

  marks?: number;
  negativeMarks?: number;
}

export interface TestEngineData {
  id: string;

  title: string;

  subtitle?: string;

  /*
   * Duration in minutes
   */
  duration: number;

  questions: TestEngineQuestion[];
}

interface TestEngineProps {
  test: TestEngineData;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TestEngine({
  test,
}: TestEngineProps) {
  /* =======================================================
     UI STATE
  ======================================================= */

  const [testStarted, setTestStarted] =
    useState(false);

  const [submitModalOpen, setSubmitModalOpen] =
    useState(false);

  const [mobilePaletteOpen, setMobilePaletteOpen] =
    useState(false);

  const [calculatorOpen, setCalculatorOpen] =
    useState(false);

  /* =======================================================
     TIMER EXPIRED
  ======================================================= */

  const handleTimeExpired = () => {
    handleSubmit();
  };

  /* =======================================================
     TEST SESSION
  ======================================================= */

  const session = useTestSession(
    test,
    handleTimeExpired
  );

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
  } = session;

  const totalQuestions =
    questions.length;

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async () => {
    pauseTimer();

    const response = await submit({
      testId: test.id,

      answers,

      markedQuestions:
        Array.from(markedQuestions),

      timeRemaining:
        remainingSeconds,
    });

    if (response.success) {
      setSubmitModalOpen(false);

      /*
       * Static version:
       * Result available in `result`.
       *
       * Later:
       *
       * router.push(
       *   `/mock-test-result/${test.id}`
       * );
       */

      console.log(
        "Test submitted successfully"
      );

      console.log(
        "Result:",
        result
      );
    }
  };

  /* =======================================================
     START TEST
  ======================================================= */

  const handleStartTest = () => {
    setTestStarted(true);

    /*
     * Timer starts only after
     * user clicks Start Test.
     */
    startTimer();
  };

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
            This test does not contain any
            questions.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     START SCREEN
  ======================================================= */

  if (!testStarted) {
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
              {test.title}
            </h1>

            {test.subtitle && (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {test.subtitle}
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

              <p className="mt-1 text-xs font-medium text-slate-500">
                Minutes
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-sm font-bold text-amber-800">
              Test Instructions
            </h2>

            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-amber-700">
              <li>
                • Timer starts after clicking Start
                Test.
              </li>

              <li>
                • You can navigate between questions.
              </li>

              <li>
                • You can mark questions for review.
              </li>

              <li>
                • You can clear your selected answer.
              </li>

              <li>
                • Test automatically submits when
                time ends.
              </li>
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
     CURRENT QUESTION SAFETY CHECK
  ======================================================= */

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="font-bold text-red-700">
            Question Not Found
          </h2>

          <p className="mt-1 text-sm text-red-600">
            Unable to load the current question.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN TEST UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =================================================
          HEADER
      ================================================= */}

      <TestHeader
        title={test.title}
        subtitle={test.subtitle}
        currentQuestion={
          currentIndex + 1
        }
        totalQuestions={
          totalQuestions
        }
        timeRemaining={
          remainingSeconds
        }
        onMenuClick={() =>
          setMobilePaletteOpen(true)
        }
        onSubmit={() =>
          setSubmitModalOpen(true)
        }
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="mx-auto max-w-7xl px-3 py-4 pb-24 sm:px-5 sm:py-6 md:pb-8 lg:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* =============================================
              QUESTION AREA
          ============================================= */}

          <div className="min-w-0">
            <QuestionSection
              questionNumber={
                currentIndex + 1
              }
              questionText={
                currentQuestion.question
              }
              options={
                currentQuestion.options
              }
              selectedOption={
                answers[
                  currentQuestion.id
                ] ?? null
              }
              image={
                currentQuestion.image
              }
              imageAlt={
                currentQuestion.imageAlt
              }
              onSelectOption={
                selectCurrentAnswer
              }
            />

            {/* =========================================
                DESKTOP QUESTION CONTROLS
            ========================================= */}

            <div className="mt-4 hidden items-center justify-between gap-3 md:flex">
              {/* Left Actions */}
              <div className="flex items-center gap-2">
                <MarkForReviewButton
                  isMarked={isMarked(
                    currentQuestion.id
                  )}
                  onClick={
                    toggleCurrentMark
                  }
                />

                <ClearResponseButton
                  disabled={
                    !answers[
                      currentQuestion.id
                    ]
                  }
                  onClick={
                    clearCurrentAnswer
                  }
                />
              </div>

              {/* Navigation */}
              <NavigationButtons
                isFirstQuestion={
                  isFirstQuestion
                }
                isLastQuestion={
                  isLastQuestion
                }
                onPrevious={
                  previousQuestion
                }
                onNext={
                  nextQuestion
                }
              />
            </div>
          </div>

          {/* =============================================
              DESKTOP SIDEBAR
          ============================================= */}

          <aside className="hidden space-y-4 lg:block">
            {/* Question Palette */}
            <QuestionPalette
              totalQuestions={
                totalQuestions
              }
              currentQuestion={
                currentIndex
              }
              getQuestionStatus={
                (index) =>
                  getStatus(
                    index,
                    currentIndex
                  )
              }
              onQuestionClick={goTo}
            />

            {/* Sidebar Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SubmitButton
                onClick={() =>
                  setSubmitModalOpen(
                    true
                  )
                }
                disabled={
                  isSubmitting
                }
                label={
                  isSubmitting
                    ? "Submitting..."
                    : "Submit Test"
                }
              />

              <button
                type="button"
                onClick={() =>
                  setCalculatorOpen(
                    true
                  )
                }
                className="mt-2.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                Open Calculator
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* =================================================
          MOBILE FOOTER
      ================================================= */}

      <TestFooter
        isFirstQuestion={
          isFirstQuestion
        }
        isLastQuestion={
          isLastQuestion
        }
        isMarked={isMarked(
          currentQuestion.id
        )}
        hasAnswer={Boolean(
          answers[
            currentQuestion.id
          ]
        )}
        onPrevious={
          previousQuestion
        }
        onNext={
          nextQuestion
        }
        onMark={
          toggleCurrentMark
        }
        onClear={
          clearCurrentAnswer
        }
      />

      {/* =================================================
          MOBILE QUESTION PALETTE
      ================================================= */}

      <MobileQuestionPalette
        isOpen={
          mobilePaletteOpen
        }
        onClose={() =>
          setMobilePaletteOpen(
            false
          )
        }
        totalQuestions={
          totalQuestions
        }
        currentQuestion={
          currentIndex
        }
        getQuestionStatus={
          (index) =>
            getStatus(
              index,
              currentIndex
            )
        }
        onQuestionClick={goTo}
      />

      {/* =================================================
          SUBMIT MODAL
      ================================================= */}

      <SubmitModal
        isOpen={
          submitModalOpen
        }
        onClose={() =>
          setSubmitModalOpen(
            false
          )
        }
        onConfirm={
          handleSubmit
        }
        totalQuestions={
          result.totalQuestions
        }
        attempted={
          result.attempted
        }
        unanswered={
          result.unanswered
        }
        marked={
          markedCount
        }
      />

      {/* =================================================
          CALCULATOR
      ================================================= */}

      <Calculator
        isOpen={
          calculatorOpen
        }
        onClose={() =>
          setCalculatorOpen(
            false
          )
        }
      />
    </div>
  );
}