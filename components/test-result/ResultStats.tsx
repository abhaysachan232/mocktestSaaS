interface ResultStatsProps {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
  timeTaken: number;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

export default function ResultStats({
  totalQuestions,
  attempted,
  correct,
  incorrect,
  skipped,
  accuracy,
  timeTaken,
}: ResultStatsProps) {
  const stats = [
    {
      label: "Total Questions",
      value: totalQuestions,
    },
    {
      label: "Attempted",
      value: attempted,
    },
    {
      label: "Correct",
      value: correct,
    },
    {
      label: "Incorrect",
      value: incorrect,
    },
    {
      label: "Skipped",
      value: skipped,
    },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
    },
    {
      label: "Time Taken",
      value: formatTime(timeTaken),
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500">{stat.label}</p>

          <p className="mt-2 text-xl font-bold text-slate-900">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
