"use client";

import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { ExamFormValues } from "@/schemas/exam";

type Props = {
  register: UseFormRegister<ExamFormValues>;
  errors: FieldErrors<ExamFormValues>;
};

export default function BasicDetails({ register, errors }: Props) {
  return (
    <div className="space-y-5 rounded-lg border bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold">Basic Details</h2>
        <p className="text-sm text-gray-500">
          Enter basic information about the exam.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Exam Name</label>

        <input
          {...register("name")}
          placeholder="SSC CGL"
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>

        <input
          {...register("slug")}
          placeholder="ssc-cgl"
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.slug && (
          <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          placeholder="Enter exam description"
          rows={4}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
}
