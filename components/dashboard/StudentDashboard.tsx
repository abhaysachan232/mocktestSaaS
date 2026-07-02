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

export default function StudentDashboard() {
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState("dashboard");

  if (status === "loading") {
    return <div>Loading...</div>;
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

          {activeTab === "dashboard" && (
            <StatsCards dashboard={user} />
          )}

          {activeTab === "tests" && (
            <Tests tests={[]} />
          )}

          {activeTab === "results" && (
            <Results results={[]} />
          )}

          {activeTab === "leaderboard" && (
            <Leaderboard leaderboard={null} />
          )}

          {activeTab === "profile" && (
            <Profile profile={user} />
          )}
        </main>
      </div>
    </div>
  );
}