"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { TestFormValues } from "@/schemas/test";

type Props = {
  register: UseFormRegister<TestFormValues>;
  errors: FieldErrors<TestFormValues>;
};

export default function TestBasicDetails({ register, errors }: Props) {
  return (
    <section className="rounded-lg border bg-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Basic Details</h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter the basic information and configuration for this test.
        </p>
      </div>

      <div className="space-y-5">
        {/* Test Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Test Name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="SSC CGL Mock Test 01"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />

          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Slug
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="slug"
            type="text"
            {...register("slug")}
            placeholder="ssc-cgl-mock-test-01"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />

          <p className="mt-1 text-xs text-gray-500">
            Use lowercase letters, numbers and hyphens.
          </p>

          {errors.slug && (
            <p className="mt-1.5 text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            {...register("description")}
            rows={4}
            placeholder="Enter test description..."
            className="w-full resize-y rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />

          {errors.description && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Test Type */}
        <div>
          <label
            htmlFor="testType"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Test Type
            <span className="ml-1 text-red-500">*</span>
          </label>

          <select
            id="testType"
            {...register("testType")}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="PRACTICE">Practice</option>
            <option value="MOCK">Mock Test</option>
            <option value="FULL_LENGTH">Full Length</option>
            <option value="SUBJECT_WISE">Subject Wise</option>
            <option value="TOPIC_WISE">Topic Wise</option>
          </select>

          {errors.testType && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.testType.message}
            </p>
          )}
        </div>

        {/* Duration / Total Marks / Total Questions */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Duration */}
          <div>
            <label
              htmlFor="duration"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Duration (Minutes)
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="duration"
              type="number"
              min={1}
              {...register("duration", {
                valueAsNumber: true,
              })}
              placeholder="60"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />

            {errors.duration && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.duration.message}
              </p>
            )}
          </div>

          {/* Total Marks */}
          <div>
            <label
              htmlFor="totalMarks"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Total Marks
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="totalMarks"
              type="number"
              min={1}
              step="0.01"
              {...register("totalMarks", {
                valueAsNumber: true,
              })}
              placeholder="100"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />

            {errors.totalMarks && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.totalMarks.message}
              </p>
            )}
          </div>

          {/* Total Questions */}
          <div>
            <label
              htmlFor="totalQuestions"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Total Questions
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="totalQuestions"
              type="number"
              min={1}
              {...register("totalQuestions", {
                valueAsNumber: true,
              })}
              placeholder="100"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />

            {errors.totalQuestions && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.totalQuestions.message}
              </p>
            )}
          </div>
        </div>

        {/* Negative Marking */}
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              {...register("negativeMarking")}
              className="mt-1 h-4 w-4 rounded border-gray-300"
            />

            <div>
              <span className="block text-sm font-medium text-gray-800">
                Enable Negative Marking
              </span>

              <span className="mt-1 block text-xs text-gray-500">
                Incorrect answers will deduct marks.
              </span>
            </div>
          </label>
        </div>

        {/* Negative Marks */}
        <div>
          <label
            htmlFor="negativeMarks"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Negative Marks
          </label>

          <input
            id="negativeMarks"
            type="number"
            min={0}
            step="0.01"
            {...register("negativeMarks", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            placeholder="0.25"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />

          <p className="mt-1 text-xs text-gray-500">
            Example: 0.25 marks deducted for each incorrect answer.
          </p>

          {errors.negativeMarks && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.negativeMarks.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
