"use client";

import { Flag } from "lucide-react";

interface MarkForReviewButtonProps {
  isMarked: boolean;
  onClick: () => void;
}

export default function MarkForReviewButton({
  isMarked,
  onClick,
}: MarkForReviewButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isMarked}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
        isMarked
          ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Flag
        size={17}
        className={isMarked ? "fill-current" : ""}
      />

      {isMarked ? "Marked for Review" : "Mark for Review"}
    </button>
  );
}