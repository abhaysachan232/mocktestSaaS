import { notFound } from "next/navigation";
import ExamForm from "@/components/exams/ExamForm";
import { getExamById, getSubjectsWithTopics } from "@/actions/exam.actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditExamPage({ params }: Props) {
  const { id } = await params;

  const [exam, subjects] = await Promise.all([
    getExamById(id),
    getSubjectsWithTopics(),
  ]);

  if (!exam) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Exam</h1>

        <p className="text-sm text-gray-500">
          Update exam details, subjects and topics.
        </p>
      </div>

      <ExamForm subjects={subjects} exam={exam} />
    </div>
  );
}
