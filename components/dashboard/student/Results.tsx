"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Search,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

export type StudentResultItem = {
  attemptId: string;
  testId: string;
  testName: string;
  examName: string;
  testType: "PRACTICE" | "MOCK" | "FULL_LENGTH" | "SUBJECT_WISE" | "TOPIC_WISE";

  attemptedAt: Date | string;

  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;

  totalMarks: number;
  marksObtained: number;
  positiveMarks: number;
  negativeMarks: number;
  percentage: number;
  accuracy: number;

  duration: number;
  timeTaken: number;
};

export type StudentResultSummary = {
  totalTestsAttempted: number;
  averagePercentage: number;
  bestScore: number;
  averageAccuracy: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
};

type ResultsProps = {
  results: StudentResultItem[];
  resultSummary: StudentResultSummary;
  onViewResult?: (result: StudentResultItem) => void;
};

function formatDate(value: Date | string) {
  const date = new Date(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

function getTestTypeLabel(type: StudentResultItem["testType"]) {
  switch (type) {
    case "FULL_LENGTH":
      return "Full Length";
    case "SUBJECT_WISE":
      return "Subject Wise";
    case "TOPIC_WISE":
      return "Topic Wise";
    case "PRACTICE":
      return "Practice";
    case "MOCK":
      return "Mock Test";
  }
}

function getPercentageClass(percentage: number) {
  if (percentage >= 75) {
    return "text-emerald-600";
  }

  if (percentage >= 50) {
    return "text-amber-600";
  }

  return "text-red-600";
}

export default function Results({
  results,
  resultSummary,
  onViewResult,
}: ResultsProps) {
  const [search, setSearch] = useState("");
  const [testType, setTestType] = useState<
    "ALL" | StudentResultItem["testType"]
  >("ALL");

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return results.filter((result) => {
      const matchesSearch =
        !query ||
        result.testName.toLowerCase().includes(query) ||
        result.examName.toLowerCase().includes(query);

      const matchesType = testType === "ALL" || result.testType === testType;

      return matchesSearch && matchesType;
    });
  }, [results, search, testType]);

  if (results.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            My Results
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track your test performance and progress.
          </p>
        </div>

        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-7 w-7 text-slate-400" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            No results yet
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Complete a test to see your score, accuracy and performance here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          My Results
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Track your test performance and progress.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Tests Completed"
          value={resultSummary.totalTestsAttempted.toString()}
          description="Completed attempts"
        />

        <StatCard
          icon={TrendingUp}
          label="Average Score"
          value={`${resultSummary.averagePercentage.toFixed(1)}%`}
          description="Average percentage"
        />

        <StatCard
          icon={Award}
          label="Best Score"
          value={resultSummary.bestScore.toFixed(1)}
          description="Highest marks obtained"
        />

        <StatCard
          icon={Target}
          label="Average Accuracy"
          value={`${resultSummary.averageAccuracy.toFixed(1)}%`}
          description="Answer accuracy"
        />
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={CheckCircle2}
          label="Correct Answers"
          value={resultSummary.totalCorrect}
          className="text-emerald-600"
        />

        <SummaryCard
          icon={XCircle}
          label="Incorrect Answers"
          value={resultSummary.totalIncorrect}
          className="text-red-600"
        />

        <SummaryCard
          icon={Target}
          label="Questions Attempted"
          value={resultSummary.totalAttempted}
          className="text-blue-600"
        />

        <SummaryCard
          icon={BarChart3}
          label="Questions Skipped"
          value={resultSummary.totalSkipped}
          className="text-amber-600"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search test or exam..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </div>

        <select
          value={testType}
          onChange={(event) =>
            setTestType(
              event.target.value as "ALL" | StudentResultItem["testType"],
            )
          }
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="ALL">All Test Types</option>
          <option value="MOCK">Mock Test</option>
          <option value="PRACTICE">Practice</option>
          <option value="FULL_LENGTH">Full Length</option>
          <option value="SUBJECT_WISE">Subject Wise</option>
          <option value="TOPIC_WISE">Topic Wise</option>
        </select>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Test History</h3>

          <span className="text-sm text-slate-500">
            {filteredResults.length} result
            {filteredResults.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Search className="mx-auto h-7 w-7 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No results found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          filteredResults.map((result) => (
            <ResultCard
              key={result.attemptId}
              result={result}
              onViewResult={onViewResult}
            />
          ))
        )}
      </div>
    </section>
  );
}

type StatCardProps = {
  icon: typeof FileText;
  label: string;
  value: string;
  description: string;
};

function StatCard({ icon: Icon, label, value, description }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Icon className="h-5 w-5 text-slate-600" />
        </div>
      </div>
    </div>
  );
}

type SummaryCardProps = {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  className: string;
};

function SummaryCard({
  icon: Icon,
  label,
  value,
  className,
}: SummaryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
        <Icon className={`h-5 w-5 ${className}`} />
      </div>

      <div>
        <p className="text-sm text-slate-500">{label}</p>

        <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

type ResultCardProps = {
  result: StudentResultItem;
  onViewResult?: (result: StudentResultItem) => void;
};

function ResultCard({ result, onViewResult }: ResultCardProps) {
  const scoreClass = getPercentageClass(result.percentage);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-sm">
      <div className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                {result.examName}
              </span>

              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                {getTestTypeLabel(result.testType)}
              </span>
            </div>

            <h4 className="mt-3 truncate text-base font-semibold text-slate-900">
              {result.testName}
            </h4>

            <p className="mt-1 text-xs text-slate-400">
              Attempted on {formatDate(result.attemptedAt)}
            </p>
          </div>

          <div className="lg:min-w-32 lg:text-right">
            <p className={`text-2xl font-bold ${scoreClass}`}>
              {result.percentage.toFixed(1)}%
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {result.marksObtained.toFixed(1)} / {result.totalMarks} marks
            </p>
          </div>

          <button
            type="button"
            onClick={() => onViewResult?.(result)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-4">
          <Metric
            icon={CheckCircle2}
            label="Correct"
            value={result.correct.toString()}
            className="text-emerald-600"
          />

          <Metric
            icon={XCircle}
            label="Incorrect"
            value={result.incorrect.toString()}
            className="text-red-600"
          />

          <Metric
            icon={Target}
            label="Accuracy"
            value={`${result.accuracy.toFixed(1)}%`}
            className="text-blue-600"
          />

          <Metric
            icon={Clock3}
            label="Time"
            value={formatTime(result.timeTaken)}
            className="text-amber-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50/70">
        <div className="border-r border-slate-100 px-4 py-3 text-center">
          <p className="text-xs text-slate-400">Questions</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {result.totalQuestions}
          </p>
        </div>

        <div className="border-r border-slate-100 px-4 py-3 text-center">
          <p className="text-xs text-slate-400">Attempted</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {result.attempted}
          </p>
        </div>

        <div className="px-4 py-3 text-center">
          <p className="text-xs text-slate-400">Skipped</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {result.skipped}
          </p>
        </div>
      </div>
    </article>
  );
}

type MetricProps = {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
  className: string;
};

function Metric({ icon: Icon, label, value, className }: MetricProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${className}`} />

      <div className="min-w-0">
        <p className="text-[11px] text-slate-400">{label}</p>

        <p className="text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}
