import { redirect } from "next/navigation";
import { getTestAttemptData } from "@/lib/actions/test-engine.actions";
import TestEngine from "@/components/test-engine/TestEngine";

type PageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function TestAttemptPage({ params }: PageProps) {
  const { attemptId } = await params;
  const { attempt, questions, expired } = await getTestAttemptData(attemptId);

  if (expired || attempt.status !== "IN_PROGRESS") {
    // Attempt already finished (submitted/expired) — send to the result page.
    redirect(`/dashboard?tab=results&attemptId=${attemptId}`);
  }

  const initialAnswers = attempt.answers.map((a) => ({
    questionId: a.questionId,
    selectedOptionIds: a.selectedOptionIds,
    markedForReview: a.markedForReview,
  }));

  return (
    <TestEngine
      attemptId={attempt.id}
      testName={attempt.test.name}
      expiresAt={attempt.expiresAt.toISOString()}
      questions={questions}
      initialAnswers={initialAnswers}
    />
  );
}
