"use client";

import { useEffect, useState } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
} from "react-hook-form";

import { getQuestionsForTest } from "@/actions/test.actions";
import type { TestFormValues } from "@/schemas/test";

type Question = {
  id: string;
  type: string;
  subject: {
    id: string;
    name: string;
  };
  topic: {
    id: string;
    name: string;
  };
};

type Props = {
  control: Control<TestFormValues>;
  errors: FieldErrors<TestFormValues>;
  examId: string;
};

export default function TestQuestionSelector({
  control,
  errors,
  examId,
}: Props) {
  const [questions, setQuestions] = useState<Question[]>(
    [],
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadQuestions() {
      if (!examId) {
        setQuestions([]);
        return;
      }

      setLoading(true);

      try {
        const result =
          await getQuestionsForTest(examId);

        if (!active) return;

        setQuestions(
          result.map((question) => ({
            id: question.id,
            type: question.type,
            subject: question.subject,
            topic: question.topic,
          })),
        );
      } catch (error) {
        console.error(
          "LOAD_TEST_QUESTIONS_ERROR:",
          error,
        );

        if (active) {
          setQuestions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      active = false;
    };
  }, [examId]);

  return (
    <section className="rounded-lg border bg-white p-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Questions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select questions from the selected exam
              syllabus.
            </p>
          </div>

          {examId && !loading && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {questions.length} available
            </span>
          )}
        </div>
      </div>

      {/* No exam */}
      {!examId && (
        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            Select an exam first.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            Loading questions...
          </p>
        </div>
      )}

      {/* No questions */}
      {!loading &&
        examId &&
        questions.length === 0 && (
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">
              No questions available for this exam.
            </p>
          </div>
        )}

      {/* Questions */}
      {!loading && questions.length > 0 && (
        <Controller
          name="questionIds"
          control={control}
          render={({ field }) => {
            const selectedIds = field.value ?? [];

            return (
              <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1">
                {questions.map((question, index) => {
                  const checked = selectedIds.includes(
                    question.id,
                  );

                  return (
                    <label
                      key={question.id}
                      className={`flex cursor-pointer gap-3 rounded-md border p-3 transition ${
                        checked
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          if (
                            event.target.checked
                          ) {
                            field.onChange([
                              ...selectedIds,
                              question.id,
                            ]);
                          } else {
                            field.onChange(
                              selectedIds.filter(
                                (id) =>
                                  id !== question.id,
                              ),
                            );
                          }
                        }}
                        className="mt-1 h-4 w-4"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-400">
                            Q{index + 1}
                          </span>

                          <span className="text-sm font-medium text-gray-900">
                            {question.subject.name}
                          </span>
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          {question.topic.name}
                          {" • "}
                          {question.type}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            );
          }}
        />
      )}

      {/* Validation error */}
      {errors.questionIds && (
        <p className="mt-3 text-sm text-red-500">
          {errors.questionIds.message}
        </p>
      )}
    </section>
  );
}