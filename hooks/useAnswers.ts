"use client";

import { useCallback, useMemo, useState } from "react";

import { saveAttemptAnswer } from "@/actions/test-attempt.actions";

type Answers = Record<string, string[]>;

type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAnswers(attemptId: string) {
  const [answers, setAnswers] = useState<Answers>({});

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const [saveError, setSaveError] = useState<string | null>(null);

  const selectAnswer = useCallback(
    async (
      questionId: string,
      optionId: string,
      questionType: QuestionType = "SINGLE_CHOICE",
    ) => {
      if (!attemptId) return;

      let nextSelectedOptions: string[];

      const current = answers[questionId] ?? [];

      if (questionType === "SINGLE_CHOICE") {
        nextSelectedOptions = [optionId];
      } else {
        const alreadySelected = current.includes(optionId);

        nextSelectedOptions = alreadySelected
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
      }

      // ----------------------------------------
      // Optimistic UI update
      // ----------------------------------------

      setAnswers((previous) => ({
        ...previous,
        [questionId]: nextSelectedOptions,
      }));

      // ----------------------------------------
      // Save to database
      // ----------------------------------------

      setSaveStatus("saving");
      setSaveError(null);

      try {
        const result = await saveAttemptAnswer(
          attemptId,
          questionId,
          nextSelectedOptions,
        );

        if (!result.success) {
          setSaveStatus("error");
          setSaveError(result.error);
          return;
        }

        setSaveStatus("saved");
      } catch (error) {
        console.error("SAVE_ANSWER_ERROR:", error);

        setSaveStatus("error");
        setSaveError("Unable to save answer");
      }
    },
    [attemptId, answers],
  );

  const clearAnswer = useCallback(
    async (questionId: string) => {
      if (!attemptId) return;

      // ----------------------------------------
      // Optimistic UI update
      // ----------------------------------------

      setAnswers((previous) => {
        const next = {
          ...previous,
        };

        delete next[questionId];

        return next;
      });

      setSaveStatus("saving");
      setSaveError(null);

      // ----------------------------------------
      // Clear from database
      // ----------------------------------------

      try {
        const result = await saveAttemptAnswer(attemptId, questionId, []);

        if (!result.success) {
          setSaveStatus("error");
          setSaveError(result.error);
          return;
        }

        setSaveStatus("saved");
      } catch (error) {
        console.error("CLEAR_ANSWER_ERROR:", error);

        setSaveStatus("error");
        setSaveError("Unable to clear answer");
      }
    },
    [attemptId],
  );

  const getAnswer = useCallback(
    (questionId: string) => {
      return answers[questionId] ?? [];
    },
    [answers],
  );

  const hasAnswer = useCallback(
    (questionId: string) => {
      return answers[questionId]?.length > 0;
    },
    [answers],
  );

  const attempted = useMemo(
    () =>
      Object.values(answers).filter(
        (selectedOptions) => selectedOptions.length > 0,
      ).length,
    [answers],
  );

  const resetAnswers = useCallback(() => {
    setAnswers({});
    setSaveStatus("idle");
    setSaveError(null);
  }, []);

  return {
    answers,
    selectAnswer,
    clearAnswer,
    getAnswer,
    hasAnswer,
    attempted,
    resetAnswers,
    saveStatus,
    saveError,
  };
}
