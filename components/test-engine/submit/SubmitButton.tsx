"use client";

import { CheckCircle2 } from "lucide-react";

interface SubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export default function SubmitButton({
  onClick,
  disabled = false,
  label = "Submit Test",
}: SubmitButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <CheckCircle2 size={18} />
      {label}
    </button>
  );
}