import TestForm from "@/components/tests/TestForm";
import { getTestExams } from "@/actions/test.actions";

export default async function NewTestPage() {
  const exams = await getTestExams();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Test</h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a test for students.
        </p>
      </div>

      <TestForm exams={exams} />
    </div>
  );
}
