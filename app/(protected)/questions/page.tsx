import Link from "next/link";
import { getQuestions, deleteQuestion } from "@/actions/question.actions";
import DeleteQuestionButton from "@/components/questions/DeleteQuestionButton";

export default async function QuestionsPage() {
  const result = await getQuestions();

  if (!result.success) {
    return <div className="p-6 text-red-500">{result.error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Questions</h1>
          <p className="text-sm text-gray-500">Manage your question bank</p>
        </div>

        <Link
          href="/questions/new"
          className="rounded-lg bg-black px-5 py-2 text-sm text-white"
        >
          + Create Question
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Subject</th>

              <th className="px-4 py-3 text-left">Topic</th>

              <th className="px-4 py-3 text-left">Type</th>

              <th className="px-4 py-3 text-left">Options</th>

              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {result.data.map((question) => (
              <tr key={question.id} className="border-b">
                <td className="px-4 py-3">{question.subject.name}</td>

                <td className="px-4 py-3">{question.topic.name}</td>

                <td className="px-4 py-3">
                  {question.type === "SINGLE_CHOICE" ? "Single" : "Multiple"}
                </td>

                <td className="px-4 py-3">{question.options.length}</td>

                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/questions/${question.id}/edit`}
                      className="rounded border px-3 py-1 text-sm"
                    >
                      Edit
                    </Link>

                    <DeleteQuestionButton id={question.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
