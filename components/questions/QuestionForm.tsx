"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { JSONContent } from "@tiptap/react";
import QuestionEditor from "./QuestionEditor";
import OptionEditor from "./OptionEditor";
import { createQuestion, updateQuestion } from "@/actions/question.actions";
import type { QuestionInput } from "@/types/question";

type Subject = {
  id: string;
  name: string;
  topics: {
    id: string;
    name: string;
  }[];
};

type Props = {
  subjects: Subject[];
  initialData?: {
    id: string;
    subjectId: string;
    topicId: string;
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
    content: JSONContent;
    options: {
      id: string;
      content: JSONContent;
      isCorrect: boolean;
    }[];
  };
};

const emptyContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

type FormValues = {
  subjectId: string;
  topicId: string;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
};

export default function QuestionForm({ subjects, initialData }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initialData);
  const [questionContent, setQuestionContent] = useState<JSONContent>(
    initialData?.content ?? emptyContent,
  );
  const [options, setOptions] = useState(
    initialData?.options ?? [
      {
        id: crypto.randomUUID(),
        content: emptyContent,
        isCorrect: false,
      },
      {
        id: crypto.randomUUID(),
        content: emptyContent,
        isCorrect: false,
      },
    ],
  );

  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      subjectId: initialData?.subjectId ?? "",
      topicId: initialData?.topicId ?? "",
      type: initialData?.type ?? "SINGLE_CHOICE",
    },
  });

  const subjectId = watch("subjectId");
  const type = watch("type");
  const selectedSubject = subjects.find((subject) => subject.id === subjectId);

  function handleTypeChange(nextType: "SINGLE_CHOICE" | "MULTIPLE_CHOICE") {
    setValue("type", nextType);

    if (nextType === "SINGLE_CHOICE") {
      let found = false;

      setOptions((current) =>
        current.map((option) => {
          if (option.isCorrect && !found) {
            found = true;
            return option;
          }

          return {
            ...option,
            isCorrect: false,
          };
        }),
      );
    }
  }

  function updateOption(id: string, content: JSONContent) {
    setOptions((current) =>
      current.map((option) =>
        option.id === id
          ? {
              ...option,
              content,
            }
          : option,
      ),
    );
  }

  function toggleCorrect(id: string) {
    if (type === "SINGLE_CHOICE") {
      setOptions((current) =>
        current.map((option) => ({
          ...option,
          isCorrect: option.id === id,
        })),
      );

      return;
    }

    setOptions((current) =>
      current.map((option) =>
        option.id === id
          ? {
              ...option,
              isCorrect: !option.isCorrect,
            }
          : option,
      ),
    );
  }

  function addOption() {
    if (options.length >= 10) {
      return;
    }

    setOptions((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        content: emptyContent,
        isCorrect: false,
      },
    ]);
  }

  function removeOption(id: string) {
    if (options.length <= 2) {
      return;
    }
    setOptions((current) => current.filter((option) => option.id !== id));
  }

  async function onSubmit(values: FormValues) {
    setError("");
    const payload: QuestionInput = {
      subjectId: values.subjectId,
      topicId: values.topicId,
      type: values.type,
      content: questionContent,
      options: options.map((option) => ({
        content: option.content,
        isCorrect: option.isCorrect,
      })),
    };

    const result = isEdit
      ? await updateQuestion(initialData!.id, payload)
      : await createQuestion(payload);

    if (!result.success) {
      setError(result.error ?? "Something went wrong");
      return;
    }

    router.push("/questions");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Details */}

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold">Question Details</h2>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">Subject</label>

            <select
              {...register("subjectId")}
              onChange={(event) => {
                setValue("subjectId", event.target.value);

                setValue("topicId", "");
              }}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">Select Subject</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Topic</label>

            <select
              {...register("topicId")}
              disabled={!subjectId}
              className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
            >
              <option value="">Select Topic</option>

              {selectedSubject?.topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Question Type
            </label>

            <select
              value={type}
              onChange={(event) =>
                handleTypeChange(
                  event.target.value as "SINGLE_CHOICE" | "MULTIPLE_CHOICE",
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="SINGLE_CHOICE">Single Choice</option>

              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            </select>
          </div>
        </div>
      </section>

      {/* Question */}

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Question Content</h2>

        <QuestionEditor value={questionContent} onChange={setQuestionContent} />
      </section>

      {/* Options */}

      <section className="rounded-xl border bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Answer Options</h2>

            <p className="text-sm text-gray-500">
              {type === "SINGLE_CHOICE"
                ? "Select exactly one correct answer."
                : "Select one or more correct answers."}
            </p>
          </div>

          <button
            type="button"
            disabled={options.length >= 10}
            onClick={addOption}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            + Add Option
          </button>
        </div>

        <div className="space-y-5">
          {options.map((option, index) => (
            <OptionEditor
              key={option.id}
              index={index}
              content={option.content}
              isCorrect={option.isCorrect}
              type={type}
              onContentChange={(content) => updateOption(option.id, content)}
              onCorrectChange={() => toggleCorrect(option.id)}
              onRemove={() => removeOption(option.id)}
              canRemove={options.length > 2}
            />
          ))}
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/questions")}
          className="rounded-lg border px-5 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-6 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update Question"
              : "Create Question"}
        </button>
      </div>
    </form>
  );
}
