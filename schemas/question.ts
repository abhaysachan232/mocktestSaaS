import { z } from "zod";

const jsonContentSchema = z.object({
  type: z.string(),
  content: z.array(z.any()).optional(),
  attrs: z.record(z.string(), z.any()).optional(),
});

export const questionSchema = z
  .object({
    subjectId: z.string().min(1, "Subject is required"),
    topicId: z.string().min(1, "Topic is required"),
    type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]),
    content: jsonContentSchema,
    options: z
      .array(
        z.object({
          content: jsonContentSchema,
          isCorrect: z.boolean(),
        }),
      )
      .min(2, "At least 2 options are required"),
  })
  .superRefine((data, ctx) => {
    const correctCount = data.options.filter(
      (option) => option.isCorrect,
    ).length;

    if (correctCount === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Select at least one correct option",
      });
    }

    if (data.type === "SINGLE_CHOICE" && correctCount !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Single choice question must have exactly one correct option",
      });
    }

    if (data.type === "MULTIPLE_CHOICE" && correctCount < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message:
          "Multiple choice question must have at least one correct option",
      });
    }
  });

export type QuestionSchemaInput = z.infer<typeof questionSchema>;

export const questionOptionSchema = z.object({
  content: jsonContentSchema,
  isCorrect: z.boolean(),
});

export const questionFormSchema = z
  .object({
    subjectId: z.string().min(1, "Please select a subject"),

    topicId: z.string().min(1, "Please select a topic"),

    type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]),

    content: jsonContentSchema,

    options: z
      .array(questionOptionSchema)
      .min(2, "At least 2 options are required"),
  })
  .superRefine((data, ctx) => {
    const correctOptions = data.options.filter((option) => option.isCorrect);

    if (correctOptions.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Please select at least one correct option",
      });
    }

    if (data.type === "SINGLE_CHOICE" && correctOptions.length !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Single choice question can have only one correct option",
      });
    }
  });

export type QuestionFormValues = z.infer<typeof questionFormSchema>;
