import { z } from "zod";

export const topicSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  name: z
    .string()
    .trim()
    .min(2, "Topic name is required")
    .max(100, "Topic name is too long"),
});

export const updateTopicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Topic name is required")
    .max(100, "Topic name is too long"),
});

export type TopicInput = z.infer<typeof topicSchema>;
