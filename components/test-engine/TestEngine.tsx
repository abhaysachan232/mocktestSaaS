"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  RotateCcw,
  X,
} from "lucide-react";
import Timer from "./Timer";
import {
  saveAnswer,
  submitTestAttempt,
} from "@/lib/actions/test-engine.actions";
import type { JSONContent } from "@tiptap/react";
import RichContentRenderer from "../editor/RichContentRenderer";

type OptionData = {
  id: string;
  content: unknown; // Json — shape is up to how you author questions
};

type QuestionData = {
  id: string;
  order: number;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
  content: unknown;
  options: OptionData[];
};

type InitialAnswer = {
  questionId: string;
  selectedOptionIds: string[];
  markedForReview: boolean;
};

type TestEngineProps = {
  attemptId: string;
  testName: string;
  expiresAt: string; // ISO string
  questions: QuestionData[];
  initialAnswers: InitialAnswer[];
};

type AnswerState = {
  selectedOptionIds: string[];
  markedForReview: boolean;
  visited: boolean;
};


function getStatus(answer: AnswerState | undefined) {
  if (!answer || !answer.visited) return "not-visited" as const;
  const hasAnswer = answer.selectedOptionIds.length > 0;
  if (hasAnswer && answer.markedForReview) return "answered-marked" as const;
  if (answer.markedForReview) return "marked" as const;
  if (hasAnswer) return "answered" as const;
  return "not-answered" as const;
}

const statusStyles: Record<ReturnType<typeof getStatus>, string> = {
  "not-visited": "bg-white border-slate-200 text-slate-500",
  "not-answered": "bg-red-50 border-red-300 text-red-700",
  answered: "bg-emerald-500 border-emerald-500 text-white",
  marked: "bg-violet-500 border-violet-500 text-white",
  "answered-marked":
    "bg-violet-500 border-emerald-400 text-white ring-2 ring-emerald-400",
};

export default function TestEngine({
  attemptId,
  testName,
  expiresAt,
  questions,
  initialAnswers,
}: TestEngineProps) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => {
    const map: Record<string, AnswerState> = {};
    for (const a of initialAnswers) {
      map[a.questionId] = {
        selectedOptionIds: a.selectedOptionIds,
        markedForReview: a.markedForReview,
        visited: a.selectedOptionIds.length > 0 || a.markedForReview,
      };
    }
    return map;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, startSubmitTransition] = useTransition();

  const currentQuestion = questions[currentIndex];

  const currentAnswer = answers[currentQuestion?.id];

  const markVisited = useCallback((questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOptionIds: prev[questionId]?.selectedOptionIds ?? [],
        markedForReview: prev[questionId]?.markedForReview ?? false,
        visited: true,
      },
    }));
  }, []);

  const persistAnswer = useCallback(
    (
      questionId: string,
      selectedOptionIds: string[],
      markedForReview: boolean,
    ) => {
      saveAnswer({
        attemptId,
        questionId,
        selectedOptionIds,
        markedForReview,
      }).catch(() => {
        // Best-effort autosave — a failed save here shouldn't block the UI.
        // Consider surfacing a toast if this happens repeatedly.
      });
    },
    [attemptId],
  );

  const selectOption = (optionId: string) => {
  if (!currentQuestion) return;

  const questionId = currentQuestion.id;
  const existing = answers[questionId];

  const prevSelected = existing?.selectedOptionIds ?? [];

  const nextSelected =
    currentQuestion.type === "SINGLE_CHOICE"
      ? [optionId]
      : prevSelected.includes(optionId)
        ? prevSelected.filter((id) => id !== optionId)
        : [...prevSelected, optionId];

  const markedForReview = existing?.markedForReview ?? false;

  setAnswers((prev) => ({
    ...prev,
    [questionId]: {
      selectedOptionIds: nextSelected,
      markedForReview,
      visited: true,
    },
  }));

  persistAnswer(questionId, nextSelected, markedForReview);
};

  const clearResponse = () => {
    if (!currentQuestion) return;
    const markedForReview = currentAnswer?.markedForReview ?? false;
    persistAnswer(currentQuestion.id, [], markedForReview);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedOptionIds: [],
        markedForReview,
        visited: true,
      },
    }));
  };

  const toggleMarkForReview = () => {
    if (!currentQuestion) return;
    const selectedOptionIds = currentAnswer?.selectedOptionIds ?? [];
    const nextMarked = !(currentAnswer?.markedForReview ?? false);
    persistAnswer(currentQuestion.id, selectedOptionIds, nextMarked);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedOptionIds,
        markedForReview: nextMarked,
        visited: true,
      },
    }));
  };

  const goTo = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    if (currentQuestion) markVisited(currentQuestion.id);
    setCurrentIndex(index);
  };

  const stats = useMemo(() => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let notVisited = 0;

    questions.forEach((q) => {
      const status = getStatus(answers[q.id]);
      if (status === "answered") answered += 1;
      else if (status === "not-answered") notAnswered += 1;
      else if (status === "marked" || status === "answered-marked") marked += 1;
      else notVisited += 1;
    });

    return { answered, notAnswered, marked, notVisited };
  }, [answers, questions]);

  const doSubmit = useCallback(() => {
    startSubmitTransition(() => {
      submitTestAttempt(attemptId);
    });
  }, [attemptId]);

  const handleAutoSubmit = useCallback(() => {
    doSubmit();
  }, [doSubmit]);

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center text-slate-500">
        No questions found for this test.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">
            {testName}
          </h1>

          <div className="flex items-center gap-3">
            <Timer expiresAt={expiresAt} onExpire={handleAutoSubmit} />

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-5 lg:grid-cols-[1fr_300px]">
        {/* Question panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              Question {currentIndex + 1} of {questions.length}
            </span>

            <span className="text-xs text-slate-400">
              {currentQuestion.type === "MULTIPLE_CHOICE"
                ? "Multiple answers may be correct"
                : "Single correct answer"}
            </span>
          </div>

          <p className="mb-5 text-base leading-relaxed text-slate-900">
            <RichContentRenderer
              content={currentQuestion.content as JSONContent}
              compact
            />
          </p>

          <div className="space-y-2.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentAnswer?.selectedOptionIds.includes(
                option.id,
              );

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectOption(option.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>
                    <RichContentRenderer
                      content={option.content as JSONContent}
                      compact
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom actions */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={clearResponse}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
              Clear Response
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => goTo(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                onClick={toggleMarkForReview}
                className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100"
              >
                <Bookmark className="h-4 w-4" />
                {currentAnswer?.markedForReview
                  ? "Unmark Review"
                  : "Mark for Review"}
              </button>

              <button
                type="button"
                onClick={() => goTo(currentIndex + 1)}
                disabled={currentIndex === questions.length - 1}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                Save & Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigator sidebar */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-slate-900">
            Question Palette
          </h2>

          <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
            <LegendItem
              colorClass="bg-emerald-500"
              label={`Answered (${stats.answered})`}
            />
            <LegendItem
              colorClass="bg-red-50 border border-red-300"
              label={`Not answered (${stats.notAnswered})`}
            />
            <LegendItem
              colorClass="bg-violet-500"
              label={`Marked (${stats.marked})`}
            />
            <LegendItem
              colorClass="bg-white border border-slate-200"
              label={`Not visited (${stats.notVisited})`}
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const status = getStatus(answers[q.id]);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goTo(idx)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition ${statusStyles[status]} ${
                    idx === currentIndex
                      ? "ring-2 ring-indigo-400 ring-offset-1"
                      : ""
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {showSubmitModal && (
        <SubmitConfirmModal
          stats={stats}
          totalQuestions={questions.length}
          isSubmitting={isSubmitting}
          onCancel={() => setShowSubmitModal(false)}
          onConfirm={doSubmit}
        />
      )}
    </div>
  );
}

function LegendItem({
  colorClass,
  label,
}: {
  colorClass: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-slate-600">
      <span className={`h-3.5 w-3.5 shrink-0 rounded ${colorClass}`} />
      {label}
    </div>
  );
}

function SubmitConfirmModal({
  stats,
  totalQuestions,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  stats: {
    answered: number;
    notAnswered: number;
    marked: number;
    notVisited: number;
  };
  totalQuestions: number;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const unattempted = totalQuestions - stats.answered;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Submit test?</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {unattempted > 0 ? (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              You have {unattempted} unanswered question
              {unattempted > 1 ? "s" : ""}. Once submitted, you can&apos;t change
              your answers.
            </span>
          </div>
        ) : (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>All questions answered. Ready to submit.</span>
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Circle className="h-3 w-3 fill-emerald-500 text-emerald-500" />{" "}
            Answered: {stats.answered}
          </span>
          <span>Not answered: {stats.notAnswered}</span>
          <span>Marked: {stats.marked}</span>
          <span>Not visited: {stats.notVisited}</span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Continue Test
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
