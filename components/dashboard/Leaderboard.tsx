"use client";

import {
  Crown,
  Trophy,
  Medal,
  Award,
  TrendingUp,
} from "lucide-react";

import { Leaderboard } from "./types";

interface Props {
  leaderboard: Leaderboard | null;
}

export default function Leaderboard({
  leaderboard,
}: Props) {

  if (!leaderboard) {
    return (
      <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-16 text-center">

        <Trophy
          size={70}
          className="mx-auto text-blue-600"
        />

        <h2 className="mt-6 text-3xl font-bold">
          Leaderboard Not Available
        </h2>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Hero */}

      <div className="rounded-[32px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 text-white shadow-xl">

        <div className="flex items-center gap-5">

          <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">

            <Crown size={40} />

          </div>

          <div>

            <h2 className="text-4xl font-bold">
              Leaderboard
            </h2>

            <p className="mt-2 text-blue-100">
              Compete with the best students.
            </p>

          </div>

        </div>

      </div>

      {/* Summary */}

      <div className="grid md:grid-cols-2 gap-8">

        <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">

          <p className="text-slate-500">
            Your Current Rank
          </p>

          <h2 className="mt-4 text-6xl font-bold text-blue-600">

            #{leaderboard.studentRank}

          </h2>

        </div>

        <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">

          <p className="text-slate-500">
            Total Students
          </p>

          <h2 className="mt-4 text-6xl font-bold text-indigo-600">

            {leaderboard.totalStudents}

          </h2>

        </div>

      </div>

      {/* Top Students */}

      <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">

        <h2 className="text-3xl font-bold mb-8">

          🏆 Top Students

        </h2>

        <div className="space-y-5">

          {leaderboard.topStudents.map(
            (student, index) => {

              const icon =
                index === 0 ? (
                  <Crown className="text-yellow-500" />
                ) : index === 1 ? (
                  <Medal className="text-slate-400" />
                ) : (
                  <Award className="text-orange-500" />
                );

              return (

                <div
                  key={student._id}
                  className="flex items-center justify-between rounded-3xl bg-slate-50 px-6 py-5 hover:bg-blue-50 transition"
                >

                  <div className="flex items-center gap-5">

                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">

                      {index + 1}

                    </div>

                    <div>

                      <h3 className="font-bold text-lg">

                        {student.student.name}

                      </h3>

                      <p className="text-slate-500">

                        Top Performer

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    {icon}

                    <span className="text-2xl font-bold text-blue-600">

                      {student.score}%

                    </span>

                  </div>

                </div>

              );

            }
          )}

        </div>

      </div>

      {/* Nearby */}

      <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">

        <h2 className="text-3xl font-bold mb-8">

          Students Near You

        </h2>

        <div className="space-y-5">

          {leaderboard.nearbyStudents.map(
            (student, index) => (

              <div
                key={student._id}
                className="flex justify-between items-center rounded-3xl border border-slate-100 px-6 py-5 hover:shadow-lg transition"
              >

                <div>

                  <h3 className="font-bold">

                    {student.student.name}

                  </h3>

                  <p className="text-slate-500">

                    Nearby Rank

                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <TrendingUp
                    className="text-blue-600"
                  />

                  <span className="text-xl font-bold">

                    {student.score}%

                  </span>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}