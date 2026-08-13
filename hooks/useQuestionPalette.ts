"use client";

import { useCallback, useState } from "react";

import type { PaletteStatus } from "@/components/test-engine/palette/PaletteItem";

interface UseQuestionPaletteProps {
  questionIds: string[];
  answers: Record<string, string>;
}

export function useQuestionPalette({
  questionIds,
  answers,
}: UseQuestionPaletteProps) {
  const [markedQuestions, setMarkedQuestions] =
    useState<Set<string>>(new Set());

  const [visitedQuestions, setVisitedQuestions] =
    useState<Set<string>>(
      new Set(
        questionIds.length > 0
          ? [questionIds[0]]
          : []
      )
    );

  const markVisited = useCallback(
    (questionId: string) => {
      setVisitedQuestions((previous) => {
        const next = new Set(previous);

        next.add(questionId);

        return next;
      });
    },
    []
  );

  const toggleMark = useCallback(
    (questionId: string) => {
      setMarkedQuestions((previous) => {
        const next = new Set(previous);

        if (next.has(questionId)) {
          next.delete(questionId);
        } else {
          next.add(questionId);
        }

        return next;
      });
    },
    []
  );

  const isMarked = useCallback(
    (questionId: string) => {
      return markedQuestions.has(questionId);
    },
    [markedQuestions]
  );

  const getStatus = useCallback(
    (
      index: number,
      currentIndex: number
    ): PaletteStatus => {
      const questionId =
        questionIds[index];

      if (!questionId) {
        return "not-visited";
      }

      const isCurrent =
        index === currentIndex;

      const isAnswered =
        Boolean(answers[questionId]);

      const isMarked =
        markedQuestions.has(questionId);

      const isVisited =
        visitedQuestions.has(questionId);

      if (isCurrent) {
        return "current";
      }

      if (isAnswered && isMarked) {
        return "answered-marked";
      }

      if (isMarked) {
        return "marked";
      }

      if (isAnswered) {
        return "answered";
      }

      if (isVisited) {
        return "visited";
      }

      return "not-visited";
    },
    [
      questionIds,
      answers,
      markedQuestions,
      visitedQuestions,
    ]
  );

  const resetPalette = useCallback(() => {
    setMarkedQuestions(new Set());

    setVisitedQuestions(
      new Set(
        questionIds.length > 0
          ? [questionIds[0]]
          : []
      )
    );
  }, [questionIds]);

  return {
    markedQuestions,
    visitedQuestions,

    markVisited,
    toggleMark,
    isMarked,
    getStatus,

    markedCount:
      markedQuestions.size,

    resetPalette,
  };
}