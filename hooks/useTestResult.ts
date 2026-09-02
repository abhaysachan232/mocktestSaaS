"use client";

import { useMemo } from "react";

import type { TestEngineQuestion } from "@/components/test-engine/TestEngine";

interface UseTestResultProps {
  questions: TestEngineQuestion[];
  answers: Record<string, string[]>;
}

function areSameOptions(
  selectedOptionIds: string[],
  correctOptionIds: string[],
): boolean {
  if (selectedOptionIds.length !== correctOptionIds.length) {
    return false;
  }

  const selected = new Set(selectedOptionIds);

  const correct = new Set(correctOptionIds);

  if (selected.size !== correct.size) {
    return false;
  }

  for (const optionId of correct) {
    if (!selected.has(optionId)) {
      return false;
    }
  }

  return true;
}

export function useTestResult({ questions, answers }: UseTestResultProps) {
  return useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    let positiveMarks = 0;
    let negativeMarks = 0;

    questions.forEach((question) => {
      const selectedOptionIds = answers[question.id] ?? [];

      /*
       * No selected option
       */

      if (selectedOptionIds.length === 0) {
        unanswered++;
        return;
      }

      /*
       * Correct option IDs come from
       * QuestionOption.isCorrect
       */

      const correctOptionIds = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.id);

      /*
       * Compare selected IDs with
       * correct IDs.
       */

      const isCorrect = areSameOptions(selectedOptionIds, correctOptionIds);

      const marks = question.marks ?? 1;

      const negative = question.negativeMarks ?? 0;

      if (isCorrect) {
        correct++;

        positiveMarks += marks;
      } else {
        incorrect++;

        negativeMarks += negative;
      }
    });

    const totalQuestions = questions.length;

    const attempted = correct + incorrect;

    const score = positiveMarks - negativeMarks;

    const totalMarks = questions.reduce(
      (total, question) => total + (question.marks ?? 1),
      0,
    );

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

    return {
      totalQuestions,

      attempted,
      correct,
      incorrect,
      unanswered,

      positiveMarks,
      negativeMarks,

      score,
      totalMarks,

      percentage: Number(percentage.toFixed(2)),
    };
  }, [questions, answers]);
}
