"use client";

import {
  Bell,
  Search,
  LogOut,
} from "lucide-react";

interface Props {
  studentName?: string;
  onLogout: () => void;
}

export default function Header({
  studentName,
  onLogout,
}: Props) {
  return (
    <header className="mb-10">

      <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.08)] px-8 py-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* Left */}
          <div>

            <p className="text-slate-500 text-lg">
              Welcome Back 👋
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              {studentName}
            </h1>

            <p className="mt-3 text-slate-500">
              Track your progress, attempt tests and
              improve your ranking.
            </p>

          </div>

          {/* Right */}
          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="hidden md:flex items-center gap-3 h-14 w-80 rounded-2xl border border-slate-200 bg-slate-50 px-5">

              <Search
                size={20}
                className="text-slate-400"
              />

              <input
                placeholder="Search..."
                className="w-full bg-transparent outline-none"
              />

            </div>

            {/* Notification */}
            <button className="relative h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-blue-50 transition">

              <Bell size={22} />

              <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500"></span>

            </button>

            {/* Avatar */}
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">

              {studentName?.charAt(0)}

            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="h-14 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold flex items-center gap-2 shadow-lg hover:scale-[1.02] transition"
            >
              <LogOut size={18} />

              Logout
            </button>

          </div>

        </div>

      </div>

    </header>
  );
}