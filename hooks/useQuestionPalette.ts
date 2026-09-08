"use client";

import { useCallback, useMemo, useState } from "react";

type AnswerMap = Record<string, string[]>;

export type QuestionStatus =
  | "current"
  | "answered"
  | "marked"
  | "answered-marked"
  | "visited"
  | "not-visited";

interface UseQuestionPaletteOptions {
  questionIds: string[];
  answers: AnswerMap;
  initialMarkedQuestions?: string[];
}

export function useQuestionPalette({
  questionIds,
  answers,
  initialMarkedQuestions = [],
}: UseQuestionPaletteOptions) {
  /*
   * ----------------------------------------
   * Marked Questions
   * ----------------------------------------
   */

  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(
    () => new Set(initialMarkedQuestions),
  );

  /*
   * ----------------------------------------
   * Visited Questions
   * ----------------------------------------
   */

  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(
    () => new Set(),
  );

  /*
   * ----------------------------------------
   * Mark / Unmark
   * ----------------------------------------
   */

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

  /*
   * ----------------------------------------
   * Explicit Mark
   * ----------------------------------------
   */

  const markQuestion = useCallback((questionId: string) => {
    setMarkedQuestions((previous) => {
      if (previous.has(questionId)) {
        return previous;
      }

      const next = new Set(previous);
      next.add(questionId);

      return next;
    });
  }, []);

  /*
   * ----------------------------------------
   * Explicit Unmark
   * ----------------------------------------
   */

  const unmarkQuestion = useCallback((questionId: string) => {
    setMarkedQuestions((previous) => {
      if (!previous.has(questionId)) {
        return previous;
      }

      const next = new Set(previous);
      next.delete(questionId);

      return next;
    });
  }, []);

  /*
   * ----------------------------------------
   * Check Mark
   * ----------------------------------------
   */

  const isMarked = useCallback(
    (questionId: string) => {
      return markedQuestions.has(questionId);
    },
    [markedQuestions],
  );

  /*
   * ----------------------------------------
   * Mark Visited
   * ----------------------------------------
   */

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

  /*
   * ----------------------------------------
   * Check Visited
   * ----------------------------------------
   */

  const isVisited = useCallback(
    (questionId: string) => {
      return visitedQuestions.has(questionId);
    },
    [visitedQuestions],
  );

  /*
   * ----------------------------------------
   * Get Answered State
   * ----------------------------------------
   */

  const isAnswered = useCallback(
    (questionId: string) => {
      const selectedOptions = answers[questionId];

      return Array.isArray(selectedOptions) && selectedOptions.length > 0;
    },
    [answers],
  );

  /*
   * ----------------------------------------
   * Question Status
   *
   * Priority:
   *
   * current
   * ↓
   * answered + marked
   * ↓
   * marked
   * ↓
   * answered
   * ↓
   * visited
   * ↓
   * not visited
   * ----------------------------------------
   */

  const getQuestionStatus = useCallback(
    (questionIndex: number, currentQuestionIndex: number): QuestionStatus => {
      const questionId = questionIds[questionIndex];

      if (!questionId) {
        return "not-visited";
      }

      if (questionIndex === currentQuestionIndex) {
        return "current";
      }

      const answered = isAnswered(questionId);
      const marked = isMarked(questionId);
      const visited = isVisited(questionId);

      if (answered && marked) {
        return "answered-marked";
      }

      if (marked) {
        return "marked";
      }

      if (answered) {
        return "answered";
      }

      if (visited) {
        return "visited";
      }

      return "not-visited";
    },
    [questionIds, isAnswered, isMarked, isVisited],
  );

  /*
   * ----------------------------------------
   * Alias
   *
   * Existing TestEngine code may be using
   * getStatus(...)
   * ----------------------------------------
   */

  const getStatus = getQuestionStatus;

  /*
   * ----------------------------------------
   * Counts
   * ----------------------------------------
   */

  const markedCount = useMemo(() => markedQuestions.size, [markedQuestions]);

  const visitedCount = useMemo(() => visitedQuestions.size, [visitedQuestions]);

  const answeredCount = useMemo(
    () => questionIds.filter((questionId) => isAnswered(questionId)).length,
    [questionIds, isAnswered],
  );

  /*
   * ----------------------------------------
   * Reset
   * ----------------------------------------
   */

  const resetPalette = useCallback(() => {
    setMarkedQuestions(new Set());
    setVisitedQuestions(new Set());
  }, []);

  /*
   * ----------------------------------------
   * Return
   * ----------------------------------------
   */

  return {
    markedQuestions,
    visitedQuestions,

    markedCount,
    visitedCount,
    answeredCount,

    markVisited,

    toggleMark,
    markQuestion,
    unmarkQuestion,

    isMarked,
    isVisited,
    isAnswered,

    getQuestionStatus,
    getStatus,

    resetPalette,
  };
}
