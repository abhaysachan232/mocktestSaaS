"use client";

import { useCallback, useState } from "react";

import { submitTestAttempt } from "@/actions/test-attempt.actions";

interface SubmitInput {
  testId: string;
  attemptId: string;
  answers: Record<string, string[]>;
  timeRemaining: number;
}

export function useTestSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async ({testId, attemptId, answers, timeRemaining }: SubmitInput) => {
      if (isSubmitting) {
        return {
          success: false,
          error: "Submission already in progress.",
        };
      }

      setIsSubmitting(true);
      setError(null);
      try {
        
        const response = await submitTestAttempt({
          testId,
          attemptId,
          answers,
          timeRemaining,
        });

        if (!response.success) {
          setError(response.error);

          return response;
        }

        setIsSubmitted(true);

        return response;
      } catch (error) {
        console.error("TEST_SUBMIT_ERROR:", error);

        const message = "Unable to submit test.";

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting],
  );

  return {
    submit,
    isSubmitting,
    isSubmitted,
    error,
  };
}
