"use client";

import { useMemo } from "react";

import type {
  TestEngineQuestion,
} from "@/components/test-engine/TestEngine";

export function useQuestions(
  questions: TestEngineQuestion[]
) {
  const normalizedQuestions = useMemo(
    () => questions ?? [],
    [questions]
  );

  const totalQuestions =
    normalizedQuestions.length;

  return {
    questions: normalizedQuestions,
    totalQuestions,
  };
}