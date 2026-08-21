import { z } from "zod";

export const examSchema = z.object({
  name: z
    .string()
    .min(2, "Exam name must be at least 2 characters")
    .max(100, "Exam name is too long"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can contain lowercase letters, numbers and hyphens only",
    ),
  description: z.string().max(500, "Description is too long").optional(),
  subjectIds: z.array(z.string()).min(1, "Select at least one subject"),
  topicIds: z.array(z.string()),
});

export type ExamFormValues = z.infer<typeof examSchema>;
