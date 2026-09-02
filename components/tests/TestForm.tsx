"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testSchema, type TestFormValues } from "@/schemas/test";
import { createTest, updateTest } from "@/actions/test.actions";
import TestBasicDetails from "./TestBasicDetails";
import TestExamSelector from "./TestExamSelector";
import TestQuestionSelector from "./TestQuestionSelector";

type Exam = {
  id: string;
  name: string;
  slug: string;
};

type ExistingTest = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  examId: string;
  testType: "PRACTICE" | "MOCK" | "FULL_LENGTH" | "SUBJECT_WISE" | "TOPIC_WISE";
  duration: number;
  totalMarks: number;
  totalQuestions: number;
  negativeMarking: boolean;
  negativeMarks: number | null;
  testQuestions: {
    questionId: string;
    order: number;
  }[];
};

type Props = {
  exams: Exam[];
  initialData?: ExistingTest;
};

export default function TestForm({ exams, initialData }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initialData);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      examId: initialData?.examId ?? "",
      testType: initialData?.testType ?? "MOCK",
      duration: initialData?.duration ?? 60,
      totalMarks: initialData?.totalMarks ?? 100,
      totalQuestions:
        initialData?.totalQuestions ?? initialData?.testQuestions.length ?? 0,
      negativeMarking: initialData?.negativeMarking ?? false,
      negativeMarks: initialData?.negativeMarks ?? null,
      questionIds:
        initialData?.testQuestions
          ?.slice()
          .sort((a, b) => a.order - b.order)
          .map((item) => item.questionId) ?? [],
    },
  });

  const examId = useWatch({
    control,
    name: "examId",
  });

  async function onSubmit(values: TestFormValues) {
    setLoading(true);
    setServerError("");

    try {
      const result = isEdit
        ? await updateTest(initialData!.id, values)
        : await createTest(values);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      router.push("/tests");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TestBasicDetails register={register} errors={errors} />
      <TestExamSelector control={control} errors={errors} exams={exams} />
      <TestQuestionSelector control={control} errors={errors} examId={examId} />

      {serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/tests")}
          className="rounded-md border px-5 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Update Test" : "Create Test"}
        </button>
      </div>
    </form>
  );
}
