"use client";

interface Props {
  totalQuestions: number;
  totalSubjects: number;
  onSubmit: () => void;
}

export default function SummaryCard({
  totalQuestions,
  totalSubjects,
  onSubmit,
}: Props) {
  return (
    <div className="lg:sticky lg:top-6">

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">

          <h2 className="text-xl font-bold text-white">
            Test Summary
          </h2>

          <p className="text-blue-100 text-sm mt-1">
            Review before creating test
          </p>

        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          <div className="flex justify-between items-center">

            <span className="text-slate-600">
              Selected Subjects
            </span>

            <span className="font-bold text-lg">
              {totalSubjects}
            </span>

          </div>

          <div className="flex justify-between items-center">

            <span className="text-slate-600">
              Total Questions
            </span>

            <span className="font-bold text-lg text-blue-600">
              {totalQuestions}
            </span>

          </div>

          <div className="flex justify-between items-center">

            <span className="text-slate-600">
              Estimated Marks
            </span>

            <span className="font-bold text-lg">
              {totalQuestions}
            </span>

          </div>

          <div className="flex justify-between items-center">

            <span className="text-slate-600">
              Status
            </span>

            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
              Ready
            </span>

          </div>

          <div className="border-t pt-5">

            <button
              onClick={onSubmit}
              disabled={totalQuestions === 0}
              className={`w-full rounded-2xl py-4 text-white font-semibold transition ${
                totalQuestions === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Create Test
            </button>

          </div>

          {totalQuestions === 0 && (
            <p className="text-xs text-red-500 text-center">
              Please select at least one topic with questions.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}