import { notFound } from "next/navigation";
import {
  getQuestionById,
  getQuestionSubjects,
} from "@/lib/actions/question.actions";
import QuestionForm from "@/components/questions/QuestionForm";
import type { JSONContent } from "@tiptap/core";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type RequiredJSONContent = Omit<JSONContent, "type"> & {
  type: string;
};

function toJSONContent(value: unknown): RequiredJSONContent {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    const content = value as JSONContent;

    return {
      ...content,
      type: content.type ?? "doc",
    };
  }

  return {
    type: "doc",
    content: [],
  };
}

export default async function EditQuestionPage({ params }: Props) {
  const { id } = await params;

  const [questionResult, subjectsResult] = await Promise.all([
    getQuestionById(id),
    getQuestionSubjects(),
  ]);

  if (!questionResult.success) {
    notFound();
  }

  if (!subjectsResult.success) {
    return <div className="p-6">{subjectsResult.error}</div>;
  }

  const question = questionResult.data;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Question</h1>

        <p className="mt-1 text-sm text-gray-500">
          Update question, options and correct answers.
        </p>
      </div>

      <QuestionForm
        subjects={subjectsResult.data}
        initialData={{
          id: question.id,
          subjectId: question.subjectId,
          topicId: question.topicId,
          type: question.type,
          content: toJSONContent(question.content),
          solution: toJSONContent(question.solution),
          options: question.options.map((option) => ({
            id: option.id,
            content: toJSONContent(option.content),
            isCorrect: option.isCorrect,
          })),
        }}
      />
    </div>
  );
}