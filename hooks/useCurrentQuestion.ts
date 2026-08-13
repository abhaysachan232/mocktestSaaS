"use client";

import { useCallback, useMemo, useState } from "react";

import type {
  TestEngineQuestion,
} from "@/components/test-engine/TestEngine";

export function useCurrentQuestion(
  questions: TestEngineQuestion[]
) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const currentQuestion = useMemo(
    () => questions[currentIndex] ?? null,
    [questions, currentIndex]
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (
        index < 0 ||
        index >= questions.length
      ) {
        return;
      }

      setCurrentIndex(index);
    },
    [questions.length]
  );

  const nextQuestion = useCallback(() => {
    setCurrentIndex((current) =>
      Math.min(
        current + 1,
        questions.length - 1
      )
    );
  }, [questions.length]);

  const previousQuestion = useCallback(() => {
    setCurrentIndex((current) =>
      Math.max(current - 1, 0)
    );
  }, []);

  return {
    currentIndex,
    currentQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,

    isFirstQuestion: currentIndex === 0,

    isLastQuestion:
      currentIndex ===
      questions.length - 1,
  };
}