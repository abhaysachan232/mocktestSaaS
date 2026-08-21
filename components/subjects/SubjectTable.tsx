"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteSubject } from "@/actions/subject.actions";

type Subject = {
  id: string;
  name: string;

  _count: {
    topics: number;
  };
};

type Props = {
  subjects: Subject[];
};

export default function SubjectTable({ subjects }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Delete "${name}"?`);

    if (!confirmed) {
      return;
    }

    const result = await deleteSubject(id);

    if (!result.success) {
      alert(result.error);
      return;
    }

    router.refresh();
  };

  if (!subjects.length) {
    return (
      <div className="rounded-md border p-8 text-center text-gray-500">
        No subjects found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Subject</th>

            <th className="px-4 py-3 text-left">Topics</th>

            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id} className="border-t">
              <td className="px-4 py-3 font-medium">{subject.name}</td>

              <td className="px-4 py-3">{subject._count.topics}</td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/subjects/${subject.id}`}
                    className="rounded border px-3 py-1 text-sm"
                  >
                    Topics
                  </Link>

                  <Link
                    href={`/subjects/${subject.id}/edit`}
                    className="rounded border px-3 py-1 text-sm"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(subject.id, subject.name)}
                    className="rounded border border-red-500 px-3 py-1 text-sm text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
