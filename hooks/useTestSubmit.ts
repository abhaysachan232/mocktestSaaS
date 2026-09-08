"use client";

import { useCallback, useState } from "react";

import { submitTestAttempt } from "@/actions/test-attempt.actions";

// ============================================================
// TYPES
// ============================================================

interface SubmitInput {
  attemptId: string;
}

export type SubmitResponse =
  | {
      success: true;
      data: {
        resultId: string;
        attemptId: string;
      };
      message?: string;
    }
  | {
      success: false;
      message: string;
    };

// ============================================================
// HOOK
// ============================================================

export function useTestSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const submit = useCallback(
    async ({
      attemptId,
    }: SubmitInput): Promise<SubmitResponse> => {
      // ------------------------------------------------------
      // Validate attempt
      // ------------------------------------------------------

      if (!attemptId) {
        const response: SubmitResponse = {
          success: false,
          message: "Invalid test attempt.",
        };

        setError(response.message);

        return response;
      }

      // ------------------------------------------------------
      // Prevent duplicate submission
      // ------------------------------------------------------

      if (isSubmitting) {
        return {
          success: false,
          message: "Submission already in progress.",
        };
      }

      if (isSubmitted) {
        return {
          success: false,
          message: "Test has already been submitted.",
        };
      }

      // ------------------------------------------------------
      // Start submission
      // ------------------------------------------------------

      setIsSubmitting(true);
      setError(null);

      try {
        const response = await submitTestAttempt(attemptId);

        // ----------------------------------------------------
        // Server failure
        // ----------------------------------------------------

        if (!response.success) {
          setError(response.message);

          return response;
        }

        // ----------------------------------------------------
        // Server success
        // ----------------------------------------------------

        setIsSubmitted(true);
        setError(null);

        return response;
      } catch (error) {
        console.error("SUBMIT_TEST_ERROR:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to submit the test. Please try again.";

        setError(message);

        return {
          success: false,
          message,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, isSubmitted],
  );

  // ==========================================================
  // RESET
  // ==========================================================

  const resetSubmit = useCallback(() => {
    setIsSubmitting(false);
    setIsSubmitted(false);
    setError(null);
  }, []);

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    submit,
    isSubmitting,
    isSubmitted,
    error,
    resetSubmit,
  };
}