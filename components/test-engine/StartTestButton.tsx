"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTestAttempt } from "@/actions/test-attempt.actions";

interface StartTestButtonProps {
  testId: string;
}

export default function StartTestButton({ testId }: StartTestButtonProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (isStarting) return;

    setIsStarting(true);
    setError(null);

    try {
      const response = await startTestAttempt(testId);

      if (!response.success) {
        setError(response.error);
        return;
      }

      router.push(
        `/student/tests/${testId}/attempt/${response.data.attemptId}`,
      );
    } catch (error) {
      console.error("START_TEST_ERROR:", error);

      setError("Unable to start the test. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={isStarting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isStarting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Starting Test...
          </>
        ) : (
          <>
            <Play className="h-5 w-5 fill-current" />
            Start Test
          </>
        )}
      </button>
    </div>
  );
}
