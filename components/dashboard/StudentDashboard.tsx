"use client";

import { useMemo, useState } from "react";
import CategoryPage from "./CategoryPage";
import Tests from "./Tests";
import Results from "./Results";
import Leaderboard from "./Leaderboard";
// import Profile from "./Profile";

type Props = {
  userId: string;
  data: any;
};

export default function StudentDashboardPage({ userId, data }: Props) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const activeContent = useMemo(() => {
    switch (activeTab) {
      case "tests":
        return <Tests tests={[]} />;

      case "results":
        return <Results results={[]} />;

      case "leaderboard":
        return <Leaderboard leaderboard={null} />;

      // case "profile":
      //   return <Profile profile={data?.user ?? null} />;

      case "dashboard":
      default:
        return (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">
              Welcome, {data?.name}
            </h2>

            <p className="mt-2 text-slate-500">
              Select any option above to continue.
            </p>
          </div>
        );
    }
  }, [activeTab, data?.name]); // [activeTab, user, data?.name, data?.user]

  // if (status === "loading" || loading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
  //       Loading Dashboard...
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <p className="text-red-500">{error}</p>
  //     </div>
  //   );
  // }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* Header */}
      {/* <Header studentName={data?.name} /> */}

      {/* Flipkart Style Category Navigation */}
      <CategoryPage
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Content */}
      <section className="p-4 sm:p-5 md:p-6 lg:p-8">
        {activeContent}
      </section>

    </main>
  );
}