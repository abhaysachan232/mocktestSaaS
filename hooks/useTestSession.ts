"use client";

import { useCallback } from "react";
import type { TestEngineData } from "@/components/test-engine/TestEngine";
import { useAnswers } from "./useAnswers";
import { useCurrentQuestion } from "./useCurrentQuestion";
import { useQuestionPalette } from "./useQuestionPalette";
import { useTimer } from "./useTimer";
import { useTestResult } from "./useTestResult";
import { useTestSubmit } from "./useTestSubmit";

export function useTestSession(
  test: any, // TestEngineData,
  onTimeExpired?: () => void,
) {
  const questions = test.testQuestions;
  const questionIds = questions.map((question) => question.id);

  const {
    currentIndex,
    currentQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    isFirstQuestion,
    isLastQuestion,
  } = useCurrentQuestion(questions);

  const {
    answers,
    selectAnswer,
    clearAnswer,
    getAnswer,
    attempted,
    resetAnswers,
  } = useAnswers();

  const {
    markedQuestions,
    markVisited,
    toggleMark,
    isMarked,
    getStatus,
    markedCount,
    resetPalette,
  } = useQuestionPalette({
    questionIds,
    answers,
  });

  const {
    remainingSeconds,
    isRunning,
    start,
    pause,
    reset: resetTimer,
  } = useTimer({
    initialSeconds: test.duration * 60,
    autoStart: false,
    onComplete: onTimeExpired,
  });

  const result = useTestResult({
    questions,
    answers,
  });

  const { submit, isSubmitting, isSubmitted, error } = useTestSubmit();

  const goTo = useCallback(
    (index: number) => {
      goToQuestion(index);
      const question = questions[index];
      if (question) {
        markVisited(question.id);
      }
    },
    [goToQuestion, questions, markVisited],
  );

  const selectCurrentAnswer = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      selectAnswer(currentQuestion.id, optionId);
    },
    [currentQuestion, selectAnswer],
  );

  const clearCurrentAnswer = useCallback(() => {
    if (!currentQuestion) return;
    clearAnswer(currentQuestion.id);
  }, [currentQuestion, clearAnswer]);

  const toggleCurrentMark = useCallback(() => {
    if (!currentQuestion) return;
    toggleMark(currentQuestion.id);
  }, [currentQuestion, toggleMark]);

  const resetSession = useCallback(() => {
    resetAnswers();
    resetPalette();
    resetTimer();
    goToQuestion(0);
  }, [resetAnswers, resetPalette, resetTimer, goToQuestion]);
  return {
    questions,
    currentIndex,
    currentQuestion,
    goTo,
    nextQuestion,
    previousQuestion,
    isFirstQuestion,
    isLastQuestion,
    answers,
    attempted,
    selectAnswer,
    selectCurrentAnswer,
    clearAnswer,
    clearCurrentAnswer,
    getAnswer,
    markedQuestions,
    markedCount,
    markVisited,
    toggleMark,
    toggleCurrentMark,
    isMarked,
    getStatus,
    remainingSeconds,
    isRunning,
    startTimer: start,
    pauseTimer: pause,
    resetTimer,
    result,
    submit,
    isSubmitting,
    isSubmitted,
    submitError: error,
    resetSession,
  };
}
