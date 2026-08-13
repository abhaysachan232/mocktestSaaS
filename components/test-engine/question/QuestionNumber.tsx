interface QuestionNumberProps {
  number: number;
}

export default function QuestionNumber({
  number,
}: QuestionNumberProps) {
  return (
    <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-indigo-50 px-2 text-sm font-bold text-indigo-700">
      Q{number}
    </div>
  );
}