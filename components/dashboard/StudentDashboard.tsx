"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { startTestAttempt } from "@/lib/actions/test-engine.actions";
import CategoryPage from "./CategoryPage";
import Tests, { ExamItem, TestItem } from "./student/Tests";
import Results, {
  StudentResultItem,
  StudentResultSummary,
} from "./student/Results";
import Leaderboard from "./Leaderboard";
import Profile, { ProfileProps } from "./student/Profile";
import ResultView from "../testResult/ResultView";

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
  const [, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { student, coachings, exams, tests, results, resultSummary } = data;
  const [activeTab, setActiveTab] = useState("dashboard");

  // When set, the dashboard shows ResultView instead of the active tab's
  // normal content — no route change, just an in-place panel swap.
  const [viewingAttemptId, setViewingAttemptId] = useState<string | null>(
    null,
  );

  const openResult = (attemptId: string) => setViewingAttemptId(attemptId);
  const closeResult = () => setViewingAttemptId(null);

  // After a test is submitted (or found expired), the server action
  // redirects here as /student/dashboard?tab=results&attemptId=xxx.
  // Pick that up once, open the right tab + result, then clean the URL
  // so refreshing/back-navigating doesn't re-trigger it.
  useEffect(() => {
    const tab = searchParams.get("tab");
    const attemptId = searchParams.get("attemptId");

    if (!tab && !attemptId) return;

    if (tab) setActiveTab(tab);
    if (attemptId) setViewingAttemptId(attemptId);

    router.replace("/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const activeContent = useMemo(() => {
    if (viewingAttemptId) {
      return <ResultView attemptId={viewingAttemptId} onBack={closeResult} />;
    }

    switch (activeTab) {
      case "tests":
        return (
          <Tests
            tests={tests}
            exams={exams}
            onStartTest={(test) =>
              startTransition(() => startTestAttempt(test.id))
            }
            onContinueTest={(test) =>
              startTransition(() => startTestAttempt(test.id))
            }
            onViewResult={(test) => {
              // NOTE: TestItem needs an `attemptId` field (the attempt to
              // review) for this to work — it isn't in the type as shared
              // earlier. Add it wherever TestItem is built server-side, or
              // swap this line for however you're identifying the attempt.
              const attemptId = (test as unknown as { attemptId?: string })
                .attemptId;
              if (attemptId) openResult(attemptId);
            }}
          />
        );

      case "results":
        return (
          <Results
            results={results}
            resultSummary={resultSummary}
            onViewResult={(result) => {
              // Assumes StudentResultItem has an `attemptId: string` field.
              const attemptId = (result as unknown as { attemptId?: string })
                .attemptId;
              if (attemptId) openResult(attemptId);
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
  }, [
    viewingAttemptId,
    activeTab,
    data.student.name,
    student,
    coachings,
    exams,
    tests,
    results,
    resultSummary,
  ]);

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Flipkart Style Category Navigation */}
      <CategoryPage
        activeTab={activeTab}
        setActiveTab={(tab) => {
          closeResult(); // leaving a result view when switching tabs
          setActiveTab(tab);
        }}
      />

      {/* Content */}
      <section className="p-4 sm:p-5 md:p-6 lg:p-8">{activeContent}</section>
    </main>
  );
}