// lib/scoring.ts
// Pure scoring logic — no DB calls here, so it's easy to unit test.

export type QuestionForScoring = {
  id: string;
  correctOptionIds: string[]; // ids of options where isCorrect = true
};

export type AnswerForScoring = {
  questionId: string;
  selectedOptionIds: string[];
  isAttempted: boolean;
};

export type TestForScoring = {
  totalMarks: number;
  totalQuestions: number;
  negativeMarking: boolean;
  negativeMarks: number | null; // marks deducted per wrong answer
};

export type ScoredAnswer = {
  questionId: string;
  isCorrect: boolean;
};

export type ScoreResult = {
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  accuracy: number; // % of attempted questions that were correct
  perQuestion: ScoredAnswer[];
};

function arraysEqualAsSets(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every((item) => setB.has(item));
}

/**
 * Computes the result for a submitted attempt.
 * Marks per question are derived as totalMarks / totalQuestions (equal
 * weighting), since the schema doesn't carry per-question marks.
 */
export function calculateResult(
  test: TestForScoring,
  questions: QuestionForScoring[],
  answers: AnswerForScoring[],
): ScoreResult {
  const marksPerQuestion =
    test.totalQuestions > 0 ? test.totalMarks / test.totalQuestions : 0;

  const negPerWrong =
    test.negativeMarking && test.negativeMarks ? test.negativeMarks : 0;

  const answerByQuestion = new Map(answers.map((a) => [a.questionId, a]));

  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;
  const perQuestion: ScoredAnswer[] = [];

  for (const question of questions) {
    const answer = answerByQuestion.get(question.id);

    if (!answer || !answer.isAttempted || answer.selectedOptionIds.length === 0) {
      unattemptedCount += 1;
      perQuestion.push({ questionId: question.id, isCorrect: false });
      continue;
    }

    const isCorrect = arraysEqualAsSets(
      answer.selectedOptionIds,
      question.correctOptionIds,
    );

    perQuestion.push({ questionId: question.id, isCorrect });

    if (isCorrect) {
      correctCount += 1;
      score += marksPerQuestion;
    } else {
      wrongCount += 1;
      score -= negPerWrong;
    }
  }

  // Score shouldn't go below 0 in most exam conventions; remove this
  // clamp if your exams allow negative totals.
  score = Math.max(0, score);

  const attempted = correctCount + wrongCount;
  const accuracy = attempted > 0 ? (correctCount / attempted) * 100 : 0;

  return {
    score: Math.round(score * 100) / 100,
    totalMarks: test.totalMarks,
    correctCount,
    wrongCount,
    unattemptedCount,
    accuracy: Math.round(accuracy * 100) / 100,
    perQuestion,
  };
}
