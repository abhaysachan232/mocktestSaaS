"use client";

import OptionCard from "./OptionCard";

export interface TestOption {
  id: string;
  text: string;
}

interface OptionsListProps {
  options: TestOption[];
  selectedOption?: string | null;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
}

const optionLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function OptionsList({
  options,
  selectedOption = null,
  onSelect,
  disabled = false,
}: OptionsListProps) {
  return (
    <div
      className="flex flex-col gap-3"
      role="radiogroup"
      aria-label="Answer options"
    >
      {options.map((option, index) => (
        <OptionCard
          key={option.id}
          optionId={option.id}
          label={optionLabels[index] ?? String(index + 1)}
          text={option.text}
          selected={selectedOption === option.id}
          disabled={disabled}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}