import { z } from "zod";

export const examSchema = z.object({
  name: z.string().min(1),
  examDate: z.date(),
  duration: z.number(),
  totalMarks: z.number(),
  totalQuestions: z.number(),
  subjectIds: z.array(z.string()),
  topics: z.array(
    z.object({
      subjectId: z.string(),
      topicId: z.string(),
    }),
  ),
});

export type ExamFormValues = z.infer<typeof examSchema>;
