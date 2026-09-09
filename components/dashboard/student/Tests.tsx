"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileQuestion,
  Filter,
  IndianRupee,
  Languages,
  Play,
  Search,
  SlidersHorizontal,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";

export type TestItem = {
  id: string;
  title: string;
  exam: {
    id: string;
    name: string;
  };
  subject?: {
    id: string;
    name: string;
  } | null;
  type:
    | "MOCK_TEST"
    | "PRACTICE"
    | "PREVIOUS_YEAR"
    | "SECTIONAL"
    | "FULL_LENGTH";
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  questions: number;
  duration: number;
  totalMarks: number;
  language?: string;
  isFree: boolean;
  price?: number | null;
  attempts?: number;
  lastScore?: number | null;
  bestScore?: number | null;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
};

export type ExamItem = {
  id: string;
  name: string;
};

type TestsProps = {
  tests: TestItem[];
  exams?: ExamItem[];
  onStartTest?: (test: TestItem) => void;
  onContinueTest?: (test: TestItem) => void;
  onViewResult?: (test: TestItem) => void;
};

const testTypeLabels: Record<TestItem["type"], string> = {
  MOCK_TEST: "Mock Test",
  PRACTICE: "Practice",
  PREVIOUS_YEAR: "Previous Year",
  SECTIONAL: "Sectional",
  FULL_LENGTH: "Full Length",
};

const difficultyLabels: Record<NonNullable<TestItem["difficulty"]>, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

const getDifficultyClass = (difficulty?: TestItem["difficulty"]) => {
  switch (difficulty) {
    case "EASY":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "HARD":
      return "bg-red-50 text-red-700 border-red-200";

    case "MEDIUM":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

export default function Tests({
  tests,
  exams = [],
  onStartTest,
  onContinueTest,
  onViewResult,
}: TestsProps) {
  const [search, setSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const availableExams = useMemo(() => {
    if (exams.length > 0) {
      return exams;
    }

    const map = new Map<string, ExamItem>();

    tests.forEach((test) => {
      if (!map.has(test.exam.id)) {
        map.set(test.exam.id, {
          id: test.exam.id,
          name: test.exam.name,
        });
      }
    });

    return Array.from(map.values());
  }, [exams, tests]);

  const filteredTests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tests.filter((test) => {
      const matchesSearch =
        !query ||
        test.title.toLowerCase().includes(query) ||
        test.exam.name.toLowerCase().includes(query) ||
        test.subject?.name.toLowerCase().includes(query);

      const matchesExam =
        selectedExam === "ALL" || test.exam.id === selectedExam;

      const matchesType = selectedType === "ALL" || test.type === selectedType;

      const matchesDifficulty =
        selectedDifficulty === "ALL" || test.difficulty === selectedDifficulty;

      const matchesStatus =
        selectedStatus === "ALL" || test.status === selectedStatus;

      return (
        matchesSearch &&
        matchesExam &&
        matchesType &&
        matchesDifficulty &&
        matchesStatus
      );
    });
  }, [
    tests,
    search,
    selectedExam,
    selectedType,
    selectedDifficulty,
    selectedStatus,
  ]);

  const hasActiveFilters =
    selectedExam !== "ALL" ||
    selectedType !== "ALL" ||
    selectedDifficulty !== "ALL" ||
    selectedStatus !== "ALL";

  const clearFilters = () => {
    setSelectedExam("ALL");
    setSelectedType("ALL");
    setSelectedDifficulty("ALL");
    setSelectedStatus("ALL");
    setSearch("");
  };

  const handleTestAction = (test: TestItem) => {
    if (test.status === "COMPLETED") {
      onViewResult?.(test);
      return;
    }

    if (test.status === "IN_PROGRESS") {
      onContinueTest?.(test);
      return;
    }

    onStartTest?.(test);
  };

  const completedTests = tests.filter(
    (test) => test.status === "COMPLETED",
  ).length;

  const inProgressTests = tests.filter(
    (test) => test.status === "IN_PROGRESS",
  ).length;

  const freeTests = tests.filter((test) => test.isFree).length;

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
                <Zap className="h-4 w-4" />
                Test Center
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Tests & Mock Tests
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                Practice with mock tests, previous year papers and subject-wise
                tests for your exams.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <FileQuestion className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Available
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {tests.length}
            </p>

            <p className="text-xs text-slate-500">Total tests</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Clock3 className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Continue
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {inProgressTests}
            </p>

            <p className="text-xs text-slate-500">In progress</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Completed
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {completedTests}
            </p>

            <p className="text-xs text-slate-500">Tests completed</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                <Trophy className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">Free</span>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {freeTests}
            </p>

            <p className="text-xs text-slate-500">Free tests</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tests, exams or subjects..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition ${
                showFilters || hasActiveFilters
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white">
                  {
                    [
                      selectedExam !== "ALL",
                      selectedType !== "ALL",
                      selectedDifficulty !== "ALL",
                      selectedStatus !== "ALL",
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2 lg:grid-cols-4">
              <FilterSelect
                label="Exam"
                value={selectedExam}
                onChange={setSelectedExam}
                options={[
                  { value: "ALL", label: "All Exams" },
                  ...availableExams.map((exam) => ({
                    value: exam.id,
                    label: exam.name,
                  })),
                ]}
              />

              <FilterSelect
                label="Test Type"
                value={selectedType}
                onChange={setSelectedType}
                options={[
                  { value: "ALL", label: "All Types" },
                  ...Object.entries(testTypeLabels).map(([value, label]) => ({
                    value,
                    label,
                  })),
                ]}
              />

              <FilterSelect
                label="Difficulty"
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
                options={[
                  { value: "ALL", label: "All Levels" },
                  ...Object.entries(difficultyLabels).map(([value, label]) => ({
                    value,
                    label,
                  })),
                ]}
              />

              <FilterSelect
                label="Status"
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: "ALL", label: "All Status" },
                  { value: "NOT_STARTED", label: "Not Started" },
                  { value: "IN_PROGRESS", label: "In Progress" },
                  { value: "COMPLETED", label: "Completed" },
                ]}
              />
            </div>
          )}
        </div>

        {/* Exam Categories */}
        {availableExams.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Browse by Exam
              </h2>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              <ExamPill
                active={selectedExam === "ALL"}
                name="All Exams"
                count={tests.length}
                onClick={() => setSelectedExam("ALL")}
              />

              {availableExams.map((exam) => {
                const count = tests.filter(
                  (test) => test.exam.id === exam.id,
                ).length;

                return (
                  <ExamPill
                    key={exam.id}
                    active={selectedExam === exam.id}
                    name={exam.name}
                    count={count}
                    onClick={() => setSelectedExam(exam.id)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">All Tests</h2>

            <p className="text-sm text-slate-500">
              Showing {filteredTests.length} of {tests.length} tests
            </p>
          </div>
        </div>

        {/* Test List */}
        {filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredTests.map((test) => (
              <TestCard key={test.id} test={test} onAction={handleTestAction} />
            ))}
          </div>
        ) : (
          <EmptyState
            hasFilters={Boolean(search) || hasActiveFilters}
            onClear={clearFilters}
          />
        )}
      </div>
    </section>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
};

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

type ExamPillProps = {
  active: boolean;
  name: string;
  count: number;
  onClick: () => void;
};

function ExamPill({ active, name, count, onClick }: ExamPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
      }`}
    >
      <span>{name}</span>

      <span
        className={`rounded-full px-2 py-0.5 text-[11px] ${
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

type TestCardProps = {
  test: TestItem;
  onAction: (test: TestItem) => void;
};

function TestCard({ test, onAction }: TestCardProps) {
  const score = test.bestScore ?? test.lastScore ?? null;

  const isCompleted = test.status === "COMPLETED";
  const isInProgress = test.status === "IN_PROGRESS";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="p-5">
        {/* Top */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-indigo-600">
                  {test.exam.name}
                </span>

                {test.subject?.name && (
                  <>
                    <span className="text-slate-300">•</span>

                    <span className="text-xs text-slate-500">
                      {test.subject.name}
                    </span>
                  </>
                )}
              </div>

              <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-900">
                {test.title}
              </h3>
            </div>
          </div>

          {test.isFree ? (
            <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
              FREE
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
              <IndianRupee className="h-3 w-3" />
              {test.price ?? 0}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {testTypeLabels[test.type]}
          </span>

          {test.difficulty && (
            <span
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${getDifficultyClass(
                test.difficulty,
              )}`}
            >
              {difficultyLabels[test.difficulty]}
            </span>
          )}
        </div>

        {/* Test Info */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoItem
            icon={<FileQuestion className="h-4 w-4" />}
            label="Questions"
            value={String(test.questions)}
          />

          <InfoItem
            icon={<Clock3 className="h-4 w-4" />}
            label="Duration"
            value={`${test.duration} min`}
          />

          <InfoItem
            icon={<Target className="h-4 w-4" />}
            label="Marks"
            value={String(test.totalMarks)}
          />

          <InfoItem
            icon={<Languages className="h-4 w-4" />}
            label="Language"
            value={test.language || "English"}
          />
        </div>

        {/* Progress / Score */}
        {(isInProgress || isCompleted || score !== null) && (
          <div className="mt-5 rounded-xl bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                {isInProgress && (
                  <p className="text-xs font-medium text-amber-600">
                    Test in progress
                  </p>
                )}

                {isCompleted && (
                  <p className="text-xs font-medium text-emerald-600">
                    Test completed
                  </p>
                )}

                {!isInProgress && !isCompleted && score !== null && (
                  <p className="text-xs font-medium text-slate-500">
                    Best score
                  </p>
                )}

                {score !== null && (
                  <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {score}/{test.totalMarks}
                  </p>
                )}
              </div>

              {test.attempts !== undefined && (
                <div className="text-right">
                  <p className="text-xs text-slate-400">Attempts</p>

                  <p className="text-sm font-semibold text-slate-700">
                    {test.attempts}
                  </p>
                </div>
              )}
            </div>

            {isInProgress && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[45%] rounded-full bg-indigo-600" />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="text-xs text-slate-400">
            {test.attempts !== undefined
              ? `${test.attempts} ${
                  test.attempts === 1 ? "attempt" : "attempts"
                }`
              : "Not attempted"}
          </div>

          <button
            type="button"
            onClick={() => onAction(test)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              isCompleted
                ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : isInProgress
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isCompleted ? (
              <>
                <Trophy className="h-4 w-4" />
                View Result
              </>
            ) : isInProgress ? (
              <>
                <Play className="h-4 w-4" />
                Continue
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Test
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="shrink-0 text-slate-400">{icon}</div>

      <div className="min-w-0">
        <p className="truncate text-[11px] text-slate-400">{label}</p>

        <p className="truncate text-xs font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

type EmptyStateProps = {
  hasFilters: boolean;
  onClear: () => void;
};

function EmptyState({ hasFilters, onClear }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Filter className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900">
        {hasFilters ? "No tests found" : "No tests available"}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {hasFilters
          ? "Try changing your search or filters to find available tests."
          : "Tests will appear here once they are available for students."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
