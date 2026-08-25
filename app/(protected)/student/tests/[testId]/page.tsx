import { getQuestionsForTest, getTestById, getTestForEngine } from "@/actions/test.actions";
import TestEngine from "@/components/test-engine/TestEngine";
// import { testData } from "@/data/tests/sample-test";

type Props = {
  params: Promise<{
    testId: string;
  }>;
};

export default async function TestPage({ params }: Props) {
  const { testId } = await params;
  const testData = await getTestForEngine(testId)
  console.log('Test Page after start', testId, testData)
  return (
    <main>
      <TestEngine test={testData} />
    </main>
  );
}
