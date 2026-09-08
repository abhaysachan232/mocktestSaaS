import {
  getTestForEngine,
} from "@/actions/test.actions";

import {
  getTestAttempt,
  submitTestAttempt,
} from "@/actions/test-attempt.actions";

import TestEngine from "@/components/test-engine/TestEngine";

import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    testId: string;
    attemptId: string;
  }>;
};

export default async function TestAttemptPage({
  params,
}: Props) {
  const { testId, attemptId } = await params;

  // ==========================================================
  // GET TEST
  // ==========================================================

  const test = await getTestForEngine(testId);

  if (!test) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Test Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This test is no longer available.
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // GET ATTEMPT
  // ==========================================================

  const attemptResponse =
    await getTestAttempt(attemptId);

  if (
    !attemptResponse.success ||
    !attemptResponse.data
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Attempt Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {attemptResponse.message ??
              "This test attempt does not exist or does not belong to you."}
          </p>
        </div>
      </main>
    );
  }

  const attempt = attemptResponse.data;

  // ==========================================================
  // VERIFY TEST
  // ==========================================================

  if (attempt.testId !== testId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-red-700">
            Invalid Attempt
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This attempt does not belong to this test.
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // HANDLE ALREADY COMPLETED ATTEMPT
  // ==========================================================

  if (
    attempt.status === "SUBMITTED" ||
    attempt.status === "EXPIRED"
  ) {
    /*
     * Phase B:
     *
     * If Result already exists, submitTestAttempt()
     * is idempotent and simply returns the existing result.
     *
     * If the attempt is EXPIRED but Result does not exist,
     * submitTestAttempt() finalizes it and creates Result.
     */
    const submitResponse =
      await submitTestAttempt(attempt.id);

    if (
      submitResponse.success &&
      submitResponse.data
    ) {
      /*
       * IMPORTANT:
       *
       * Keep this route aligned with your actual Result page.
       *
       * Current expected route:
       *
       * /student/tests/[testId]/result/[resultId]
       */
      redirect(
        `/student/tests/${testId}/result/${submitResponse.data.resultId}`,
      );
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-red-700">
            Unable to Complete Test
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {submitResponse.message ??
              "The test result could not be generated."}
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // SAFETY CHECK
  // ==========================================================

  if (attempt.status !== "IN_PROGRESS") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Test Already Finished
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This test attempt is no longer active.
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // SERVER-SIDE EXPIRY CHECK
  // ==========================================================

  /*
   * getTestAttempt() is intentionally READ ONLY.
   *
   * Therefore, if the student refreshes exactly after
   * expiresAt, the attempt can still be IN_PROGRESS here.
   *
   * We finalize it immediately on the server.
   */

  const isExpired =
    new Date().getTime() >=
    new Date(attempt.expiresAt).getTime();

  if (isExpired) {
    const submitResponse =
      await submitTestAttempt(attempt.id);

    if (
      submitResponse.success &&
      submitResponse.data
    ) {
      redirect(
        `/student/tests/${testId}/result/${submitResponse.data.resultId}`,
      );
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-red-700">
            Time Expired
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your test time has expired, but the result could
            not be generated.
          </p>

          {submitResponse.message && (
            <p className="mt-3 text-xs text-red-500">
              {submitResponse.message}
            </p>
          )}
        </div>
      </main>
    );
  }

  // ==========================================================
  // TEST ENGINE
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50">
      <TestEngine
        test={test}
        attemptId={attempt.id}
        expiresAt={attempt.expiresAt}
      />
    </main>
  );
}