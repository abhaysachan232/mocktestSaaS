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
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Basic Details</h2>
        <p className="text-sm text-gray-500">Enter test information.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Test Name</label>

          <input
            {...register("name")}
            placeholder="SSC CGL Mock Test 01"
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
            placeholder="ssc-cgl-mock-test-01"
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
            rows={4}
            placeholder="Test description"
            className="w-full rounded-md border px-3 py-2"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
