"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { JSONContent } from "@tiptap/react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
} from "lucide-react";

import { useTestSession } from "@/hooks/useTestSession";

import Calculator from "./tools/Calculator";
import QuestionPalette from "./palette/QuestionPalette";
import QuestionSection from "./QuestionSection";
import SubmitModal from "./submit/SubmitModal";
import TestFooter from "./mobile/TestFooter";
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

  type:
    | "SINGLE_CHOICE"
    | "MULTIPLE_CHOICE";

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

  // ----------------------------------------------------------
  // UI STATE
  // ----------------------------------------------------------

  const [isSubmitModalOpen, setIsSubmitModalOpen] =
    useState(false);

  const [isCalculatorOpen, setIsCalculatorOpen] =
    useState(false);

  const [isPaletteOpen, setIsPaletteOpen] =
    useState(false);

  // ----------------------------------------------------------
  // SUBMIT GUARD
  // ----------------------------------------------------------

  const submitStartedRef = useRef(false);

  const submitRef = useRef<() => void>(() => {});


  // ----------------------------------------------------------
  // SESSION
  // ----------------------------------------------------------

  const handleTimeExpired = useCallback(() => {
    submitRef.current();
  }, []);

  const session = useTestSession(
    test,
    attemptId,
    expiresAt,
    handleTimeExpired,
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
    attempted,

    selectCurrentAnswer,
    clearCurrentAnswer,

    markedCount,
    toggleCurrentMark,
    isMarked,

    getStatus,

    remainingSeconds,
    startTimer,
    pauseTimer,

    submit,
    isSubmitting,
    isSubmitted,
    submitError,

    saveStatus,
    saveError,

    goTo,
  } = session;


  // ----------------------------------------------------------
  // DERIVED VALUES
  // ----------------------------------------------------------

  const totalQuestions = questions.length;

  const unanswered = Math.max(
    0,
    totalQuestions - attempted,
  );

  const selectedOptions = currentQuestion
    ? answers[currentQuestion.id] ?? []
    : [];

  const currentMarked = currentQuestion
    ? isMarked(currentQuestion.id)
    : false;

  const hasResponse =
    selectedOptions.length > 0;


  // ==========================================================
  // TIMER
  // ==========================================================

  useEffect(() => {
    startTimer();

    return () => {
      pauseTimer();
    };
  }, [
    startTimer,
    pauseTimer,
  ]);


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = useCallback(async () => {
    if (!attemptId) {
      return;
    }

    // Prevent double submission
    if (submitStartedRef.current) {
      return;
    }

    if (isSubmitting || isSubmitted) {
      return;
    }

    submitStartedRef.current = true;

    try {
      const response = await submit({
        attemptId,
      });

      if (!response.success) {
        console.error(
          "TEST_SUBMIT_FAILED:",
          response.message,
        );

        submitStartedRef.current = false;
        return;
      }

      const resultId =
        response.data?.resultId;

      if (!resultId) {
        console.error(
          "TEST_SUBMIT_ERROR: Result ID missing",
          response,
        );

        submitStartedRef.current = false;
        return;
      }

      // Stop timer before redirect
      pauseTimer();

      router.replace(
        `/student/tests/${test.id}/result/${resultId}`,
      );
    } catch (error) {
      console.error(
        "TEST_SUBMIT_ERROR:",
        error,
      );

      submitStartedRef.current = false;
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


  // Keep latest submit handler for timer expiry
  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);


  // ==========================================================
  // SUBMIT MODAL
  // ==========================================================

  const openSubmitModal = useCallback(() => {
    if (isSubmitting || isSubmitted) {
      return;
    }

    setIsSubmitModalOpen(true);
  }, [
    isSubmitting,
    isSubmitted,
  ]);

  const closeSubmitModal = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitModalOpen(false);
  }, [isSubmitting]);

  const confirmSubmit = useCallback(() => {
    setIsSubmitModalOpen(false);

    void handleSubmit();
  }, [handleSubmit]);


  // ==========================================================
  // PALETTE
  // ==========================================================

  const openPalette = useCallback(() => {
    setIsPaletteOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setIsPaletteOpen(false);
  }, []);

  const handlePaletteQuestionClick =
    useCallback(
      (index: number) => {
        goTo(index);

        setIsPaletteOpen(false);
      },
      [goTo],
    );


  // ==========================================================
  // CALCULATOR
  // ==========================================================

  const openCalculator = useCallback(() => {
    setIsCalculatorOpen(true);
  }, []);

  const closeCalculator = useCallback(() => {
    setIsCalculatorOpen(false);
  }, []);


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
  // NO QUESTIONS
  // ==========================================================

  if (
    totalQuestions === 0 ||
    !currentQuestion
  ) {
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
    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-slate-50
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <TestHeader
        testName={test.name}
        description={test.description}
        currentQuestion={currentIndex + 1}
        totalQuestions={totalQuestions}
        remainingSeconds={remainingSeconds}
        onSubmit={openSubmitModal}
      />


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-7xl
          px-3
          py-4
          sm:px-4
          sm:py-5
          lg:px-6
          lg:py-6
        "
      >

        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-5
            lg:grid-cols-[minmax(0,1fr)_300px]
            xl:grid-cols-[minmax(0,1fr)_320px]
          "
        >

          {/* ==================================================
              QUESTION AREA
          ================================================== */}

          <section className="min-w-0">

            <QuestionSection
              questionNumber={currentIndex + 1}
              questionContent={currentQuestion.content}
              options={currentQuestion.options}
              questionType={currentQuestion.type}
              selectedOptions={selectedOptions}
              onSelectOption={
                selectCurrentAnswer
              }
            />


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                gap-2
                border-t
                border-slate-200
                pt-4
                sm:gap-3
              "
            >

              {/* PREVIOUS */}

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


              {/* CENTER CONTROLS */}

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  justify-center
                  gap-1.5
                  sm:gap-2
                "
              >

                {/* MARK */}

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
                      ? [
                          "border-amber-300",
                          "bg-amber-50",
                          "text-amber-700",
                          "hover:bg-amber-100",
                        ].join(" ")
                      : [
                          "border-slate-200",
                          "bg-white",
                          "text-slate-700",
                          "hover:bg-slate-50",
                        ].join(" "),
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


                {/* CLEAR */}

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


              {/* NEXT */}

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


          {/* ==================================================
              DESKTOP QUESTION PALETTE
          ================================================== */}

          <aside
            className="
              hidden
              min-w-0
              lg:block
            "
          >
            <div
              className="
                sticky
                top-24
                max-h-[calc(100dvh-7rem)]
              "
            >
              <QuestionPalette
                questions={questions}
                currentIndex={currentIndex}
                onQuestionClick={goTo}
                getStatus={getStatus}
                mobileMode="inline"
              />
            </div>
          </aside>

        </div>

      </main>


      {/* ======================================================
          MOBILE FOOTER
      ====================================================== */}

      <TestFooter
        currentQuestion={currentIndex + 1}
        totalQuestions={totalQuestions}
        attempted={attempted}
        unanswered={unanswered}
        onPaletteClick={openPalette}
        onCalculatorClick={openCalculator}
        onSubmitClick={openSubmitModal}
      />


      {/* ======================================================
          MOBILE QUESTION PALETTE
      ====================================================== */}

      <QuestionPalette
        questions={questions}
        currentIndex={currentIndex}
        onQuestionClick={
          handlePaletteQuestionClick
        }
        getStatus={getStatus}
        mobileMode="sheet"
        open={isPaletteOpen}
        onClose={closePalette}
      />


      {/* ======================================================
          CALCULATOR
      ====================================================== */}

      {isCalculatorOpen ? (
        <Calculator
          onClose={closeCalculator}
        />
      ) : null}


      {/* ======================================================
          SUBMIT MODAL
      ====================================================== */}

      <SubmitModal
        open={isSubmitModalOpen}
        onClose={closeSubmitModal}
        onConfirm={confirmSubmit}
        totalQuestions={totalQuestions}
        attempted={attempted}
        unanswered={unanswered}
        marked={markedCount}
        isSubmitting={isSubmitting}
        error={submitError}
      />


      {/* ======================================================
          SAVE STATUS
      ====================================================== */}

      <SaveStatus
        status={saveStatus}
        error={saveError}
      />

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
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-50
        p-4
        sm:p-6
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          text-center
          shadow-sm
        "
      >
        <h1
          className="
            text-lg
            font-semibold
            text-slate-900
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-500
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}


// ============================================================
// SAVE STATUS
// ============================================================

interface SaveStatusProps {
  status: string;
  error?: string | null;
}

function SaveStatus({
  status,
  error,
}: SaveStatusProps) {
  if (
    status !== "saving" &&
    status !== "saved" &&
    !error
  ) {
    return null;
  }

  return (
    <div
      role={
        error
          ? "alert"
          : "status"
      }
      className="
        fixed
        bottom-[calc(4.5rem+env(safe-area-inset-bottom))]
        left-3
        z-50
        max-w-[calc(100vw-1.5rem)]
        rounded-lg
        border
        border-slate-200
        bg-white
        px-3
        py-2
        text-xs
        shadow-md
        sm:bottom-4
        sm:left-4
      "
    >
      {error ? (
        <span className="text-red-600">
          {error}
        </span>
      ) : status === "saving" ? (
        <span className="text-slate-500">
          Saving...
        </span>
      ) : (
        <span className="text-emerald-600">
          Saved
        </span>
      )}
    </div>
  );
}