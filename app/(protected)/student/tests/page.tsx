import { getPublishedTests } from "@/actions/test.actions";
import Link from "next/link";

export default async function StudentTestsPage() {
  const tests = await getPublishedTests();
  console.log('StudentTestsPage', tests)

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Available Tests</h1>
      {tests.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-gray-500">
          No tests available.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div key={test.id} className="rounded-lg border bg-white p-5">
              <h2 className="font-semibold">{test.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{test.exam.name}</p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded bg-gray-50 p-2">
                  <div className="font-semibold">{test.totalQuestions}</div>
                  <div className="text-gray-500">Questions</div>
                </div>

                <div className="rounded bg-gray-50 p-2">
                  <div className="font-semibold">{test.totalMarks}</div>
                  <div className="text-gray-500">Marks</div>
                </div>

                <div className="rounded bg-gray-50 p-2">
                  <div className="font-semibold">{test.duration}</div>
                  <div className="text-gray-500">Minutes</div>
                </div>
              </div>

              <Link
                href={`/student/tests/${test.id}`}
                className="mt-5 block w-full rounded-lg bg-black px-4 py-3 text-center text-sm font-medium text-white hover:bg-gray-800"
              >
                View Test
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
