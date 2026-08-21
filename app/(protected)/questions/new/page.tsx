import { getQuestionSubjects } from "@/actions/question.actions";
import QuestionForm from "@/components/questions/QuestionForm";

export default async function NewQuestionPage() {
  const result = await getQuestionSubjects();

  if (!result.success) {
    return <div className="p-6">{result.error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Question</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a rich question with multiple answer types.
        </p>
      </div>

      <QuestionForm subjects={result.data} />
    </div>
  );
}
