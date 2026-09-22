
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

type ResultRequestState = {
  attemptId: string | null;
  loading: boolean;
  data: ResultData | null;
  error: string | null;
};

export default function ResultView({
  attemptId,
  onBack,
}: ResultViewProps) {
  const [request, setRequest] = useState<ResultRequestState>({
    attemptId: null,
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getTestResult(attemptId)
      .then((res) => {
        if (cancelled) return;

        if (res.inProgress || !res.result) {
          setRequest({
            attemptId,
            loading: false,
            data: null,
            error: "This test hasn't been submitted yet.",
          });

          return;
        }

        setRequest({
          attemptId,
          loading: false,
          error: null,
          data: {
            testName: res.attempt.test.name,
            result: res.result,
            questions: res.questions,
          },
        });
      })
      .catch(() => {
        if (cancelled) return;

        setRequest({
          attemptId,
          loading: false,
          data: null,
          error: "Couldn't load this result. Please try again.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  const isCurrentRequest = request.attemptId === attemptId;

  const loading = !isCurrentRequest || request.loading;

  const data = isCurrentRequest ? request.data : null;

  const error = isCurrentRequest ? request.error : null;

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