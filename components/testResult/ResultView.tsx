"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  getTestResult,
  type ResultReviewQuestion,
} from "@/lib/actions/testResult.actions";
import ResultSummary from "./ResultSummary";
import ResultReview from "./ResultReview";

type ResultData = {
  testName: string;
  result: {
    score: number;
    totalMarks: number;
    correctCount: number;
    wrongCount: number;
    unattemptedCount: number;
    accuracy: number;
  };
  questions: ResultReviewQuestion[];
};

type ResultViewProps = {
  attemptId: string;
  onBack: () => void;
};

export default function ResultView({ attemptId, onBack }: ResultViewProps) {
  const [data, setData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setData(null);

    getTestResult(attemptId)
      .then((res) => {
        if (cancelled) return;

        if (res.inProgress || !res.result) {
          setError("This test hasn't been submitted yet.");
          return;
        }

        setData({
          testName: res.attempt.test.name,
          result: res.result,
          questions: res.questions,
        });
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this result. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to results
      </button>

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-sm text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading result...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          <ResultSummary
            testName={data.testName}
            score={data.result.score}
            totalMarks={data.result.totalMarks}
            correctCount={data.result.correctCount}
            wrongCount={data.result.wrongCount}
            unattemptedCount={data.result.unattemptedCount}
            accuracy={data.result.accuracy}
          />
          <ResultReview questions={data.questions} />
        </>
      )}
    </div>
  );
}