"use client";

import { useMemo, useState } from "react";

import TestHeader from "./header/TestHeader";

import QuestionSection from "./question/QuestionSection";

import QuestionPalette from "./palette/QuestionPalette";
import { PaletteStatus } from "./palette/PaletteItem";

import NavigationButtons from "./navigation/NavigationButtons";
import MarkForReviewButton from "./navigation/MarkForReviewButton";
import ClearResponseButton from "./navigation/ClearResponseButton";

import TestFooter from "./mobile/TestFooter";
import MobileQuestionPalette from "./mobile/MobileQuestionPalette";

import SubmitButton from "./submit/SubmitButton";
import SubmitModal from "./submit/SubmitModal";

import Calculator from "./tools/Calculator";

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

  correctAnswer?: string;
  marks?: number;
  negativeMarks?: number;
}

export interface TestEngineData {
  id: string;
  title: string;
  subtitle?: string;
  duration: number;
  questions: TestEngineQuestion[];
}

interface TestEngineProps {
  test: TestEngineData;
}

export default function TestEngine({
  test,
}: TestEngineProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<
    Record<string, string>
  >({});

  const [markedQuestions, setMarkedQuestions] =
    useState<Set<string>>(new Set());

  const [visitedQuestions, setVisitedQuestions] =
    useState<Set<string>>(new Set([test.questions[0]?.id]));

  const [timeRemaining, setTimeRemaining] = useState(
    test.duration * 60
  );

  const [submitModalOpen, setSubmitModalOpen] =
    useState(false);

  const [mobilePaletteOpen, setMobilePaletteOpen] =
    useState(false);

  const [calculatorOpen, setCalculatorOpen] =
    useState(false);

  const question =
    test.questions[currentQuestion];

  const totalQuestions = test.questions.length;

  const selectedAnswer = question
    ? answers[question.id] ?? null
    : null;

  /*
   * Statistics
   */
  const attempted = useMemo(() => {
    return Object.keys(answers).filter(
      (questionId) => answers[questionId]
    ).length;
  }, [answers]);

  const unanswered = totalQuestions - attempted;

  const marked = markedQuestions.size;

  /*
   * Question status
   */
  const getQuestionStatus = (
    index: number
  ): PaletteStatus => {
    const current =
      test.questions[index];

    if (!current) {
      return "not-visited";
    }

    const isCurrent =
      index === currentQuestion;

    const isAnswered =
      Boolean(answers[current.id]);

    const isMarked =
      markedQuestions.has(current.id);

    if (isCurrent) {
      return "current";
    }

    if (isAnswered && isMarked) {
      return "answered-marked";
    }

    if (isMarked) {
      return "marked";
    }

    if (isAnswered) {
      return "answered";
    }

    if (visitedQuestions.has(current.id)) {
      return "visited";
    }

    return "not-visited";
  };

  /*
   * Navigate to question
   */
  const goToQuestion = (index: number) => {
    if (
      index < 0 ||
      index >= totalQuestions
    ) {
      return;
    }

    setCurrentQuestion(index);

    const questionId =
      test.questions[index]?.id;

    if (questionId) {
      setVisitedQuestions((previous) => {
        const next = new Set(previous);
        next.add(questionId);
        return next;
      });
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Previous
   */
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      goToQuestion(currentQuestion - 1);
    }
  };

  /*
   * Next
   */
  const handleNext = () => {
    if (
      currentQuestion <
      totalQuestions - 1
    ) {
      goToQuestion(currentQuestion + 1);
    }
  };

  /*
   * Select answer
   */
  const handleSelectAnswer = (
    optionId: string
  ) => {
    if (!question) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [question.id]: optionId,
    }));
  };

  /*
   * Clear answer
   */
  const handleClearAnswer = () => {
    if (!question) {
      return;
    }

    setAnswers((previous) => {
      const next = {
        ...previous,
      };

      delete next[question.id];

      return next;
    });
  };

  /*
   * Mark / unmark
   */
  const handleMarkQuestion = () => {
    if (!question) {
      return;
    }

    setMarkedQuestions((previous) => {
      const next = new Set(previous);

      if (next.has(question.id)) {
        next.delete(question.id);
      } else {
        next.add(question.id);
      }

      return next;
    });
  };

  /*
   * Submit
   */
  const handleSubmit = () => {
    console.log("Test submitted", {
      testId: test.id,
      answers,
      marked: Array.from(markedQuestions),
    });

    setSubmitModalOpen(false);

    // Later:
    // router.push(`/mock-test-result/${attemptId}`)
  };

  /*
   * Timer expired
   */
  const handleTimeExpired = () => {
    handleSubmit();
  };

  if (!question) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="font-bold text-red-700">
            No questions available
          </h2>

          <p className="mt-1 text-sm text-red-600">
            This test does not contain any questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <TestHeader
        title={test.title}
        subtitle={test.subtitle}
        currentQuestion={currentQuestion + 1}
        totalQuestions={totalQuestions}
        timeRemaining={timeRemaining}
        onMenuClick={() =>
          setMobilePaletteOpen(true)
        }
        onSubmit={() =>
          setSubmitModalOpen(true)
        }
      />

      {/* Main */}
      <div className="mx-auto max-w-7xl px-3 py-4 pb-24 sm:px-5 sm:py-6 md:pb-8 lg:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Question Area */}
          <div className="min-w-0">
            <QuestionSection
              questionNumber={
                currentQuestion + 1
              }
              questionText={
                question.question
              }
              options={question.options}
              selectedOption={
                selectedAnswer
              }
              image={question.image}
              imageAlt={
                question.imageAlt
              }
              onSelectOption={
                handleSelectAnswer
              }
            />

            {/* Desktop Actions */}
            <div className="mt-4 hidden items-center justify-between gap-3 md:flex">
              <div className="flex items-center gap-2">
                <MarkForReviewButton
                  isMarked={markedQuestions.has(
                    question.id
                  )}
                  onClick={
                    handleMarkQuestion
                  }
                />

                <ClearResponseButton
                  disabled={
                    !selectedAnswer
                  }
                  onClick={
                    handleClearAnswer
                  }
                />
              </div>

              <NavigationButtons
                isFirstQuestion={
                  currentQuestion === 0
                }
                isLastQuestion={
                  currentQuestion ===
                  totalQuestions - 1
                }
                onPrevious={
                  handlePrevious
                }
                onNext={handleNext}
              />
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden space-y-4 lg:block">
            <QuestionPalette
              totalQuestions={
                totalQuestions
              }
              currentQuestion={
                currentQuestion
              }
              getQuestionStatus={
                getQuestionStatus
              }
              onQuestionClick={
                goToQuestion
              }
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SubmitButton
                onClick={() =>
                  setSubmitModalOpen(true)
                }
                label="Submit Test"
              />

              <button
                type="button"
                onClick={() =>
                  setCalculatorOpen(true)
                }
                className="mt-2.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Open Calculator
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Footer */}
      <TestFooter
        isFirstQuestion={
          currentQuestion === 0
        }
        isLastQuestion={
          currentQuestion ===
          totalQuestions - 1
        }
        isMarked={markedQuestions.has(
          question.id
        )}
        hasAnswer={Boolean(
          selectedAnswer
        )}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onMark={handleMarkQuestion}
        onClear={handleClearAnswer}
      />

      {/* Mobile Palette */}
      <MobileQuestionPalette
        isOpen={mobilePaletteOpen}
        onClose={() =>
          setMobilePaletteOpen(false)
        }
        totalQuestions={
          totalQuestions
        }
        currentQuestion={
          currentQuestion
        }
        getQuestionStatus={
          getQuestionStatus
        }
        onQuestionClick={
          goToQuestion
        }
      />

      {/* Submit Modal */}
      <SubmitModal
        isOpen={submitModalOpen}
        onClose={() =>
          setSubmitModalOpen(false)
        }
        onConfirm={handleSubmit}
        totalQuestions={
          totalQuestions
        }
        attempted={attempted}
        unanswered={unanswered}
        marked={marked}
      />

      {/* Calculator */}
      <Calculator
        isOpen={calculatorOpen}
        onClose={() =>
          setCalculatorOpen(false)
        }
      />
    </div>
  );
}