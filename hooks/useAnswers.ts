"use client";

import { useCallback, useMemo, useState } from "react";

type Answers = Record<string, string>;

export function useAnswers() {
  const [answers, setAnswers] =
    useState<Answers>({});

  const selectAnswer = useCallback(
    (
      questionId: string,
      optionId: string
    ) => {
      setAnswers((previous) => ({
        ...previous,
        [questionId]: optionId,
      }));
    },
    []
  );

  const clearAnswer = useCallback(
    (questionId: string) => {
      setAnswers((previous) => {
        const next = { ...previous };

        delete next[questionId];

        return next;
      });
    },
    []
  );

  const getAnswer = useCallback(
    (questionId: string) => {
      return answers[questionId] ?? null;
    },
    [answers]
  );

  const hasAnswer = useCallback(
    (questionId: string) => {
      return Boolean(answers[questionId]);
    },
    [answers]
  );

  const attempted = useMemo(
    () =>
      Object.keys(answers).filter(
        (key) => Boolean(answers[key])
      ).length,
    [answers]
  );

  const resetAnswers = useCallback(() => {
    setAnswers({});
  }, []);

  return {
    answers,
    selectAnswer,
    clearAnswer,
    getAnswer,
    hasAnswer,
    attempted,
    resetAnswers,
  };
}