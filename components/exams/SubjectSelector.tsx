"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { ExamFormValues } from "@/schemas/exam";

type Subject = {
  id: string;
  name: string;
  topics: {
    id: string;
    name: string;
  }[];
};

type Props = {
  control: Control<ExamFormValues>;
  subjects: Subject[];
  errors: FieldErrors<ExamFormValues>;
};

export default function SubjectSelector({ control, subjects, errors }: Props) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">Select Subjects</h2>

      <p className="mb-4 text-sm text-gray-500">
        Select subjects included in this exam.
      </p>

      <Controller
        name="subjectIds"
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            {subjects.map((subject) => {
              const checked = field.value?.includes(subject.id);

              return (
                <label
                  key={subject.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      if (event.target.checked) {
                        field.onChange([...field.value, subject.id]);
                      } else {
                        field.onChange(
                          field.value.filter((id) => id !== subject.id),
                        );
                      }
                    }}
                  />

                  <span>{subject.name}</span>
                </label>
              );
            })}
          </div>
        )}
      />

      {errors.subjectIds && (
        <p className="mt-2 text-sm text-red-500">{errors.subjectIds.message}</p>
      )}
    </div>
  );
}
