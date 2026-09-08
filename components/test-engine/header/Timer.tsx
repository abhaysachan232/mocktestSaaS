"use client";

import { Clock3 } from "lucide-react";

interface TimerProps {
  seconds: number;
  warningAt?: number;
}

function normalizeSeconds(value: number) {
  return Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;
}

function formatTime(totalSeconds: number) {
  const seconds = normalizeSeconds(totalSeconds);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0"),
    ].join(":");
  }

  return [
    String(minutes).padStart(2, "0"),
    String(remainingSeconds).padStart(2, "0"),
  ].join(":");
}

export default function Timer({
  seconds,
  warningAt = 300,
}: TimerProps) {
  const safeSeconds = normalizeSeconds(seconds);
  const isWarning = safeSeconds <= warningAt;

  return (
    <div
      className={[
        "flex shrink-0 items-center",
        "gap-1.5 sm:gap-2",
        "rounded-lg sm:rounded-xl",
        "border",
        "px-2 py-1.5 sm:px-3 sm:py-2",
        "transition-colors",
        isWarning
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-indigo-100 bg-indigo-50 text-indigo-700",
      ].join(" ")}
    >
      <Clock3
        className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]"
        aria-hidden="true"
      />

      <div className="min-w-[45px] leading-none sm:min-w-[58px]">
        <span className="hidden text-[10px] font-medium sm:block">
          Time Left
        </span>

        <time
          className="block text-xs font-bold tabular-nums sm:text-base"
          dateTime={`PT${safeSeconds}S`}
          aria-label={`Time remaining ${formatTime(safeSeconds)}`}
        >
          {formatTime(safeSeconds)}
        </time>
      </div>
    </div>
  );
}