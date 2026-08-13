"use client";

import { useMemo } from "react";

import type {
  TestEngineQuestion,
} from "@/components/test-engine/TestEngine";

interface UseTestResultProps {
  questions: TestEngineQuestion[];
  answers: Record<string, string>;
}

export function useTestResult({
  questions,
  answers,
}: UseTestResultProps) {
  return useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    let positiveMarks = 0;
    let negativeMarks = 0;

    questions.forEach((question) => {
      const selectedAnswer =
        answers[question.id];

      const marks = question.marks ?? 1;

      const negative =
        question.negativeMarks ?? 0;

      if (!selectedAnswer) {
        unanswered++;
        return;
      }

      if (
        selectedAnswer ===
        question.correctAnswer
      ) {
        correct++;
        positiveMarks += marks;
      } else {
        incorrect++;
        negativeMarks += negative;
      }
    });

    const totalQuestions =
      questions.length;

    const attempted =
      correct + incorrect;

    const score =
      positiveMarks - negativeMarks;

    const totalMarks = questions.reduce(
      (total, question) =>
        total + (question.marks ?? 1),
      0
    );

    const percentage =
      totalMarks > 0
        ? (score / totalMarks) * 100
        : 0;

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

      percentage: Number(
        percentage.toFixed(2)
      ),
    };
  }, [questions, answers]);
}