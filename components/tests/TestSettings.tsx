"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { TestFormValues } from "@/schemas/test";

type Props = {
  control: Control<TestFormValues>;
  register: UseFormRegister<TestFormValues>;
  errors: FieldErrors<TestFormValues>;
};

export default function TestSettings({ control, register, errors }: Props) {
  return (
    <section className="rounded-lg border bg-white p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Test Settings</h2>
      </div>

      <div className="space-y-5">
        <Controller
          name="testType"
          control={control}
          render={({ field }) => (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Test Type
              </label>

              <select {...field} className="w-full rounded-md border px-3 py-2">
                <option value="PRACTICE">Practice</option>
                <option value="MOCK">Mock</option>
                <option value="FULL_LENGTH">Full Length</option>
                <option value="SUBJECT_WISE">Subject Wise</option>
                <option value="TOPIC_WISE">Topic Wise</option>
              </select>
            </div>
          )}
        />

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Duration</label>

            <input
              type="number"
              {...register("duration", {
                valueAsNumber: true,
              })}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Total Marks
            </label>

            <input
              type="number"
              {...register("totalMarks", {
                valueAsNumber: true,
              })}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.totalMarks && (
              <p className="text-sm text-red-500">
                {errors.totalMarks.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Total Questions
            </label>

            <input
              type="number"
              {...register("totalQuestions", {
                valueAsNumber: true,
              })}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.totalQuestions && (
              <p className="text-sm text-red-500">
                {errors.totalQuestions.message}
              </p>
            )}
          </div>
        </div>

        <Controller
          name="negativeMarking"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
              />

              <span className="text-sm font-medium">
                Enable Negative Marking
              </span>
            </label>
          )}
        />

        <div>
          <label className="mb-1 block text-sm font-medium">
            Negative Marks
          </label>

          <input
            type="number"
            step="0.01"
            {...register("negativeMarks", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            className="w-full rounded-md border px-3 py-2"
          />

          {errors.negativeMarks && (
            <p className="text-sm text-red-500">
              {errors.negativeMarks.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
