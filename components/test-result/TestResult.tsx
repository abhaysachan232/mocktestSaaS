import Link from "next/link";

import ResultSummary from "./ResultSummary";
import ResultStats from "./ResultStats";
import QuestionAnalysis from "./QuestionAnalysis";

interface TestResultProps {
  data: {
    attempt: {
      id: string;
      status: string;
      startedAt: Date;
      submittedAt: Date | null;
    };

    test: {
      id: string;
      name: string;
      description: string | null;
      totalQuestions: number;
      totalMarks: number;
      duration: number;
      negativeMarking: boolean;
      negativeMarks: number | null;
    };

    result: {
      totalQuestions: number;
      attempted: number;
      correct: number;
      incorrect: number;
      skipped: number;
      totalMarks: number;
      marksObtained: number;
      positiveMarks: number;
      negativeMarks: number;
      percentage: number;
      accuracy: number;
      timeTaken: number;
      rank: number | null;
      percentile: number | null;
    };

    questionAnalysis: any[];
  };
}

export default function TestResult({
  data,
}: TestResultProps) {
  const {
    test,
    result,
    questionAnalysis,
  } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Test Result
            </p>

            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              {test.name}
            </h1>
          </div>

          <Link
            href="/student/tests"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Tests
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-3 py-5 sm:px-6 sm:py-8">
        {/* Summary */}

        <ResultSummary
          testName={test.name}
          marksObtained={
            result.marksObtained
          }
          totalMarks={
            result.totalMarks
          }
          percentage={
            result.percentage
          }
        />

        {/* Stats */}

        <ResultStats
          totalQuestions={
            result.totalQuestions
          }
          attempted={
            result.attempted
          }
          correct={
            result.correct
          }
          incorrect={
            result.incorrect
          }
          skipped={
            result.skipped
          }
          accuracy={
            result.accuracy
          }
          timeTaken={
            result.timeTaken
          }
        />

        {/* Marks Breakdown */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Marks Breakdown
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs font-medium text-green-700">
                Positive Marks
              </p>

              <p className="mt-1 text-xl font-bold text-green-800">
                +{result.positiveMarks}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-xs font-medium text-red-700">
                Negative Marks
              </p>

              <p className="mt-1 text-xl font-bold text-red-800">
                -{result.negativeMarks}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-4">
              <p className="text-xs font-medium text-indigo-700">
                Final Score
              </p>

              <p className="mt-1 text-xl font-bold text-indigo-800">
                {result.marksObtained}
              </p>
            </div>
          </div>
        </section>

        {/* Question Analysis */}

        <QuestionAnalysis
          questions={
            questionAnalysis
          }
        />

        {/* Bottom Actions */}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/student/tests"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Back to Tests
          </Link>

          <Link
            href={`/student/tests/${test.id}`}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            View Test
          </Link>
        </div>
      </main>
    </div>
  );
}