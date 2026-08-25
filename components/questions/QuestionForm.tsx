"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QuestionEditor from "./QuestionEditor";
import {
  createQuestion,
  updateQuestion,
  getQuestionSubjects,
} from "@/actions/question.actions";
import {
  questionFormSchema,
  type QuestionFormValues,
} from "@/schemas/question";

type Subject = {
  id: string;
  name: string;

  topics: {
    id: string;
    name: string;
  }[];
};

type QuestionFormProps = {
  subjects?: Subject[];
  initialData?: QuestionFormValues & { id: string };
};

const emptyContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

function createOption() {
  return {
    content: structuredClone(emptyContent),
    isCorrect: false,
  };
}

export default function QuestionForm({
  subjects: initialSubjects,
  initialData,
}: QuestionFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(initialData?.id);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects ?? []);
  const [loadingSubjects, setLoadingSubjects] = useState(!initialSubjects);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialData ?? {
      subjectId: "",
      topicId: "",
      type: "SINGLE_CHOICE",
      content: structuredClone(emptyContent),
      options: [createOption(), createOption()],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const {
    fields: optionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "options",
  });

  const subjectId = useWatch({
    control,
    name: "subjectId",
  });

  const questionType = useWatch({
    control,
    name: "type",
  });

  const options = useWatch({
    control,
    name: "options",
  });

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === subjectId),
    [subjects, subjectId],
  );

  const topics = selectedSubject?.topics ?? [];

  useEffect(() => {
    if (initialSubjects) return;
    async function loadSubjects() {
      try {
        const result = await getQuestionSubjects();
        if (!result.success) {
          console.error(result.error);
          return;
        }
        setSubjects(result.data);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      } finally {
        setLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, [initialSubjects]);

  function handleSubjectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    setValue("subjectId", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("topicId", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  function handleTypeChange(type: QuestionFormValues["type"]) {
    setValue("type", type, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (type === "SINGLE_CHOICE") {
      const firstCorrectIndex = options.findIndex((option) => option.isCorrect);

      options.forEach((option, index) => {
        setValue(`options.${index}.isCorrect`, index === firstCorrectIndex, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    }
  }

  async function onSubmit(data: QuestionFormValues) {
    const payload = structuredClone({
      subjectId: data.subjectId,
      topicId: data.topicId,
      type: data.type,
      content: data.content,
      options: data.options.map((option) => ({
        content: option.content,
        isCorrect: option.isCorrect,
      })),
    });

    const result = isEditMode
      ? await updateQuestion(initialData!.id, payload)
      : await createQuestion(payload);

    if (!result.success) {
      console.error("Create question failed:", result.error);

      return;
    }

    reset();

    router.push("/questions");
  }

  if (loadingSubjects) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Question Details */}

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Question Details</h2>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Subject */}

          <div>
            <label className="mb-2 block text-sm font-medium">Subject</label>

            <select
              {...register("subjectId")}
              onChange={handleSubjectChange}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">Select subject</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            {errors.subjectId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.subjectId.message}
              </p>
            )}
          </div>

          {/* Topic */}

          <div>
            <label className="mb-2 block text-sm font-medium">Topic</label>

            <select
              {...register("topicId")}
              disabled={!subjectId}
              className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
            >
              <option value="">Select topic</option>

              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>

            {errors.topicId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.topicId.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Question */}

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Question</h2>

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <QuestionEditor
              value={field.value}
              onChange={field.onChange}
              minHeight="220px"
            />
          )}
        />

        {errors.content && (
          <p className="mt-2 text-sm text-red-500">{errors.content.message}</p>
        )}
      </section>

      {/* Question Type */}

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Question Type</h2>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="SINGLE_CHOICE"
              checked={questionType === "SINGLE_CHOICE"}
              onChange={() => handleTypeChange("SINGLE_CHOICE")}
            />
            Single Choice
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="MULTIPLE_CHOICE"
              checked={questionType === "MULTIPLE_CHOICE"}
              onChange={() => handleTypeChange("MULTIPLE_CHOICE")}
            />
            Multiple Choice
          </label>
        </div>
      </section>

      {/* Options */}

      <section className="rounded-xl border bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Options</h2>

            <p className="text-sm text-gray-500">Select the correct answer</p>
          </div>

          <button
            type="button"
            onClick={() => append(createOption())}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            + Add Option
          </button>
        </div>

        <div className="space-y-5">
          {optionFields.map((field, index) => {
            const isCorrect = options?.[index]?.isCorrect ?? false;

            return (
              <div key={field.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type={
                          questionType === "SINGLE_CHOICE"
                            ? "radio"
                            : "checkbox"
                        }
                        checked={isCorrect}
                        onChange={() => {
                          if (questionType === "SINGLE_CHOICE") {
                            options?.forEach((_, optionIndex) => {
                              setValue(
                                `options.${optionIndex}.isCorrect`,
                                optionIndex === index,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                },
                              );
                            });
                          } else {
                            setValue(`options.${index}.isCorrect`, !isCorrect, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }
                        }}
                      />
                      Correct Answer
                    </label>
                  </div>

                  {optionFields.length > 2 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <Controller
                  name={`options.${index}.content`}
                  control={control}
                  render={({ field }) => (
                    <QuestionEditor
                      value={field.value}
                      onChange={field.onChange}
                      minHeight="100px"
                    />
                  )}
                />

                {errors.options?.[index]?.content && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.options[index]?.content?.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {errors.options?.message && (
          <p className="mt-3 text-sm text-red-500">{errors.options.message}</p>
        )}
      </section>

      {/* Submit */}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => (window.location.href = "/questions")}
          className="rounded-lg border px-5 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Question"
              : "Create Question"}
        </button>
      </div>
    </form>
  );
}
