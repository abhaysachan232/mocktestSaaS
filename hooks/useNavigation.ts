"use client";

import { useCallback } from "react";

interface UseNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onChange: (index: number) => void;
}

export function useNavigation({
  currentIndex,
  totalQuestions,
  onChange,
}: UseNavigationProps) {
  const goToQuestion = useCallback(
    (index: number) => {
      if (
        index < 0 ||
        index >= totalQuestions
      ) {
        return;
      }

      onChange(index);
    },
    [onChange, totalQuestions]
  );

  const next = useCallback(() => {
    if (
      currentIndex <
      totalQuestions - 1
    ) {
      onChange(currentIndex + 1);
    }
  }, [
    currentIndex,
    totalQuestions,
    onChange,
  ]);

  const previous = useCallback(() => {
    if (currentIndex > 0) {
      onChange(currentIndex - 1);
    }
  }, [currentIndex, onChange]);

  return {
    next,
    previous,
    goToQuestion,

    isFirst:
      currentIndex === 0,

    isLast:
      currentIndex ===
      totalQuestions - 1,
  };
}