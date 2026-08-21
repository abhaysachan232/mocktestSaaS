import { z } from "zod";

const richContentSchema = z.object({
  type: z.string(),
  content: z.array(z.any()).optional(),
});

const optionSchema = z.object({
  content: richContentSchema,
  isCorrect: z.boolean(),
});

export const questionSchema = z
  .object({
    subjectId: z.string().min(1),
    topicId: z.string().min(1),
    type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]),
    content: richContentSchema,
    options: z.array(optionSchema).min(2).max(10),
  })
  .superRefine((data, ctx) => {
    const correctCount = data.options.filter(
      (option) => option.isCorrect,
    ).length;

    if (correctCount === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "At least one correct answer is required",
      });
    }

    if (data.type === "SINGLE_CHOICE" && correctCount !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Single choice must have exactly one correct answer",
      });
    }
  });

export type QuestionFormInput = z.infer<typeof questionSchema>;
