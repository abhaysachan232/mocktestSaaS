import Link from "next/link";
import { getTests } from "@/actions/test.actions";
import TestTable from "@/components/tests/TestTable";

export default async function TestsPage() {
  const tests = await getTests();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tests</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage tests and mock tests.
          </p>
        </div>

        <Link
          href="/tests/new"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Create Test
        </Link>
      </div>
      <TestTable tests={tests} />
    </div>
  );
}
