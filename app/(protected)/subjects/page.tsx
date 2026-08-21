import Link from "next/link";
import { getSubjects } from "@/actions/subject.actions";
import SubjectTable from "@/components/subjects/SubjectTable";

export default async function SubjectsPage() {
  const result = await getSubjects();

  if (!result.success) {
    return <div className="p-6 text-red-500">{result.error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subjects</h1>
          <p className="text-sm text-gray-500">Manage subjects and topics</p>
        </div>

        <Link
          href="/subjects/new"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          + Add Subject
        </Link>
      </div>

      <SubjectTable subjects={result.data} />
    </div>
  );
}
