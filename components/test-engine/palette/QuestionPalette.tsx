"use client";

import PaletteItem, {
  PaletteStatus,
} from "./PaletteItem";
import PaletteLegend from "./PaletteLegend";

interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestion: number;

  getQuestionStatus: (
    index: number
  ) => PaletteStatus;

  onQuestionClick: (index: number) => void;
}

export default function QuestionPalette({
  totalQuestions,
  currentQuestion,
  getQuestionStatus,
  onQuestionClick,
}: QuestionPaletteProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-900">
          Question Palette
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Question {currentQuestion + 1} of{" "}
          {totalQuestions}
        </p>
      </div>

      {/* Legend */}
      <div className="mb-4 rounded-xl bg-slate-50 p-3">
        <PaletteLegend />
      </div>

      {/* Questions */}
      <div
        className="grid grid-cols-5 gap-2"
        aria-label="Question navigation"
      >
        {Array.from(
          { length: totalQuestions },
          (_, index) => (
            <PaletteItem
              key={index}
              number={index + 1}
              status={getQuestionStatus(index)}
              onClick={() => onQuestionClick(index)}
            />
          )
        )}
      </div>
    </aside>
  );
}