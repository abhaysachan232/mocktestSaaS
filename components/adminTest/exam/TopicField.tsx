"use client";

import { Trash2 } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { ExamFormValues } from "./types";

interface Props {
  subjectIndex: number;
  topicIndex: number;
  register: UseFormRegister<ExamFormValues>;
  remove: (index: number) => void;
}

export default function TopicField({
  subjectIndex,
  topicIndex,
  register,
  remove,
}: Props) {
  return (
    <div className="border rounded-2xl p-5 bg-slate-50">

      <div className="flex justify-between items-center mb-5">

        <h4 className="font-semibold text-slate-700">
          Topic {topicIndex + 1}
        </h4>

        <button
          type="button"
          onClick={() => remove(topicIndex)}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
        >
          <Trash2 size={16} />
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        {/* Topic Name */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Topic Name
          </label>

          <input
            {...register(
              `subjects.${subjectIndex}.topics.${topicIndex}.name`
            )}
            placeholder="Percentage"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

        </div>

        {/* Topic Code */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Topic Code
          </label>

          <input
            {...register(
              `subjects.${subjectIndex}.topics.${topicIndex}.code`
            )}
            placeholder="PERCENTAGE"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

        </div>

      </div>

    </div>
  );
}