"use client";

import {
  LayoutDashboard,
  FileText,
  Trophy,
  Medal,
  User,
} from "lucide-react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menus = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "tests",
    label: "Tests",
    icon: FileText,
  },
  {
    key: "results",
    label: "Results",
    icon: Trophy,
  },
  {
    key: "leaderboard",
    label: "Leaderboard",
    icon: Medal,
  },
  {
    key: "profile",
    label: "Profile",
    icon: User,
  },
];

export default function CategoryNavigation({
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b shadow-sm">

      <div className="flex justify-center md:justify-center overflow-x-auto overflow-y-hidden px-2 py-2 gap-2 snap-x snap-mandatory">

        {menus.map((item) => {

          const Icon = item.icon;
          const active = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className="relative flex min-w-[82px] flex-shrink-0 snap-start flex-col items-center justify-center"
            >

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <span
                className={`mt-2 text-xs font-medium text-center leading-4 ${
                  active
                    ? "text-black"
                    : "text-slate-600"
                }`}
              >
                {item.label}
              </span>

              {active && (
                <div className="mt-2 h-1 w-12 rounded-full bg-blue-600" />
              )}

            </button>
          );

        })}

      </div>

    </div>
  );
}