"use client";

import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Tests from "./Tests";
import Results from "./Results";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";

import { useApi } from "@/lib/use-api";
import type { StudentDashboardData } from "@/services/dashboard.service";

export default function StudentDashboardPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data, loading, error } = useApi<StudentDashboardData>(
    "/api/dashboard/student",
  );
  const user = session?.user;
  console.log("StudentDashboardPage", data, loading, error, user);

  // const stats = [
  //   {
  //     title: "Tests Attempted",
  //     value: 0,
  //     icon: BookOpen,
  //     iconBg: "bg-green-100",
  //     iconColor: "from-blue-500 to-indigo-600",
  //   },
  //   {
  //     title: "Average Score",
  //     value: `${0}%`,
  //     icon: Target,
  //     iconBg: "bg-orange-100",
  //     iconColor: "from-green-500 to-emerald-600",
  //   },
  //   {
  //     title: "Best Rank",
  //     value: `#${0}`,
  //     icon: Trophy,
  //     iconBg: "bg-purple-100",
  //     iconColor: "from-purple-500 to-violet-600",
  //   },
  //   {
  //     title: "Weak Subjects",
  //     value: 0,
  //     icon: AlertTriangle,
  //     iconBg: "bg-blue-100",
  //     iconColor: "from-red-500 to-pink-600",
  //   },
  // ];

  const activeContent = useMemo(() => {
    switch (activeTab) {
      // case "dashboard":
      //   return <StatsGrid stats={stats} />;

      case "tests":
        return <Tests tests={[]} />;

      case "results":
        return <Results results={[]} />;

      case "leaderboard":
        return <Leaderboard leaderboard={null} />;

      case "profile":
        return <Profile profile={user} />;

      default:
        return null;
    }
  }, [activeTab, user]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          coaching={data?.coaching}
        />

        <main className="flex-1 p-8">
          <Header studentName={data?.name} />
          {activeContent}
        </main>
      </div>
    </div>
  );
}
