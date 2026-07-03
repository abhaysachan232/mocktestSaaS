"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import StatsCards from "./StatsCards";
import Tests from "./Tests";
import Results from "./Results";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";
import { useApi } from "@/lib/use-api";
import type { StudentDashboardData } from "@/services/dashboard.service";

export default function StudentDashboardPage() {
  // const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState("dashboard");

  const {
    data: student,
    loading,
    error,
  } = useApi<StudentDashboardData>("/api/dashboard/student");
  console.log("StudentDashboardPage", student);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          coaching={user?.coaching}
        />

        <main className="flex-1 p-8">
          <Header studentName={user?.name} />

          {activeTab === "dashboard" && <StatsCards dashboard={user} />}

          {activeTab === "tests" && <Tests tests={[]} />}

          {activeTab === "results" && <Results results={[]} />}

          {activeTab === "leaderboard" && <Leaderboard leaderboard={null} />}

          {activeTab === "profile" && <Profile profile={user} />}
        </main>
      </div>
    </div>
  );
}
