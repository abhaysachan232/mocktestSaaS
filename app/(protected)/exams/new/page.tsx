import ExamForm from "@/components/exams/ExamForm";
import { getSubjectsWithTopics } from "@/actions/exam.actions";

export default async function NewExamPage() {
  const subjects = await getSubjectsWithTopics();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Exam</h1>

        <p className="text-sm text-gray-500">Create a new competitive exam.</p>
      </div>

      <ExamForm subjects={subjects} />
    </div>
  );
}
