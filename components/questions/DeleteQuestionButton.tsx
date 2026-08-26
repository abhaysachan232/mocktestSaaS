"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteQuestion } from "@/actions/question.actions";

export default function DeleteQuestionButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteQuestion(id);

      if (!result.success) {
        alert(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleDelete}
      className="rounded border border-red-200 px-3 py-1 text-sm text-red-600 disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
