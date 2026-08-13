import TestEngine from "@/components/test-engine/TestEngine";
import { testData } from "@/data/tests/sample-test";

interface MockTestPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MockTestPage({
  params,
}: MockTestPageProps) {
  const { slug } = await params;

  // Abhi static test use kar rahe hain.
  // Baad mein isi jagah API se test fetch kar sakte hain.
  console.log("Test slug:", slug);

  return (
    <main>
      <TestEngine test={testData} />
    </main>
  );
}