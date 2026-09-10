import { redirect } from "next/navigation";
import { getTestResult } from "@/lib/actions/testResult.actions";
import ResultSummary from "@/components/testResult/ResultSummary";
import ResultReview from "@/components/testResult/ResultReview";

type PageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function TestResultPage({ params }: PageProps) {
  const { attemptId } = await params;
  const { attempt, result, questions, inProgress } = await getTestResult(attemptId);

  if (inProgress) {
    // Test hasn't been submitted yet — send the student back to finish it.
    redirect(`/test/attempt/${attemptId}`);
  }

  if (!result) {
    // Shouldn't normally happen (submit/finalize always creates a Result),
    // but guard against a partially-failed submission.
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-lg font-bold text-slate-900">Result not available</h1>
        <p className="mt-2 text-sm text-slate-500">
          We couldn&apos;t find a result for this attempt yet. Please try again in a
          moment or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <ResultSummary
          testName={attempt.test.name}
          score={result.score}
          totalMarks={result.totalMarks}
          correctCount={result.correctCount}
          wrongCount={result.wrongCount}
          unattemptedCount={result.unattemptedCount}
          accuracy={result.accuracy}
        />

        <ResultReview questions={questions} />
      </div>
    </div>
  );
}