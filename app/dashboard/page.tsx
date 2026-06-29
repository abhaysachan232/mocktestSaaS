"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import Tests from "@/components/dashboard/Tests";
import Results from "@/components/dashboard/Results";
import Leaderboard from "@/components/dashboard/Leaderboard";
import Profile from "@/components/dashboard/Profile";
import Loading from "@/components/dashboard/Loading";

import {
  DashboardData,
  Test,
  ResultItem,
  Leaderboard as LeaderboardType,
  Profile as ProfileType,
} from "@/components/dashboard/types";

export default function DashboardPage() {

  const [loading,setLoading]=useState(true);

  const [activeTab,setActiveTab]=
    useState("dashboard");

  const [dashboard,setDashboard]=
    useState<DashboardData|null>(null);

  const [tests,setTests]=
    useState<Test[]>([]);

  const [results,setResults]=
    useState<ResultItem[]>([]);

  const [leaderboard,setLeaderboard]=
    useState<LeaderboardType|null>(null);

  const [profile,setProfile]=
    useState<ProfileType|null>(null);

  useEffect(()=>{

    async function load(){

      const [
        dashboardRes,
        testsRes,
        resultsRes,
        leaderboardRes,
        profileRes,
      ]=await Promise.all([

        fetch("/api/dashboard",{
          credentials:"include",
        }),

        fetch("/api/student/tests",{
          credentials:"include",
        }),

        fetch("/api/student/results",{
          credentials:"include",
        }),

        fetch("/api/student/leaderboard",{
          credentials:"include",
        }),

        fetch("/api/student/profile",{
          credentials:"include",
        }),

      ]);

      const dashboardJson=
        await dashboardRes.json();

      const testsJson=
        await testsRes.json();

      const resultsJson=
        await resultsRes.json();

      const leaderboardJson=
        await leaderboardRes.json();

      const profileJson=
        await profileRes.json();

      setDashboard(dashboardJson.data);

      setTests(
        testsJson.tests||[]
      );

      setResults(
        resultsJson.results||[]
      );

      setLeaderboard(
        leaderboardJson
      );

      setProfile(
        profileJson.profile
      );

      setLoading(false);

    }

    void load();

  },[]);

  async function handleLogout(){

    await fetch("/api/logout",{
      method:"POST",
      credentials:"include",
    });

    window.location.href="/";

  }

  if(loading){
    return <Loading />;
  }

  return(

<div className="min-h-screen bg-slate-50">

<div className="flex">

<Sidebar

activeTab={activeTab}

setActiveTab={setActiveTab}

coaching={dashboard?.coaching}

onLogout={handleLogout}

/>

<div className="flex-1 p-8">

<Header

studentName={
dashboard?.student.name
}

onLogout={handleLogout}

/>

{activeTab==="dashboard" && (

<StatsCards

dashboard={dashboard}

/>

)}

{activeTab==="tests" && (

<Tests

tests={tests}

/>

)}

{activeTab==="results" && (

<Results

results={results}

/>

)}

{activeTab==="leaderboard" && (

<Leaderboard

leaderboard={leaderboard}

/>

)}

{activeTab==="profile" && (

<Profile

profile={profile}

/>

)}

</div>

</div>

</div>

  );

}