import { getTestForEngine } from "@/actions/test.actions";
import TestEngine from "@/components/test-engine/TestEngine";

type Props = {
  params: Promise<{
    testId: string;
  }>;
};

export default async function TestPage({ params }: Props) {
  const { testId } = await params;

  const testData = await getTestForEngine(testId);

  console.log("Test Page after start", testId, testData);

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
      <TestEngine test={testData} />
    </main>
  );
}