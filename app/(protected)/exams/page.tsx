import Link from "next/link";
import { deleteExam, getExams } from "@/actions/exam.actions";
export default async function ExamsPage() {
  const exams = await getExams();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exams</h1>
          <p className="text-sm text-gray-500">Manage all exams.</p>
        </div>

        <Link
          href="/exams/new"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Create Exam
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Subjects</th>
              <th className="px-4 py-3 text-left">Topics</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-b">
                <td className="px-4 py-3 font-medium">{exam.name}</td>
                <td className="px-4 py-3 text-gray-600">{exam.slug}</td>
                <td className="px-4 py-3">{exam._count.examSubjects}</td>
                <td className="px-4 py-3">{exam._count.examTopics}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/exams/${exam.id}/edit`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>

                    <form
                      action={async () => {
                        "use server";

                        await deleteExam(exam.id);
                      }}
                    >
                      <button type="submit" className="text-red-600">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {exams.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No exams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
