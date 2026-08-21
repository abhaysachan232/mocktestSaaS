"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  archiveTest,
  deleteTest,
  publishTest,
  unpublishTest,
} from "@/actions/test.actions";

type Props = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export default function TestActions({ id, status }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const execute = (
    action: () => Promise<{
      success: boolean;
      message: string;
    }>,
  ) => {
    startTransition(async () => {
      const result = await action();

      if (!result.success) {
        alert(result.message);
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-3">
      {status === "DRAFT" && (
        <>
          <button
            type="button"
            disabled={pending}
            onClick={() => execute(() => publishTest(id))}
            className="text-green-600"
          >
            Publish
          </button>

          <a href={`/tests/${id}/edit`} className="text-blue-600">
            Edit
          </a>

          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm("Delete this test?")) {
                return;
              }

              execute(() => deleteTest(id));
            }}
            className="text-red-600"
          >
            Delete
          </button>
        </>
      )}

      {status === "PUBLISHED" && (
        <>
          <a href={`/tests/${id}/edit`} className="text-blue-600">
            View
          </a>

          <button
            type="button"
            disabled={pending}
            onClick={() => execute(() => unpublishTest(id))}
            className="text-orange-600"
          >
            Unpublish
          </button>
        </>
      )}

      {status === "ARCHIVED" && (
        <span className="text-sm text-gray-500">Archived</span>
      )}
    </div>
  );
}
