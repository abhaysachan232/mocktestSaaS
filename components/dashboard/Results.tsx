"use client";

import { Trophy, TrendingUp, Calendar, Award } from "lucide-react";
import { ResultItem } from "./types";

interface Props {
  results: ResultItem[];
}

export default function Results({ results }: Props) {
  if (!results.length) {
    return (
      <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-16 text-center">
        <Award size={70} className="mx-auto text-blue-600" />

        <h2 className="mt-6 text-3xl font-bold text-slate-900">
          No Results Found
        </h2>

        <p className="mt-3 text-slate-500">
          Attempt a test to see your results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="rounded-[32px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <h2 className="text-4xl font-bold">My Results</h2>

        <p className="mt-3 text-blue-100">
          Check your latest performance and ranking.
        </p>
      </div>

      {/* Cards */}

      <div className="space-y-6">
        {results.map((item) => {
          const scoreColor =
            item.score >= 80
              ? "text-green-600"
              : item.score >= 60
                ? "text-yellow-600"
                : "text-red-600";

          return (
            <div
              key={item._id}
              className="rounded-[32px] bg-white border border-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                {/* Left */}

                <div className="flex items-start gap-5">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Trophy size={36} className="text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {item.test?.title}
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
                        <Calendar size={16} className="text-blue-600" />

                        <span className="text-sm font-medium">Total Marks</span>

                        <span className="font-bold">{item.totalMarks}</span>
                      </div>

                      <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2">
                        <TrendingUp size={16} className="text-indigo-600" />

                        <span className="text-sm font-medium">Performance</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right */}

                <div className="flex flex-wrap gap-5">
                  <div className="rounded-3xl bg-green-50 px-8 py-5 text-center min-w-[140px]">
                    <p className="text-sm text-slate-500">Score</p>

                    <h2 className={`mt-2 text-4xl font-bold ${scoreColor}`}>
                      {item.score}%
                    </h2>
                  </div>

                  <div className="rounded-3xl bg-yellow-50 px-8 py-5 text-center min-w-[140px]">
                    <p className="text-sm text-slate-500">Rank</p>

                    <h2 className="mt-2 text-4xl font-bold text-yellow-600">
                      #{item.rank}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Progress */}

              <div className="mt-8">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-slate-500">
                    Score Progress
                  </span>

                  <span className="font-semibold">{item.score}%</span>
                </div>

                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
                    style={{
                      width: `${item.score}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
