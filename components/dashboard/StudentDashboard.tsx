"use client";

import { useMemo, useState } from "react";
import CategoryPage from "./CategoryPage";
import Tests, { ExamItem, TestItem } from "./student/Tests";
import Results, { StudentResultItem, StudentResultSummary } from "./student/Results";
import Leaderboard from "./Leaderboard";
import Profile, { ProfileProps } from "./student/Profile";

interface studentDashboardProps extends ProfileProps {
  exams: ExamItem[];
  tests: TestItem[];
  results: StudentResultItem[];
  resultSummary: StudentResultSummary;
}

type Props = {
  data: studentDashboardProps;
};

export default function StudentDashboardPage({ data }: Props) {
  console.log(data);
  const { student, coachings, exams, tests, results, resultSummary } = data;
  const [activeTab, setActiveTab] = useState("dashboard");

  const activeContent = useMemo(() => {
    switch (activeTab) {
      case "tests":
        return (
          <Tests
            tests={tests}
            exams={exams}
            onStartTest={(test) => {
              // router.push(`/test/${test.id}`);
              console.log(test);
            }}
            onContinueTest={(test) => {
              // router.push(`/test/${test.id}`);
              console.log(test);
            }}
            onViewResult={(test) => {
              // router.push(`/test/${test.id}/result`);
              console.log(test);
            }}
          />
        );

      case "results":
        return (
          <Results
            results={results}
            resultSummary={resultSummary}
            onViewResult={(result) => {
              console.log(result);
            }}
          />
        );

      case "leaderboard":
        return <Leaderboard leaderboard={null} />;

      case "profile":
        return <Profile student={student} coachings={coachings} />;

      case "dashboard":
      default:
        return (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Welcome, {data.student.name}</h2>

            <p className="mt-2 text-slate-500">
              Select any option above to continue.
            </p>
          </div>
        );
    }
  }, [activeTab, data.student.name, student, coachings, exams, tests, results, resultSummary]); // [activeTab, user, data?.name, data?.user]

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}
      {/* <Header studentName={data?.name} /> */}

      {/* Flipkart Style Category Navigation */}
      <CategoryPage activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <section className="p-4 sm:p-5 md:p-6 lg:p-8">{activeContent}</section>
    </main>
  );
}
