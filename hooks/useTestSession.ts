"use client";

import { useCallback } from "react";

import type { TestEngineData } from "@/components/test-engine/TestEngine";

import { useAnswers } from "./useAnswers";
import { useCurrentQuestion } from "./useCurrentQuestion";
import { useQuestionPalette } from "./useQuestionPalette";
import { useTimer } from "./useTimer";
import { useTestSubmit } from "./useTestSubmit";

export function useTestSession(
  test: TestEngineData,
  attemptId: string,
  expiresAt: Date | string | number,
  onTimeExpired?: () => void,
) {
  // ==========================================================
  // QUESTIONS
  // ==========================================================

  const questions = test.testQuestions.map(
    (testQuestion) => testQuestion.question,
  );

  const questionIds = questions.map(
    (question) => question.id,
  );

  // ==========================================================
  // CURRENT QUESTION
  // ==========================================================

  const {
    currentIndex,
    currentQuestion,
    goToQuestion,
    isFirstQuestion,
    isLastQuestion,
  } = useCurrentQuestion(questions);

  // ==========================================================
  // ANSWERS
  // ==========================================================

  const {
    answers,
    selectAnswer,
    clearAnswer,
    getAnswer,
    hasAnswer,
    attempted,
    resetAnswers,
    saveStatus,
    saveError,
    isLoading: isAnswersLoading,
  } = useAnswers(attemptId);

  // ==========================================================
  // QUESTION PALETTE
  // ==========================================================

  const {
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
  } = useQuestionPalette({
    questionIds,
    answers,
  });

  // ==========================================================
  // SERVER AUTHORITATIVE TIMER
  // ==========================================================

  const {
    remainingSeconds,
    isRunning,
    start,
    pause,
    reset: resetTimer,
  } = useTimer({
    expiresAt,
    autoStart: false,
    onComplete: onTimeExpired,
  });

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const {
    submit,
    isSubmitting,
    isSubmitted,
    error: submitError,
    resetSubmit,
  } = useTestSubmit();

  // ==========================================================
  // GO TO QUESTION
  // ==========================================================

  const goTo = useCallback(
    (index: number) => {
      if (
        index < 0 ||
        index >= questions.length
      ) {
        return;
      }

      goToQuestion(index);

      const question = questions[index];

      if (question) {
        markVisited(question.id);
      }
    },
    [
      questions,
      goToQuestion,
      markVisited,
    ],
  );

  // ==========================================================
  // SELECT CURRENT ANSWER
  // ==========================================================

  const selectCurrentAnswer = useCallback(
    (optionId: string) => {
      if (!currentQuestion) {
        return;
      }

      selectAnswer(
        currentQuestion.id,
        optionId,
        currentQuestion.type,
      );
    },
    [
      currentQuestion,
      selectAnswer,
    ],
  );

  // ==========================================================
  // CLEAR CURRENT ANSWER
  // ==========================================================

  const clearCurrentAnswer = useCallback(() => {
    if (!currentQuestion) {
      return;
    }

    clearAnswer(currentQuestion.id);
  }, [
    currentQuestion,
    clearAnswer,
  ]);

  // ==========================================================
  // TOGGLE CURRENT MARK
  // ==========================================================

  const toggleCurrentMark = useCallback(() => {
    if (!currentQuestion) {
      return;
    }

    toggleMark(currentQuestion.id);
  }, [
    currentQuestion,
    toggleMark,
  ]);

  // ==========================================================
  // NEXT QUESTION
  // ==========================================================

  const goToNextQuestion = useCallback(() => {
    if (isLastQuestion) {
      return;
    }

    goTo(currentIndex + 1);
  }, [
    currentIndex,
    isLastQuestion,
    goTo,
  ]);

  // ==========================================================
  // PREVIOUS QUESTION
  // ==========================================================

  const goToPreviousQuestion = useCallback(() => {
    if (isFirstQuestion) {
      return;
    }

    goTo(currentIndex - 1);
  }, [
    currentIndex,
    isFirstQuestion,
    goTo,
  ]);

  // ==========================================================
  // RESET SESSION
  // ==========================================================

  const resetSession = useCallback(() => {
    resetAnswers();
    resetPalette();
    resetTimer();
    resetSubmit();

    goToQuestion(0);

    const firstQuestion = questions[0];

    if (firstQuestion) {
      markVisited(firstQuestion.id);
    }
  }, [
    resetAnswers,
    resetPalette,
    resetTimer,
    resetSubmit,
    goToQuestion,
    questions,
    markVisited,
  ]);

  // ==========================================================
  // SUMMARY
  // ==========================================================

  const totalQuestions = questions.length;

  const unanswered = Math.max(
    0,
    totalQuestions - attempted,
  );

  const summary = {
    totalQuestions,
    attempted,
    unanswered,
    marked: markedCount,
    visited: visitedCount,
  };

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    questions,
    questionIds,

    currentIndex,
    currentQuestion,

    goTo,
    goToQuestion,

    nextQuestion: goToNextQuestion,
    previousQuestion: goToPreviousQuestion,

    isFirstQuestion,
    isLastQuestion,

    answers,
    attempted,

    hasAnswer,
    getAnswer,

    selectAnswer,
    selectCurrentAnswer,

    clearAnswer,
    clearCurrentAnswer,

    resetAnswers,

    saveStatus,
    saveError,
    isAnswersLoading,

    markedQuestions,
    visitedQuestions,

    markedCount,
    visitedCount,
    answeredCount,

    markVisited,
    toggleMark,
    toggleCurrentMark,

    markQuestion,
    unmarkQuestion,

    isMarked,
    isVisited,
    isAnswered,

    getQuestionStatus,
    getStatus,

    resetPalette,

    // ========================================================
    // TIMER
    // ========================================================

    remainingSeconds,
    isRunning,

    startTimer: start,
    pauseTimer: pause,
    resetTimer,

    // ========================================================
    // SUBMIT
    // ========================================================

    submit,
    isSubmitting,
    isSubmitted,
    submitError,

    // ========================================================
    // SUMMARY
    // ========================================================

    summary,

    totalQuestions,
    unanswered,

    resetSession,
  };
}