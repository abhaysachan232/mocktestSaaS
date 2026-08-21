import TestStatusBadge from "./TestStatusBadge";
import TestActions from "./TestActions";

type TestRow = {
  id: string;
  name: string;
  slug: string;
  testType: "PRACTICE" | "MOCK" | "FULL_LENGTH" | "SUBJECT_WISE" | "TOPIC_WISE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  duration: number;
  exam: {
    id: string;
    name: string;
  };
  _count: {
    testQuestions: number;
  };
};

type Props = {
  tests: TestRow[];
};

export default function TestTable({ tests }: Props) {
  if (tests.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-10 text-center text-gray-500">
        No tests found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Test</th>
            <th className="px-4 py-3 text-left">Exam</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Questions</th>
            <th className="px-4 py-3 text-left">Duration</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tests.map((test) => (
            <tr key={test.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                <div className="font-medium">{test.name}</div>
                <div className="text-xs text-gray-500">{test.slug}</div>
              </td>
              <td className="px-4 py-3">{test.exam.name}</td>
              <td className="px-4 py-3">{test.testType}</td>
              <td className="px-4 py-3">{test._count.testQuestions}</td>
              <td className="px-4 py-3">{test.duration} min</td>
              <td className="px-4 py-3">
                <TestStatusBadge status={test.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <TestActions id={test.id} status={test.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
