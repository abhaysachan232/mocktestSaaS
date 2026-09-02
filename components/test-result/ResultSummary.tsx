interface ResultSummaryProps {
  testName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
}

export default function ResultSummary({
  testName,
  marksObtained,
  totalMarks,
  percentage,
}: ResultSummaryProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-500">Test Result</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          {testName}
        </h1>

        <div className="mx-auto mt-8 flex h-36 w-36 items-center justify-center rounded-full border-8 border-indigo-100">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">{percentage}%</p>

            <p className="mt-1 text-xs text-slate-500">Percentage</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-3xl font-bold text-slate-900">
            {marksObtained}
            <span className="text-lg font-medium text-slate-400">
              {" "}
              / {totalMarks}
            </span>
          </p>

          <p className="mt-1 text-sm text-slate-500">Marks Obtained</p>
        </div>
      </div>
    </section>
  );
}
