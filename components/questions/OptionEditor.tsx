"use client";

import type { JSONContent } from "@tiptap/react";
import QuestionEditor from "./QuestionEditor";

type Props = {
  index: number;
  content: JSONContent;
  isCorrect: boolean;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
  onContentChange: (content: JSONContent) => void;
  onCorrectChange: () => void;
  onRemove: () => void;
  canRemove: boolean;
};

export default function OptionEditor({
  index,
  content,
  isCorrect,
  type,
  onContentChange,
  onCorrectChange,
  onRemove,
  canRemove,
}: Props) {
  const letter = String.fromCharCode(65 + index);

  return (
    <div
      className={`rounded-xl border p-4 ${
        isCorrect ? "border-green-500 bg-green-50/30" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type={type === "SINGLE_CHOICE" ? "radio" : "checkbox"}
            checked={isCorrect}
            onChange={onCorrectChange}
            name="correct-answer"
          />

          <span className="font-semibold">Option {letter}</span>

          {isCorrect && (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
              Correct
            </span>
          )}
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-500"
          >
            Remove
          </button>
        )}
      </div>

      <QuestionEditor
        value={content}
        onChange={onContentChange}
        minHeight="140px"
      />
    </div>
  );
}
