"use client";

import { SUBJECTS } from "./data";

interface Props {
  selectedSubjects: string[];
  onToggle: (subject: string) => void;
}

export default function SubjectSelector({
  selectedSubjects,
  onToggle,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Select Subjects
        </h2>

        <p className="text-slate-500 mt-1">
          Choose one or more subjects for this test
        </p>
      </div>

      {/* Subjects */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {Object.keys(SUBJECTS).map((subject) => {

          const checked =
            selectedSubjects.includes(subject);

          return (
            <label
              key={subject}
              className={`
                flex items-center gap-3
                rounded-2xl
                border
                p-4
                cursor-pointer
                transition-all
                duration-200

                ${
                  checked
                    ? "bg-blue-50 border-blue-600 shadow-sm"
                    : "bg-white border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                }
              `}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(subject)}
                className="h-5 w-5 accent-blue-600"
              />

              <span
                className={`font-medium ${
                  checked
                    ? "text-blue-700"
                    : "text-slate-700"
                }`}
              >
                {subject}
              </span>
            </label>
          );
        })}
      </div>

      {/* Footer */}

      <div className="mt-6 rounded-xl bg-slate-50 border p-4">

        <span className="text-slate-600">

          Selected Subjects :

        </span>

        <span className="font-bold text-blue-600 ml-2">

          {selectedSubjects.length}

        </span>

      </div>

    </div>
  );
}