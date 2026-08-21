"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createSubject, updateSubject } from "@/actions/subject.actions";
import type { SubjectInput } from "@/schemas/subject";

type Props = {
  subject?: {
    id: string;
    name: string;
  };
};

export default function SubjectForm({ subject }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const isEdit = Boolean(subject);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubjectInput>({
    defaultValues: {
      name: subject?.name ?? "",
    },
  });

  const onSubmit = async (data: SubjectInput) => {
    setServerError("");

    const result = isEdit
      ? await updateSubject(subject!.id, data)
      : await createSubject(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    router.push("/subjects");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Subject Name
        </label>

        <input
          id="name"
          {...register("name", {
            required: "Subject name is required",
          })}
          placeholder="Mathematics"
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/subjects")}
          className="rounded-md border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update Subject"
              : "Create Subject"}
        </button>
      </div>
    </form>
  );
}
