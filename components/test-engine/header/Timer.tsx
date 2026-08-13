"use client";

import { Clock3 } from "lucide-react";

interface TimerProps {
  seconds: number;
  warningAt?: number;
}

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
}

export default function Timer({
  seconds,
  warningAt = 300,
}: TimerProps) {
  const isWarning = seconds <= warningAt;

  return (
    <div
      className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 ${
        isWarning
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-indigo-100 bg-indigo-50 text-indigo-700"
      }`}
    >
      <Clock3 size={18} />

      <div className="leading-none">
        <p className="hidden text-[10px] font-medium sm:block">
          Time Left
        </p>

        <p className="text-sm font-bold tabular-nums sm:text-base">
          {formatTime(Math.max(0, seconds))}
        </p>
      </div>
    </div>
  );
}