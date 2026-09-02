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
  test: TestEngineData,
  attemptId: string,
  onTimeExpired?: () => void,
) {
  // ----------------------------------------
  // Questions
  // ----------------------------------------

  const questions = test.testQuestions.map(
    (testQuestion) => testQuestion.question,
  );

  const questionIds = questions.map((question) => question.id);

  // ----------------------------------------
  // Current Question
  // ----------------------------------------

  const {
    currentIndex,
    currentQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    isFirstQuestion,
    isLastQuestion,
  } = useCurrentQuestion(questions);

  // ----------------------------------------
  // Answers
  // ----------------------------------------

  const {
    answers,
    selectAnswer,
    clearAnswer,
    getAnswer,
    attempted,
    resetAnswers,
    saveStatus,
    saveError,
  } = useAnswers(attemptId);

  // ----------------------------------------
  // Question Palette
  // ----------------------------------------

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

  // ----------------------------------------
  // Timer
  // ----------------------------------------

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

  // ----------------------------------------
  // Result
  // ----------------------------------------

  const result = useTestResult({
    questions,
    answers,
  });

  // ----------------------------------------
  // Submit
  // ----------------------------------------

  const { submit, isSubmitting, isSubmitted, error } = useTestSubmit();

  // ----------------------------------------
  // Go To Question
  // ----------------------------------------

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

  // ----------------------------------------
  // Select Current Answer
  // ----------------------------------------

  const selectCurrentAnswer = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;

      selectAnswer(currentQuestion.id, optionId, currentQuestion.type);
    },
    [currentQuestion, selectAnswer],
  );

  // ----------------------------------------
  // Clear Current Answer
  // ----------------------------------------

  const clearCurrentAnswer = useCallback(() => {
    if (!currentQuestion) return;

    clearAnswer(currentQuestion.id);
  }, [currentQuestion, clearAnswer]);

  // ----------------------------------------
  // Toggle Current Question Mark
  // ----------------------------------------

  const toggleCurrentMark = useCallback(() => {
    if (!currentQuestion) return;

    toggleMark(currentQuestion.id);
  }, [currentQuestion, toggleMark]);

  // ----------------------------------------
  // Reset Session
  // ----------------------------------------

  const resetSession = useCallback(() => {
    resetAnswers();
    resetPalette();
    resetTimer();
    goToQuestion(0);
  }, [resetAnswers, resetPalette, resetTimer, goToQuestion]);

  // ----------------------------------------
  // Return
  // ----------------------------------------

  return {
    // Questions
    questions,
    currentIndex,
    currentQuestion,

    // Navigation
    goTo,
    nextQuestion,
    previousQuestion,
    isFirstQuestion,
    isLastQuestion,

    // Answers
    answers,
    attempted,
    selectAnswer,
    selectCurrentAnswer,
    clearAnswer,
    clearCurrentAnswer,
    getAnswer,

    // Answer persistence
    saveStatus,
    saveError,

    // Question Palette
    markedQuestions,
    markedCount,
    markVisited,
    toggleMark,
    toggleCurrentMark,
    isMarked,
    getStatus,

    // Timer
    remainingSeconds,
    isRunning,
    startTimer: start,
    pauseTimer: pause,
    resetTimer,

    // Result
    result,

    // Submit
    submit,
    isSubmitting,
    isSubmitted,
    submitError: error,

    // Session
    resetSession,
  };
}
