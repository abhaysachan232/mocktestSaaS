"use client";

import type { JSONContent } from "@tiptap/react";

import QuestionContentRenderer from "@/components/questions/QuestionContentRenderer";

interface Option {
  id: string;
  content: JSONContent;
  isCorrect: boolean;
}

interface QuestionAnalysisCardProps {
  questionNumber: number;
  content: JSONContent;
  type:
    | "SINGLE_CHOICE"
    | "MULTIPLE_CHOICE";

  options: Option[];

  selectedOptionIds: string[];

  isAttempted: boolean;

  isCorrect: boolean;
}

const optionLabels = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
];

export default function QuestionAnalysisCard({
  questionNumber,
  content,
  options,
  selectedOptionIds,
  isAttempted,
  isCorrect,
}: QuestionAnalysisCardProps) {
  let status = "Skipped";

  if (isAttempted && isCorrect) {
    status = "Correct";
  } else if (isAttempted) {
    status = "Incorrect";
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-indigo-50 px-2 text-sm font-bold text-indigo-700">
            Q{questionNumber}
          </div>

          <div>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                status === "Correct"
                  ? "bg-green-100 text-green-700"
                  : status === "Incorrect"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}

      <div className="mt-5 text-sm leading-7 text-slate-800 sm:text-base">
        <QuestionContentRenderer
          content={content}
        />
      </div>

      {/* Options */}

      <div className="mt-5 space-y-3">
        {options.map(
          (option, index) => {
            const isSelected =
              selectedOptionIds.includes(
                option.id
              );

            const isCorrectOption =
              option.isCorrect;

            let optionClass =
              "border-slate-200 bg-white";

            if (
              isCorrectOption
            ) {
              optionClass =
                "border-green-300 bg-green-50";
            } else if (
              isSelected &&
              !isCorrectOption
            ) {
              optionClass =
                "border-red-300 bg-red-50";
            }

            return (
              <div
                key={option.id}
                className={`flex items-start gap-3 rounded-xl border p-3 ${optionClass}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-xs font-bold text-slate-700">
                  {optionLabels[
                    index
                  ] ??
                    String(
                      index + 1
                    )}
                </span>

                <div className="min-w-0 flex-1 text-sm leading-6 text-slate-700">
                  <QuestionContentRenderer
                    content={
                      option.content
                    }
                  />

                  <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold">
                    {isSelected && (
                      <span className="text-indigo-600">
                        Your Answer
                      </span>
                    )}

                    {isCorrectOption && (
                      <span className="text-green-600">
                        Correct Answer
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </article>
  );
}