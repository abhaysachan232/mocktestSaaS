"use client";

import QuestionNumber from "./QuestionNumber";
import QuestionText from "./QuestionText";
import QuestionImage from "./QuestionImage";
import OptionsList, {
  TestOption,
} from "../options/OptionsList";

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;

  options: TestOption[];

  selectedOption?: string | null;

  image?: string;
  imageAlt?: string;

  onSelectOption: (optionId: string) => void;

  disabled?: boolean;
}

export default function QuestionCard({
  questionNumber,
  questionText,
  options,
  selectedOption = null,
  image,
  imageAlt,
  onSelectOption,
  disabled = false,
}: QuestionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Question Header */}
      <div className="flex items-start gap-3">
        <QuestionNumber number={questionNumber} />

        <div className="min-w-0 flex-1">
          <QuestionText text={questionText} />
        </div>
      </div>

      {/* Question Image */}
      {image && (
        <QuestionImage
          src={image}
          alt={imageAlt}
        />
      )}

      {/* Divider */}
      <div className="my-5 border-t border-slate-100" />

      {/* Options */}
      <OptionsList
        options={options}
        selectedOption={selectedOption}
        onSelect={onSelectOption}
        disabled={disabled}
      />
    </section>
  );
}