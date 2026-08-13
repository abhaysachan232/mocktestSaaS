"use client";

import {
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
} from "lucide-react";

interface TestFooterProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;

  isMarked: boolean;
  hasAnswer: boolean;

  onPrevious: () => void;
  onNext: () => void;
  onMark: () => void;
  onClear: () => void;
}

export default function TestFooter({
  isFirstQuestion,
  isLastQuestion,
  isMarked,
  hasAnswer,
  onPrevious,
  onNext,
  onMark,
  onClear,
}: TestFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-2xl items-center gap-2">
        {/* Previous */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous question"
        >
          <ChevronLeft size={21} />
        </button>

        {/* Mark */}
        <button
          type="button"
          onClick={onMark}
          className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 text-xs font-semibold transition ${
            isMarked
              ? "border-amber-300 bg-amber-50 text-amber-700"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Flag size={16} />

          <span className="hidden xs:inline">
            {isMarked ? "Marked" : "Mark"}
          </span>
        </button>

        {/* Clear */}
        <button
          type="button"
          onClick={onClear}
          disabled={!hasAnswer}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={16} />

          <span className="hidden xs:inline">
            Clear
          </span>
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={onNext}
          disabled={isLastQuestion}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>{isLastQuestion ? "Last" : "Next"}</span>

          {!isLastQuestion && <ChevronRight size={17} />}
        </button>
      </div>
    </footer>
  );
}