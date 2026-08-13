"use client";

import { X } from "lucide-react";

export type QuestionStatus =
  | "current"
  | "answered"
  | "marked"
  | "answered-marked"
  | "visited"
  | "not-visited";

interface MobileQuestionPaletteProps {
  isOpen: boolean;
  onClose: () => void;

  totalQuestions: number;
  currentQuestion: number;

  getQuestionStatus: (index: number) => QuestionStatus;

  onQuestionClick: (index: number) => void;
}

export default function MobileQuestionPalette({
  isOpen,
  onClose,
  totalQuestions,
  currentQuestion,
  getQuestionStatus,
  onQuestionClick,
}: MobileQuestionPaletteProps) {
  if (!isOpen) return null;

  const getStatusClass = (status: QuestionStatus) => {
    switch (status) {
      case "current":
        return "border-indigo-600 bg-indigo-600 text-white";

      case "answered":
        return "border-emerald-500 bg-emerald-500 text-white";

      case "marked":
        return "border-amber-500 bg-amber-500 text-white";

      case "answered-marked":
        return "border-purple-500 bg-purple-500 text-white";

      case "visited":
        return "border-slate-300 bg-slate-100 text-slate-700";

      default:
        return "border-slate-200 bg-white text-slate-600";
    }
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close question palette"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Question Palette
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <X size={19} />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-slate-100 px-4 py-3">
          <LegendItem
            className="bg-emerald-500"
            label="Answered"
          />

          <LegendItem
            className="bg-amber-500"
            label="Marked"
          />

          <LegendItem
            className="bg-indigo-600"
            label="Current"
          />

          <LegendItem
            className="bg-slate-200"
            label="Not Visited"
          />
        </div>

        {/* Questions */}
        <div className="max-h-[55vh] overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-8">
            {Array.from(
              { length: totalQuestions },
              (_, index) => index
            ).map((index) => {
              const status = getQuestionStatus(index);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    onQuestionClick(index);
                    onClose();
                  }}
                  aria-label={`Go to question ${index + 1}`}
                  aria-current={
                    index === currentQuestion ? "true" : undefined
                  }
                  className={`flex aspect-square items-center justify-center rounded-xl border text-sm font-semibold transition active:scale-95 ${getStatusClass(
                    status
                  )}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LegendItemProps {
  className: string;
  label: string;
}

function LegendItem({
  className,
  label,
}: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-600">
      <span
        className={`h-2.5 w-2.5 rounded-full ${className}`}
      />
      {label}
    </div>
  );
}