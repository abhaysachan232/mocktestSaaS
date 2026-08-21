"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { TestFormValues } from "@/schemas/test";

type Exam = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  control: Control<TestFormValues>;
  errors: FieldErrors<TestFormValues>;
  exams: Exam[];
};

export default function TestExamSelector({ control, errors, exams }: Props) {
  return (
    <section className="rounded-lg border bg-white p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Exam</h2>
        <p className="text-sm text-gray-500">Select the exam for this test.</p>
      </div>

      <Controller
        name="examId"
        control={control}
        render={({ field }) => (
          <select {...field} className="w-full rounded-md border px-3 py-2">
            <option value="">Select Exam</option>

            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name}
              </option>
            ))}
          </select>
        )}
      />

      {errors.examId && (
        <p className="mt-1 text-sm text-red-500">{errors.examId.message}</p>
      )}
    </section>
  );
}
