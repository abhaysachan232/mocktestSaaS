"use client";

import { Trash2, Plus } from "lucide-react";
import {
  Control,
  UseFormRegister,
  useFieldArray,
} from "react-hook-form";

import TopicField from "./TopicField";
import { ExamFormValues } from "./types";

interface Props {
  index: number;
  control: Control<ExamFormValues>;
  register: UseFormRegister<ExamFormValues>;
  remove: (index: number) => void;
}

export default function SubjectField({
  index,
  control,
  register,
  remove,
}: Props) {
  const {
    fields,
    append,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: `subjects.${index}.topics`,
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">

        <h2 className="text-white text-xl font-semibold">
          Subject {index + 1}
        </h2>

        <button
          type="button"
          onClick={() => remove(index)}
          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white"
        >
          <Trash2 size={18} />
        </button>

      </div>

      {/* Body */}

      <div className="p-6 space-y-6">

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="block font-medium mb-2">
              Subject Name
            </label>

            <input
              {...register(`subjects.${index}.name`)}
              className="w-full border rounded-xl p-3"
              placeholder="Mathematics"
            />

          </div>

          <div>

            <label className="block font-medium mb-2">
              Subject Code
            </label>

            <input
              {...register(`subjects.${index}.code`)}
              className="w-full border rounded-xl p-3"
              placeholder="MATH"
            />

          </div>

        </div>

        {/* Topics */}

        <div className="space-y-4">

          <div className="flex justify-between items-center">

            <h3 className="text-lg font-semibold">
              Topics
            </h3>

            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  code: "",
                })
              }
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
            >
              <Plus size={18} />
              Add Topic
            </button>

          </div>

          {fields.length === 0 && (
            <div className="border border-dashed rounded-xl p-8 text-center text-slate-500">
              No Topics Added
            </div>
          )}

          {fields.map((field, topicIndex) => (
            <TopicField
              key={field.id}
              subjectIndex={index}
              topicIndex={topicIndex}
              register={register}
              remove={removeTopic}
            />
          ))}

        </div>

      </div>

    </div>
  );
}