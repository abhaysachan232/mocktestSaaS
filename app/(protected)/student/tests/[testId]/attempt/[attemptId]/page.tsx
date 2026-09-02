import { getTestForEngine } from "@/actions/test.actions";
import { getTestAttempt } from "@/actions/test-attempt.actions";
import TestEngine from "@/components/test-engine/TestEngine";

type Props = {
  params: Promise<{
    testId: string;
    attemptId: string;
  }>;
};

export default async function TestAttemptPage({ params }: Props) {
  const { testId, attemptId } = await params;

  console.log("ATTEMPT PAGE:", {
    testId,
    attemptId,
  });

  // Get test
  const testData = await getTestForEngine(testId);

  if (!testData) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border p-6 text-center">
          <h1 className="text-xl font-bold">Test Not Found</h1>
          <p className="mt-2 text-sm text-gray-500">
            This test does not exist or is not published.
          </p>
        </div>
      </main>
    );
  }

  // Verify attempt
  const attempt = await getTestAttempt(attemptId);

  if (!attempt) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border p-6 text-center">
          <h1 className="text-xl font-bold">Attempt Not Found</h1>
          <p className="mt-2 text-sm text-gray-500">
            This test attempt does not exist.
          </p>
        </div>
      </main>
    );
  }

  // Make sure attempt belongs to this test
  if (attempt.testId !== testId) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border p-6 text-center">
          <h1 className="text-xl font-bold">Invalid Attempt</h1>
          <p className="mt-2 text-sm text-gray-500">
            This attempt does not belong to this test.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <TestEngine test={testData} attemptId={attemptId} />
    </main>
  );
}
