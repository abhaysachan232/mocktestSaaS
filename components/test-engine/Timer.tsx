"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3 } from "lucide-react";

type TimerProps = {
  expiresAt: string; // ISO date string
  onExpire: () => void;
};

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function Timer({ expiresAt, onExpire }: TimerProps) {
  // Derived purely from the prop — safe to compute during render.
  const target = useMemo(() => new Date(expiresAt).getTime(), [expiresAt]);
  const [remaining, setRemaining] = useState(() => target - Date.now());
  const hasExpired = useRef(false);

  useEffect(() => {
    // Reset in case expiresAt ever changes (e.g. resuming a different attempt).
    // Not calling setRemaining here directly — the interval's first tick
    // (within 1s) brings it in sync, keeping this effect a pure subscription.
    hasExpired.current = false;

    const interval = setInterval(() => {
      const diff = target - Date.now();
      setRemaining(diff);

      if (diff <= 0 && !hasExpired.current) {
        hasExpired.current = true;
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [target, onExpire]);

  const isCritical = remaining <= 5 * 60 * 1000; // last 5 minutes
  const isWarning = remaining <= 15 * 60 * 1000 && !isCritical;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold tabular-nums ${
        isCritical
          ? "border-red-200 bg-red-50 text-red-700"
          : isWarning
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      <Clock3 className="h-4 w-4" />
      {formatDuration(remaining)}
    </div>
  );
}