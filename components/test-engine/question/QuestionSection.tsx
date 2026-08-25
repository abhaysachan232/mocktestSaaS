"use client";

import QuestionCard from "./QuestionCard";
import { TestOption } from "../options/OptionsList";

interface QuestionSectionProps {
  questionNumber: number;
  questionText: string;
  options: TestOption[];
  selectedOption?: string | null;
  image?: string;
  imageAlt?: string;
  onSelectOption: (optionId: string) => void;
  disabled?: boolean;
}

export default function QuestionSection({
  questionNumber,
  questionText,
  options,
  selectedOption = null,
  image,
  imageAlt,
  onSelectOption,
  disabled = false,
}: QuestionSectionProps) {
  return (
    <main className="min-w-0">
      <QuestionCard
        questionNumber={questionNumber}
        questionText={questionText}
        options={options}
        selectedOption={selectedOption}
        image={image}
        imageAlt={imageAlt}
        onSelectOption={onSelectOption}
        disabled={disabled}
      />
    </main>
  );
}
