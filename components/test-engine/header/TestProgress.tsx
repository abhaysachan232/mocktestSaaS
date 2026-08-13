interface TestProgressProps {
  current: number;
  total: number;
}

export default function TestProgress({
  current,
  total,
}: TestProgressProps) {
  const safeTotal = Math.max(total, 1);
  const percentage = Math.min(
    100,
    Math.round((current / safeTotal) * 100)
  );

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600 sm:text-sm">
          Question {current} of {total}
        </span>

        <span className="text-xs font-semibold text-indigo-600">
          {percentage}%
        </span>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}