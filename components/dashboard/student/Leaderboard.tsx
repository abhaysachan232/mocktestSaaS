"use client";

import { useMemo, useState } from "react";
import {
  Award,
  ChevronDown,
  Crown,
  Medal,
  Minus,
  Trophy,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { ExamItem } from "./Tests";

export type LeaderboardEntry = {
  rank: number;
  studentId: string;
  studentName: string;
  avatarUrl?: string | null;
  coachingName?: string | null;
  score: number;
  totalTests?: number;
  isCurrentUser?: boolean;
  trend?: "UP" | "DOWN" | "SAME";
};

export type LeaderboardPeriod = "WEEKLY" | "MONTHLY" | "ALL_TIME";

export type LeaderboardData = {
  entries: LeaderboardEntry[];
  currentUserEntry?: LeaderboardEntry | null;
  period?: LeaderboardPeriod;
};

type LeaderboardProps = {
  leaderboard: LeaderboardData | null;
  exams?: ExamItem[];
  selectedExamId?: string;
  onExamChange?: (examId: string) => void;
  onPeriodChange?: (period: LeaderboardPeriod) => void;
};

const periodLabels: Record<LeaderboardPeriod, string> = {
  WEEKLY: "This Week",
  MONTHLY: "This Month",
  ALL_TIME: "All Time",
};

export default function Leaderboard({
  leaderboard,
  exams = [],
  selectedExamId = "ALL",
  onExamChange,
  onPeriodChange,
}: LeaderboardProps) {
  const [period, setPeriod] = useState<LeaderboardPeriod>(
    leaderboard?.period ?? "WEEKLY",
  );

  const handlePeriodChange = (value: LeaderboardPeriod) => {
    setPeriod(value);
    onPeriodChange?.(value);
  };

  const entries = leaderboard?.entries ?? [];
  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  const currentUserEntry = useMemo(() => {
    if (leaderboard?.currentUserEntry) return leaderboard.currentUserEntry;
    return entries.find((entry) => entry.isCurrentUser) ?? null;
  }, [leaderboard, entries]);

  const currentUserInTopList = entries.some((entry) => entry.isCurrentUser);

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <Trophy className="h-4 w-4" />
            Rankings
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Leaderboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
            See how you stack up against other students.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {(Object.keys(periodLabels) as LeaderboardPeriod[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePeriodChange(key)}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                  period === key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {periodLabels[key]}
              </button>
            ))}
          </div>

          {exams.length > 0 && (
            <div className="relative sm:w-56">
              <select
                value={selectedExamId}
                onChange={(event) => onExamChange?.(event.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="ALL">All Exams</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          )}
        </div>

        {entries.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Podium */}
            {topThree.length > 0 && (
              <div className="mb-6 grid grid-cols-3 items-end gap-3">
                {topThree[1] && (
                  <PodiumCard entry={topThree[1]} place={2} />
                )}

                {topThree[0] && (
                  <PodiumCard entry={topThree[0]} place={1} />
                )}

                {topThree[2] && (
                  <PodiumCard entry={topThree[2]} place={3} />
                )}
              </div>
            )}

            {/* Full ranked list */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {rest.map((entry) => (
                <RankRow key={entry.studentId} entry={entry} />
              ))}
            </div>

            {/* Sticky current-user rank if they're outside the visible list */}
            {currentUserEntry && !currentUserInTopList && (
              <div className="sticky bottom-4 mt-4">
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 shadow-md">
                  <RankRow entry={currentUserEntry} highlight />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function PodiumCard({
  entry,
  place,
}: {
  entry: LeaderboardEntry;
  place: 1 | 2 | 3;
}) {
  const heightClass =
    place === 1 ? "pt-2 pb-6" : place === 2 ? "pt-2 pb-4" : "pt-2 pb-3";

  const badgeClass =
    place === 1
      ? "bg-amber-100 text-amber-600 border-amber-300"
      : place === 2
        ? "bg-slate-100 text-slate-500 border-slate-300"
        : "bg-orange-100 text-orange-600 border-orange-300";

  return (
    <div
      className={`flex flex-col items-center rounded-2xl border bg-white px-3 shadow-sm ${heightClass} ${
        entry.isCurrentUser ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-200"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold ${badgeClass}`}
      >
        {place === 1 ? (
          <Crown className="h-6 w-6" />
        ) : (
          <Medal className="h-6 w-6" />
        )}
      </div>

      <p className="mt-2 line-clamp-1 text-center text-sm font-bold text-slate-900">
        {entry.studentName}
      </p>

      {entry.coachingName && (
        <p className="line-clamp-1 text-center text-[11px] text-slate-400">
          {entry.coachingName}
        </p>
      )}

      <p className="mt-1 text-base font-extrabold text-indigo-600">
        {entry.score}
      </p>

      <span className="mt-1 text-[11px] font-semibold text-slate-400">
        #{entry.rank}
      </span>
    </div>
  );
}

function RankRow({
  entry,
  highlight = false,
}: {
  entry: LeaderboardEntry;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0 ${
        highlight || entry.isCurrentUser ? "bg-indigo-50/60" : "bg-white"
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
        {entry.rank}
      </div>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
        {entry.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.avatarUrl}
            alt={entry.studentName}
            className="h-full w-full object-cover"
          />
        ) : (
          entry.studentName.charAt(0).toUpperCase()
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {entry.studentName}
          {entry.isCurrentUser && (
            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
              YOU
            </span>
          )}
        </p>

        {entry.coachingName && (
          <p className="truncate text-xs text-slate-400">
            {entry.coachingName}
          </p>
        )}
      </div>

      {entry.totalTests !== undefined && (
        <div className="hidden text-right sm:block">
          <p className="text-xs text-slate-400">Tests</p>
          <p className="text-sm font-semibold text-slate-700">
            {entry.totalTests}
          </p>
        </div>
      )}

      <TrendBadge trend={entry.trend} />

      <div className="w-16 shrink-0 text-right text-sm font-bold text-slate-900">
        {entry.score}
      </div>
    </div>
  );
}

function TrendBadge({ trend }: { trend?: LeaderboardEntry["trend"] }) {
  if (!trend || trend === "SAME") {
    return <Minus className="h-4 w-4 shrink-0 text-slate-300" />;
  }

  if (trend === "UP") {
    return <TrendingUp className="h-4 w-4 shrink-0 text-emerald-500" />;
  }

  return <TrendingDown className="h-4 w-4 shrink-0 text-red-500" />;
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Users className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900">
        No rankings yet
      </h3>

      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        Complete a test to appear on the leaderboard.
      </p>
    </div>
  );
}