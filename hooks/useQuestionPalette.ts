"use client";

import { useCallback, useState } from "react";

import type { PaletteStatus } from "@/components/test-engine/palette/PaletteItem";

interface UseQuestionPaletteProps {
  questionIds: string[];
  answers: Record<string, string[]>;
}

export function useQuestionPalette({
  questionIds,
  answers,
}: UseQuestionPaletteProps) {
  // ----------------------------------------
  // Marked Questions
  // ----------------------------------------

  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(
    new Set(),
  );

  // ----------------------------------------
  // Visited Questions
  // ----------------------------------------

  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(
    new Set(questionIds.length > 0 ? [questionIds[0]] : []),
  );

  // ----------------------------------------
  // Mark Question As Visited
  // ----------------------------------------

  const markVisited = useCallback((questionId: string) => {
    setVisitedQuestions((previous) => {
      if (previous.has(questionId)) {
        return previous;
      }

      const next = new Set(previous);

      next.add(questionId);

      return next;
    });
  }, []);

  // ----------------------------------------
  // Toggle Mark For Review
  // ----------------------------------------

  const toggleMark = useCallback((questionId: string) => {
    setMarkedQuestions((previous) => {
      const next = new Set(previous);

      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }

      return next;
    });
  }, []);

  // ----------------------------------------
  // Check Marked
  // ----------------------------------------

  const isMarked = useCallback(
    (questionId: string) => {
      return markedQuestions.has(questionId);
    },
    [markedQuestions],
  );

  // ----------------------------------------
  // Get Question Status
  // ----------------------------------------

  const getStatus = useCallback(
    (index: number, currentIndex: number): PaletteStatus => {
      const questionId = questionIds[index];

      if (!questionId) {
        return "not-visited";
      }

      const isCurrent = index === currentIndex;

      const selectedOptions = answers[questionId] ?? [];

      const isAnswered = selectedOptions.length > 0;

      const isMarked = markedQuestions.has(questionId);

      const isVisited = visitedQuestions.has(questionId);

      /*
       * Current question gets highest priority.
       */

      if (isCurrent) {
        return "current";
      }

      /*
       * Answered + Marked
       */

      if (isAnswered && isMarked) {
        return "answered-marked";
      }

      /*
       * Marked but not answered
       */

      if (isMarked) {
        return "marked";
      }

      /*
       * Answered
       */

      if (isAnswered) {
        return "answered";
      }

      /*
       * Visited but unanswered
       */

      if (isVisited) {
        return "visited";
      }

      /*
       * Never visited
       */

      return "not-visited";
    },
    [questionIds, answers, markedQuestions, visitedQuestions],
  );

  // ----------------------------------------
  // Reset Palette
  // ----------------------------------------

  const resetPalette = useCallback(() => {
    setMarkedQuestions(new Set());

    setVisitedQuestions(
      new Set(questionIds.length > 0 ? [questionIds[0]] : []),
    );
  }, [questionIds]);

  // ----------------------------------------
  // Return
  // ----------------------------------------

  return {
    markedQuestions,
    visitedQuestions,

    markVisited,
    toggleMark,
    isMarked,
    getStatus,

    markedCount: markedQuestions.size,

    resetPalette,
  };
}
