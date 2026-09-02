import { getTestForEngine } from "@/actions/test.actions";
import TestEngine from "@/components/test-engine/TestEngine";
import { auth } from "@/lib/auth";

type Props = {
  params: Promise<{
    testId: string;
  }>;
};

export default async function TestPage({ params }: Props) {
  const { testId } = await params;
  const testData = await getTestForEngine(testId);
  const session = await auth();
  const userId = session?.user?.id;

  console.log("Test Page after start", testId, testData);

  if (!userId) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-xl font-bold text-red-700">
            Unauthorized
          </h1>

          <p className="mt-2 text-sm text-red-600">
            Please login to start this test.
          </p>
        </div>
      </main>
    );
  }

  if (!testData) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border p-6 text-center">
          <h1 className="text-xl font-bold">
            Test Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This test does not exist or is not published.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <TestEngine test={testData} userId={userId} />
    </main>
  );
}