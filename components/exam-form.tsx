"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema, ExamFormValues } from "@/schemas/exam";
import { createExam } from "@/actions/exam";

type SubjectWithTopics = {
  id: string;
  name: string;
  topics: { id: string; name: string }[];
};

export default function ExamForm({
  subjects,
}: {
  subjects: SubjectWithTopics[];
}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: "",
      examDate: new Date(),
      duration: 60,
      totalMarks: 100,
      totalQuestions: 50,
      subjectIds: [],
      topics: [],
    },
  });

  const subjectIds = useWatch({
    control,
    name: "subjectIds",
    defaultValue: [],
  });

  const topics = useWatch({
    control,
    name: "topics",
    defaultValue: [],
  });
  function toggleSubject(subjectId: string, checked: boolean) {
    if (checked) {
      setValue("subjectIds", [...subjectIds, subjectId], {
        shouldValidate: true,
      });
    } else {
      setValue(
        "subjectIds",
        subjectIds.filter((id) => id !== subjectId),
        { shouldValidate: true },
      );
      // subject uncheck hone par uske topics bhi hata do
      setValue(
        "topics",
        topics.filter((t) => t.subjectId !== subjectId),
      );
    }
  }

  function toggleTopic(subjectId: string, topicId: string, checked: boolean) {
    if (checked) {
      if (!subjectIds.includes(subjectId)) {
        setValue("subjectIds", [...subjectIds, subjectId], {
          shouldValidate: true,
        });
      }
      setValue("topics", [...topics, { subjectId, topicId }]);
    } else {
      setValue(
        "topics",
        topics.filter((t) => t.topicId !== topicId),
      );
    }
  }

  const onSubmit = (values: ExamFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const res = await createExam(values);
      if (!res.success) {
        setServerError(res.message ?? "Kuch galat ho gaya, dobara try karo");
        return;
      }
      reset();
      alert("Exam successfully create ho gaya!");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Exam Name</label>
        <input
          {...register("name")}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g. Half Yearly Exam"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Exam Date</label>
          <input
            type="date"
            {...register("examDate", { valueAsDate: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.examDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.examDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Duration (mins)
          </label>
          <input
            type="number"
            {...register("duration", { valueAsDate: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Total Marks</label>
          <input
            type="number"
            {...register("totalMarks", { valueAsDate: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.totalMarks && (
            <p className="text-red-500 text-sm mt-1">
              {errors.totalMarks.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Total Questions
          </label>
          <input
            type="number"
            {...register("totalQuestions", { valueAsDate: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.totalQuestions && (
            <p className="text-red-500 text-sm mt-1">
              {errors.totalQuestions.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Subjects & Topics
        </label>
        {errors.subjectIds && (
          <p className="text-red-500 text-sm mb-2">
            {errors.subjectIds.message}
          </p>
        )}
        <div className="space-y-4 border rounded p-4">
          {subjects.map((subject) => (
            <div key={subject.id}>
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={subjectIds.includes(subject.id)}
                  onChange={(e) => toggleSubject(subject.id, e.target.checked)}
                />
                {subject.name}
              </label>

              {subject.topics.length > 0 && (
                <div className="ml-6 mt-2 grid grid-cols-2 gap-1">
                  {subject.topics.map((topic) => (
                    <label
                      key={topic.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={topics.some((t) => t.topicId === topic.id)}
                        onChange={(e) =>
                          toggleTopic(subject.id, topic.id, e.target.checked)
                        }
                      />
                      {topic.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Exam"}
      </button>
    </form>
  );
}
