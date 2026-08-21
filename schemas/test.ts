import { z } from "zod";

export const testSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Test name is required")
      .max(100, "Test name is too long"),
    slug: z
      .string()
      .trim()
      .min(2, "Slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers and hyphens only",
      ),
    description: z.string().trim().max(500, "Description is too long"),
    examId: z.string().min(1, "Please select an exam"),
    testType: z.enum([
      "PRACTICE",
      "MOCK",
      "FULL_LENGTH",
      "SUBJECT_WISE",
      "TOPIC_WISE",
    ]),
    duration: z.number().int().positive("Duration must be greater than 0"),
    totalMarks: z.number().int().positive("Total marks must be greater than 0"),
    totalQuestions: z
      .number()
      .int()
      .positive("Total questions must be greater than 0"),
    negativeMarking: z.boolean(),
    negativeMarks: z
      .number()
      .positive("Negative marks must be greater than 0")
      .nullable(),

    questionIds: z
      .array(z.string())
      .min(1, "Please select at least one question"),
  })
  .superRefine((data, ctx) => {
    if (data.negativeMarking && data.negativeMarks === null) {
      ctx.addIssue({
        code: "custom",
        path: ["negativeMarks"],
        message: "Negative marks are required",
      });
    }
    if (data.totalQuestions !== data.questionIds.length) {
      ctx.addIssue({
        code: "custom",
        path: ["totalQuestions"],
        message: "Total questions must match selected questions",
      });
    }
  });

export type TestFormValues = z.infer<typeof testSchema>;
