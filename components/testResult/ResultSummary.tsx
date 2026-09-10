import { CheckCircle2, Target, TrendingUp, XCircle } from "lucide-react";

type ResultSummaryProps = {
  testName: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  accuracy: number;
};

export default function ResultSummary({
  testName,
  score,
  totalMarks,
  correctCount,
  wrongCount,
  unattemptedCount,
  accuracy,
}: ResultSummaryProps) {
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-indigo-600">Result</p>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{testName}</h1>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-slate-900">{score}</span>
          <span className="text-sm font-medium text-slate-400">/ {totalMarks}</span>
          <span className="ml-2 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
          label="Correct"
          value={correctCount}
        />
        <StatCard
          icon={<XCircle className="h-5 w-5" />}
          iconClass="bg-red-50 text-red-600"
          label="Wrong"
          value={wrongCount}
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          iconClass="bg-slate-100 text-slate-500"
          label="Unattempted"
          value={unattemptedCount}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          iconClass="bg-violet-50 text-violet-600"
          label="Accuracy"
          value={`${accuracy}%`}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconClass,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
      <div className={`mb-2 inline-flex rounded-lg p-2 ${iconClass}`}>{icon}</div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
