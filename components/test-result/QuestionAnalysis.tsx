import type { JSONContent } from "@tiptap/react";

import QuestionAnalysisCard from "./QuestionAnalysisCard";

interface Option {
  id: string;
  content: JSONContent;
  isCorrect: boolean;
}

interface QuestionAnalysis {
  questionId: string;

  type:
    | "SINGLE_CHOICE"
    | "MULTIPLE_CHOICE";

  content: JSONContent;

  options: Option[];

  selectedOptionIds: string[];

  isAttempted: boolean;

  isCorrect: boolean;
}

interface QuestionAnalysisProps {
  questions: QuestionAnalysis[];
}

export default function QuestionAnalysis({
  questions,
}: QuestionAnalysisProps) {
  console.log('questions', questions)
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Question Analysis
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review your answers and
          compare them with the correct
          answers.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map(
          (question, index) => (
            <QuestionAnalysisCard
              key={question.questionId}
              questionNumber={index + 1}
              content={
                question.content
              }
              type={question.type}
              options={
                question.options
              }
              selectedOptionIds={
                question.selectedOptionIds
              }
              isAttempted={
                question.isAttempted
              }
              isCorrect={
                question.isCorrect
              }
            />
          )
        )}
      </div>
    </section>
  );
}