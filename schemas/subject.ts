import { z } from "zod";

export const subjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Subject name is required")
    .max(100, "Subject name is too long"),
});

export type SubjectInput = z.infer<typeof subjectSchema>;
