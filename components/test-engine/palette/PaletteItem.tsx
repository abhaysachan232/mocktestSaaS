"use client";

export type PaletteStatus =
  | "current"
  | "answered"
  | "marked"
  | "answered-marked"
  | "visited"
  | "not-visited";

interface PaletteItemProps {
  number: number;
  status: PaletteStatus;
  onClick: () => void;
}

export default function PaletteItem({
  number,
  status,
  onClick,
}: PaletteItemProps) {
  const styles: Record<PaletteStatus, string> = {
    current:
      "border-indigo-600 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200",
    answered:
      "border-emerald-500 bg-emerald-500 text-white",
    marked:
      "border-amber-500 bg-amber-500 text-white",
    "answered-marked":
      "border-purple-500 bg-purple-500 text-white",
    visited:
      "border-slate-300 bg-slate-100 text-slate-700",
    "not-visited":
      "border-slate-200 bg-white text-slate-500",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Question ${number}`}
      aria-current={status === "current" ? "true" : undefined}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition-all hover:scale-105 ${styles[status]}`}
    >
      {number}
    </button>
  );
}