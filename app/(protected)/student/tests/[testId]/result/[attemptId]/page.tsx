import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTestResult } from "@/actions/test-result.actions";
import TestResult from "@/components/test-result/TestResult";

interface ResultPageProps {
  params: Promise<{
    testId: string;
    attemptId: string;
  }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { testId, attemptId } = await params;
const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    notFound();
  }
  /*
   * --------------------------------------------------
   * GET LOGGED IN USER
   * --------------------------------------------------
   *
   * Replace this with your existing
   * NextAuth v5 auth() implementation.
   */

//   const userId = "CURRENT_LOGGED_IN_USER_ID";

  const response = await getTestResult(attemptId, userId);
  console.log('response', response)

  if (!response.success) {
    notFound();
  }

  /*
   * Security check:
   *
   * Attempt belongs to requested test.
   */

  if (response.data.test.id !== testId) {
    notFound();
  }

  return <TestResult data={response.data} />;
}
