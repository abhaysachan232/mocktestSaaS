"use client";

import { useEffect, useState } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
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
  const [questions, setQuestions] = useState<Question[]>([]);
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
        const result = await getQuestionsForTest(examId);
        if (active) {
          setQuestions(
            result.map((question) => ({
              id: question.id,
              type: question.type,
              subject: question.subject,
              topic: question.topic,
            })),
          );
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
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Questions</h2>
        <p className="text-sm text-gray-500">
          Select questions from the selected exam syllabus.
        </p>
      </div>

      {!examId && (
        <p className="text-sm text-gray-500">Select an exam first.</p>
      )}
      {loading && <p className="text-sm text-gray-500">Loading questions...</p>}
      {!loading && examId && questions.length === 0 && (
        <p className="text-sm text-gray-500">No questions available.</p>
      )}

      <Controller
        name="questionIds"
        control={control}
        render={({ field }) => (
          <div className="max-h-125 space-y-2 overflow-y-auto">
            {questions.map((question) => {
              const checked = field.value.includes(question.id);

              return (
                <label
                  key={question.id}
                  className="flex cursor-pointer gap-3 rounded-md border p-3 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      if (event.target.checked) {
                        field.onChange([...field.value, question.id]);
                      } else {
                        field.onChange(
                          field.value.filter((id) => id !== question.id),
                        );
                      }
                    }}
                  />

                  <div>
                    <div className="text-sm font-medium">
                      {question.subject.name}
                    </div>

                    <div className="text-xs text-gray-500">
                      {question.topic.name}
                      {" • "}
                      {question.type}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      />

      {errors.questionIds && (
        <p className="mt-2 text-sm text-red-500">
          {errors.questionIds.message}
        </p>
      )}
    </section>
  );
}
