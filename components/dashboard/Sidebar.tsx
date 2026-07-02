"use client";

import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Trophy,
  User,
} from "lucide-react";
import LogOutButton from "../ui/LogOutButton";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  coaching?: {
    name: string;
    logo: string;
  };
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
    icon: Trophy,
  },
  {
    key: "profile",
    label: "Profile",
    icon: User,
  },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  coaching,
}: Props) {
  return (
    <aside className="hidden lg:flex w-80 min-h-screen bg-white border-r border-slate-200 p-6 flex-col">
      <div className="rounded-[30px] bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">MockTest</h1>
        <p className="mt-2 text-blue-100">Student Portal</p>
      </div>

      {coaching && (
        <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <Image
              src={coaching.logo}
              alt={coaching.name}
              width={60}
              height={60}
              className="rounded-2xl object-cover border"
            />

            <div>
              <p className="text-sm text-slate-500">Joined Via</p>
              <h3 className="font-bold text-lg">{coaching.name}</h3>
            </div>
          </div>
        </div>
      )}

      <nav className="mt-10 space-y-3 flex-1">
        {menus.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 transition-all font-semibold ${
                active
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "hover:bg-blue-50 text-slate-700"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <LogOutButton />
    </aside>
  );
}