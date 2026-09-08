interface TestProgressProps {
  current: number;
  total: number;
}

export default function TestProgress({
  current,
  total,
}: TestProgressProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(
    Math.max(0, current),
    safeTotal,
  );

  const percentage = Math.round(
    (safeCurrent / safeTotal) * 100,
  );

  return (
    <div className="min-w-0 w-full">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="truncate text-[11px] font-medium text-slate-600 sm:text-xs">
          Question {safeCurrent} of {safeTotal}
        </span>

        <span className="shrink-0 text-[11px] font-semibold tabular-nums text-indigo-600 sm:text-xs">
          {percentage}%
        </span>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-label="Test progress"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-[width] duration-300 ease-out"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}