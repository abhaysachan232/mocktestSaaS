"use client";

import {
  Clock3,
  BookOpen,
  Crown,
  Play,
  ArrowRight,
} from "lucide-react";

import { Test } from "./types";

interface Props {
  tests: Test[];
}

export default function Tests({
  tests,
}: Props) {
  if (!tests.length) {
    return (
      <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-16 text-center">

        <BookOpen
          size={70}
          className="mx-auto text-blue-500"
        />

        <h2 className="mt-6 text-3xl font-bold text-slate-900">
          No Tests Available
        </h2>

        <p className="mt-3 text-slate-500">
          Your coaching has not assigned
          any test yet.
        </p>

      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

      {tests.map((test) => (
        <div
          key={test._id}
          className="group relative overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >

          {/* Gradient Top */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

          <div className="p-8">

            {/* Premium Badge */}
            <div className="flex items-start justify-between">

              <div className="h-16 w-16 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">

                <BookOpen
                  size={28}
                  className="text-white"
                />

              </div>

              {test.isPremium && (
                <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">

                  <Crown size={16} />

                  Premium

                </div>
              )}

            </div>

            {/* Title */}
            <h2 className="mt-7 text-2xl font-bold text-slate-900 line-clamp-2">

              {test.title}

            </h2>

            {/* Description */}
            <p className="mt-4 line-clamp-3 text-slate-500 leading-7">

              {test.description}

            </p>

            {/* Stats */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">

                <div className="flex items-center gap-3">

                  <BookOpen
                    size={18}
                    className="text-blue-600"
                  />

                  <span className="text-slate-600">

                    Questions

                  </span>

                </div>

                <span className="font-bold text-slate-900">

                  {test.totalQuestions}

                </span>

              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">

                <div className="flex items-center gap-3">

                  <Clock3
                    size={18}
                    className="text-indigo-600"
                  />

                  <span className="text-slate-600">

                    Duration

                  </span>

                </div>

                <span className="font-bold text-slate-900">

                  {test.duration} mins

                </span>

              </div>

            </div>

            {/* Button */}
            <button className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">

              <Play size={18} />

              Start Test

              <ArrowRight size={18} />

            </button>

          </div>

        </div>
      ))}

    </div>
  );
}