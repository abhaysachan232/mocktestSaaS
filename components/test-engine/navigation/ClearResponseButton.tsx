"use client";

import { RotateCcw } from "lucide-react";

interface ClearResponseButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export default function ClearResponseButton({
  disabled = false,
  onClick,
}: ClearResponseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <RotateCcw size={17} />
      Clear Response
    </button>
  );
}