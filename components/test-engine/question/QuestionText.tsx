interface QuestionTextProps {
  text: string;
}

export default function QuestionText({
  text,
}: QuestionTextProps) {
  return (
    <div className="text-[15px] font-medium leading-7 text-slate-800 sm:text-base sm:leading-7">
      {text}
    </div>
  );
}