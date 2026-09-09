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
    setValue,
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

      // User will enter this manually.
      totalQuestions: initialData?.totalQuestions ?? 0,

      negativeMarking: initialData?.negativeMarking ?? false,

      negativeMarks: initialData?.negativeMarks ?? null,

      questionIds:
        initialData?.testQuestions
          ?.slice()
          .sort((a, b) => a.order - b.order)
          .map((item) => item.questionId) ?? [],
    },
  });

  /**
   * Selected exam.
   */
  const examId = useWatch({
    control,
    name: "examId",
  });

  /**
   * Selected question IDs.
   *
   * This is only used to show the number of
   * questions selected in the question selector.
   *
   * It does NOT overwrite totalQuestions.
   */
  const questionIds = useWatch({
    control,
    name: "questionIds",
  });

  /**
   * Submit form.
   */
  async function onSubmit(values: TestFormValues) {
    if (loading) {
      return;
    }

    setLoading(true);
    setServerError("");

    console.log("========== TEST FORM SUBMIT ==========");
    console.log("FORM VALUES:", values);

    try {
      const result = isEdit
        ? await updateTest(initialData!.id, values)
        : await createTest(values);

      console.log("CREATE/UPDATE TEST RESULT:", result);

      if (!result.success) {
        setServerError(result.message || "Unable to save test.");

        return;
      }

      router.push("/tests");
      router.refresh();
    } catch (error) {
      console.error("TEST CREATE/UPDATE ERROR:", error);

      setServerError(
        error instanceof Error
          ? error.message
          : "Unable to save test. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * Called when Zod validation fails.
   */
  function onInvalidSubmit(validationErrors: typeof errors) {
    console.error("========== TEST VALIDATION ERROR ==========");

    console.error("VALIDATION ERRORS:", validationErrors);

    setServerError(
      "Please fix the highlighted fields before creating the test.",
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className="space-y-6"
    >
      {/* =========================================
          BASIC DETAILS
          ========================================= */}
      <TestBasicDetails
        register={register}
        errors={errors}
        setValue={setValue}
        control={control}
      />

      {/* =========================================
          EXAM
          ========================================= */}
      <TestExamSelector control={control} errors={errors} exams={exams} />

      {/* =========================================
          QUESTIONS
          ========================================= */}
      <TestQuestionSelector control={control} errors={errors} examId={examId} />

      {/* =========================================
          SELECTED QUESTION SUMMARY
          ========================================= */}
      <section className="rounded-lg border bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Selected Questions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Number of questions currently selected from the question bank.
            </p>
          </div>

          <div className="flex h-12 min-w-16 items-center justify-center rounded-lg bg-gray-100 px-4">
            <span className="text-xl font-bold text-gray-900">
              {questionIds?.length ?? 0}
            </span>
          </div>
        </div>
      </section>

      {/* =========================================
          VALIDATION / SERVER ERROR
          ========================================= */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      {/* =========================================
          ACTIONS
          ========================================= */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => router.push("/tests")}
          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
              ? "Update Test"
              : "Create Test"}
        </button>
      </div>
    </form>
  );
}
