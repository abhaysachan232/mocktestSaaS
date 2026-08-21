import { notFound } from "next/navigation";
import { getTestById, getTestExams } from "@/actions/test.actions";
import TestForm from "@/components/tests/TestForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTestPage({ params }: Props) {
  const { id } = await params;
  const [test, exams] = await Promise.all([getTestById(id), getTestExams()]);

  if (!test) {
    notFound();
  }

  if (test.status === "PUBLISHED") {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h1 className="text-lg font-semibold">Test is Published</h1>
          <p className="mt-2 text-sm text-gray-600">
            Unpublish this test before editing its questions or settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Test</h1>
      </div>
      <TestForm exams={exams} initialData={test} />
    </div>
  );
}
