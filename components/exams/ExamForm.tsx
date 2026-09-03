"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExamFormValues, examSchema } from "@/schemas/exam";
import { createExam, updateExam } from "@/actions/exam.actions";
import BasicDetails from "./BasicDetails";
import SubjectTopicSelector from "./SubjectTopicSelector";

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
  exam?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    examSubjects: {
      subjectId: string;
    }[];
    examTopics: {
      topicId: string;
    }[];
  };
};

export default function ExamForm({ subjects, exam }: Props) {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const methods = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),

    defaultValues: {
      name: exam?.name ?? "",
      slug: exam?.slug ?? "",
      description: exam?.description ?? "",

      subjectIds: exam?.examSubjects.map((item) => item.subjectId) ?? [],

      topicIds: exam?.examTopics.map((item) => item.topicId) ?? [],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (values: ExamFormValues) => {
    setLoading(true);
    setServerError("");

    const result = exam
      ? await updateExam(exam.id, values)
      : await createExam(values);

    setLoading(false);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    router.push("/exams");
    router.refresh();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <BasicDetails register={register} errors={errors} />

        <SubjectTopicSelector
          control={control}
          subjects={subjects}
          errors={errors}
        />

        {serverError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/exams")}
            className="rounded-md border px-5 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : exam ? "Update Exam" : "Create Exam"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
