"use client";

import { useCallback, useState } from "react";

interface SubmitTestPayload {
  testId: string;
  answers: Record<string, string>;
  markedQuestions: string[];
  timeRemaining: number;
}

export function useTestSubmit() {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const submit = useCallback(
    async (
      payload: SubmitTestPayload
    ) => {
      try {
        setIsSubmitting(true);
        setError(null);

        /*
         * Static version:
         * API call later.
         *
         * Example:
         *
         * const response = await fetch(
         *   "/api/test/submit",
         *   {
         *     method: "POST",
         *     headers: {
         *       "Content-Type":
         *         "application/json",
         *     },
         *     body: JSON.stringify(payload),
         *   }
         * );
         */

        console.log(
          "Static test submission:",
          payload
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 300)
        );

        setIsSubmitted(true);

        return {
          success: true,
          data: payload,
        };
      } catch (err) {
        console.error(err);

        setError(
          "Unable to submit test."
        );

        return {
          success: false,
          data: null,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setIsSubmitted(false);
    setError(null);
  }, []);

  return {
    submit,
    reset,

    isSubmitting,
    isSubmitted,
    error,
  };
}