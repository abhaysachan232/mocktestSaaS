import type { JSONContent } from "@tiptap/react";

export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE";

export type QuestionOptionInput = {
  content: JSONContent;
  isCorrect: boolean;
};

export type QuestionInput = {
  subjectId: string;
  topicId: string;
  type: QuestionType;
  content: JSONContent;
  options: QuestionOptionInput[];
};
