import { IQuestion } from '../models/Test';

export function calculateGrade(
  questions: IQuestion[],
  answers: number[]
) {
  let totalScore = 0;

  const subjectMap: Record<
    string,
    {
      correct: number;
      total: number;
      marks: number;
      totalMarks: number;
    }
  > = {};

  questions.forEach((question, index) => {
    const subject = question.subject;

    if (!subjectMap[subject]) {
      subjectMap[subject] = {
        correct: 0,
        total: 0,
        marks: 0,
        totalMarks: 0,
      };
    }

    subjectMap[subject].total += 1;

    subjectMap[subject].totalMarks += question.marks;

    if (answers[index] === question.correctIndex) {
      subjectMap[subject].correct += 1;

      subjectMap[subject].marks += question.marks;

      totalScore += question.marks;
    }
  });

  const subjectScores = Object.entries(subjectMap).map(
    ([subject, value]) => ({
      subject,

      correct: value.correct,

      total: value.total,

      marks: value.marks,

      totalMarks: value.totalMarks,

      percentage: Math.round(
        (value.marks / value.totalMarks) * 100
      ),
    })
  );

  return {
    score: totalScore,
    subjectScores,
  };
}