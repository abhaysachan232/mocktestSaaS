import { getTestForEngine } from "@/actions/test.actions";
import { auth } from "@/lib/auth";
import StartTestButton from "@/components/test-engine/StartTestButton";

type Props = {
  params: Promise<{
    testId: string;
  }>;
};

export default async function TestPage({ params }: Props) {
  const { testId } = await params;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Login Required</h1>

          <p className="mt-2 text-sm text-slate-500">
            Please login to start this test.
          </p>
        </div>
      </main>
    );
  }

  const test = await getTestForEngine(testId);

  if (!test) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Test Not Found</h1>

          <p className="mt-2 text-sm text-slate-500">
            This test does not exist or is not currently available.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-7 text-white sm:px-8">
            <p className="text-sm font-medium text-blue-100">
              Test Instructions
            </p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{test.name}</h1>

            {test.description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                {test.description}
              </p>
            )}
          </div>

          {/* Test Stats */}
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 border-b border-slate-200 sm:grid-cols-4 sm:divide-y-0">
            <InfoItem label="Questions" value={test.totalQuestions} />

            <InfoItem label="Duration" value={`${test.duration} min`} />

            <InfoItem label="Total Marks" value={test.totalMarks} />

            <InfoItem
              label="Negative Marking"
              value={
                test.negativeMarking ? `-${test.negativeMarks ?? 0}` : "No"
              }
            />
          </div>

          {/* Instructions */}
          <div className="px-6 py-7 sm:px-8">
            <h2 className="text-lg font-bold text-slate-900">Instructions</h2>

            <div className="mt-5 space-y-4">
              <Instruction>
                The test duration is <strong>{test.duration} minutes</strong>.
              </Instruction>

              <Instruction>
                There are <strong>{test.totalQuestions} questions</strong> in
                this test.
              </Instruction>

              <Instruction>
                Each question can have one or multiple correct answers depending
                on the question type.
              </Instruction>

              <Instruction>
                Your answers are automatically saved while you attempt the test.
              </Instruction>

              <Instruction>
                Once the test is submitted, you cannot modify your answers.
              </Instruction>

              {test.negativeMarking && (
                <Instruction warning>
                  Negative marking is enabled. Incorrect answers will receive a
                  deduction of <strong>{test.negativeMarks ?? 0}</strong> marks.
                </Instruction>
              )}
            </div>

            {/* Start */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <StartTestButton testId={test.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="px-4 py-5 text-center">
      <p className="text-xs font-medium text-slate-500">{label}</p>

      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Instruction({
  children,
  warning = false,
}: {
  children: React.ReactNode;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-sm leading-6 ${
        warning
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {children}
    </div>
  );
}
