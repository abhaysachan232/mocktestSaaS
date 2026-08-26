interface TestTitleProps {
  title: string;
  subtitle?: string | null;
}

export default function TestTitle({
  title,
  subtitle,
}: TestTitleProps) {
  return (
    <div className="min-w-0">
      <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}