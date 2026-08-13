"use client";

interface OptionCardProps {
  optionId: string;
  label: string;
  text: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: (optionId: string) => void;
}

export default function OptionCard({
  optionId,
  label,
  text,
  selected,
  disabled = false,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(optionId)}
      disabled={disabled}
      aria-pressed={selected}
      className={`group flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 sm:p-4 ${
        selected
          ? "border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-500"
          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "active:scale-[0.995]"
      }`}
    >
      {/* Option Label */}
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition ${
          selected
            ? "border-indigo-600 bg-indigo-600 text-white"
            : "border-slate-300 bg-slate-50 text-slate-700 group-hover:border-indigo-400 group-hover:text-indigo-600"
        }`}
      >
        {label}
      </span>

      {/* Option Text */}
      <span
        className={`pt-1 text-sm leading-6 sm:text-base ${
          selected
            ? "font-medium text-indigo-950"
            : "text-slate-700"
        }`}
      >
        {text}
      </span>
    </button>
  );
}