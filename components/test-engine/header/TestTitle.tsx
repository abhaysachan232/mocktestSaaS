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
      <h1
        className="
          truncate
          text-sm font-bold leading-5 text-slate-900
          sm:text-base
          lg:text-lg
        "
      >
        {title}
      </h1>

      {subtitle ? (
        <p
          className="
            mt-0.5
            truncate
            text-[11px] leading-4 text-slate-500
            sm:text-xs
            lg:text-sm
          "
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}