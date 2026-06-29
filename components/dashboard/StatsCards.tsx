"use client";

import {
  BookOpen,
  Trophy,
  Target,
  AlertTriangle,
} from "lucide-react";

interface Props {
  dashboard: any;
}

export default function StatsCards({
  dashboard,
}: Props) {

  const stats = [
    {
      title: "Tests Attempted",
      value:
        dashboard?.student
          ?.totalTests || 0,
      icon: BookOpen,
      color:
        "from-blue-500 to-indigo-600",
    },
    {
      title: "Average Score",
      value: `${dashboard?.student?.averageScore || 0}%`,
      icon: Target,
      color:
        "from-green-500 to-emerald-600",
    },
    {
      title: "Best Rank",
      value: `#${dashboard?.student?.bestRank || 0}`,
      icon: Trophy,
      color:
        "from-purple-500 to-violet-600",
    },
    {
      title: "Weak Subjects",
      value:
        dashboard?.student
          ?.weakSubjectsCount || 0,
      icon:
        AlertTriangle,
      color:
        "from-red-500 to-pink-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item) => {

        const Icon =
          item.icon;

        return (
          <div
            key={item.title}
            className="rounded-[30px] bg-white border border-slate-100 p-7 shadow-[0_15px_45px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-xl transition-all"
          >

            <div className="flex justify-between">

              <div>

                <p className="text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-4 text-5xl font-bold text-slate-900">
                  {item.value}
                </h2>

              </div>

              <div
                className={`h-16 w-16 rounded-3xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-lg`}
              >

                <Icon size={30} />

              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}