"use client";

import type { JSONContent } from "@tiptap/react";

import { TestEngineOption } from "./TestEngine";

import QuestionContentRenderer from "@/components/questions/QuestionContentRenderer";

interface QuestionSectionProps {
  questionNumber: number;

  questionContent: JSONContent;

  options: TestEngineOption[];

  questionType: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";

  selectedOptions?: string[];

  onSelectOption: (optionId: string) => void;

  disabled?: boolean;
}

const optionLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function QuestionSection({
  questionNumber,
  questionContent,
  options,
  questionType,
  selectedOptions = [],
  onSelectOption,
  disabled = false,
}: QuestionSectionProps) {
  const isMultiple = questionType === "MULTIPLE_CHOICE";

  return (
    <main className="min-w-0">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {/* =========================================
            QUESTION
        ========================================= */}

        <div className="flex items-start gap-3">
          <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-indigo-50 px-2 text-sm font-bold text-indigo-700">
            Q{questionNumber}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-medium leading-7 text-slate-800 sm:text-base sm:leading-7">
              <QuestionContentRenderer content={questionContent} />
            </div>
          </div>
        </div>

        {/* =========================================
            DIVIDER
        ========================================= */}

        <div className="my-5 border-t border-slate-100" />

        {/* =========================================
            QUESTION TYPE
        ========================================= */}

        <div className="mb-3 text-xs font-medium text-slate-500">
          {isMultiple ? "Select all correct answers" : "Select one answer"}
        </div>

        {/* =========================================
            OPTIONS
        ========================================= */}

        <div
          className="flex flex-col gap-3"
          role={isMultiple ? "group" : "radiogroup"}
          aria-label="Answer options"
        >
          {options.map((option, index) => {
            const isSelected = selectedOptions.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectOption(option.id)}
                disabled={disabled}
                aria-pressed={isSelected}
                className={`group flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 sm:p-4 ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-500"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40"
                } ${
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "active:scale-[0.995]"
                }`}
              >
                {/* =================================
                      RADIO / CHECKBOX INDICATOR
                  ================================= */}

                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center border text-sm font-bold transition ${
                    isMultiple ? "rounded-lg" : "rounded-full"
                  } ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-700 group-hover:border-indigo-400 group-hover:text-indigo-600"
                  }`}
                >
                  {isSelected
                    ? "✓"
                    : (optionLabels[index] ?? String(index + 1))}
                </span>

                {/* =================================
                      OPTION CONTENT
                  ================================= */}

                <span
                  className={`pt-1 text-sm leading-6 sm:text-base ${
                    isSelected
                      ? "font-medium text-indigo-950"
                      : "text-slate-700"
                  }`}
                >
                  <QuestionContentRenderer content={option.content} />
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
