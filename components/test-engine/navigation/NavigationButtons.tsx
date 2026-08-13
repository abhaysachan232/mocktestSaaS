"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function NavigationButtons({
  isFirstQuestion,
  isLastQuestion,
  onPrevious,
  onNext,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isLastQuestion}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        {!isLastQuestion && <ChevronRight size={18} />}
      </button>
    </div>
  );
}