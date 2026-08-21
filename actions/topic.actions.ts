"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { topicSchema, updateTopicSchema } from "@/schemas/topic";

export async function createTopic(input: unknown) {
  const validation = topicSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid topic data",
    };
  }

  const { subjectId, name } = validation.data;

  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
    });

    if (!subject) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    const existing = await prisma.topic.findFirst({
      where: {
        subjectId,
        name,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Topic already exists under this subject",
      };
    }

    const topic = await prisma.topic.create({
      data: {
        subjectId,
        name,
      },
    });

    revalidatePath(`/subjects/${subjectId}`);

    revalidatePath("/subjects");

    return {
      success: true,
      data: topic,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to create topic",
    };
  }
}

export async function updateTopic(id: string, input: unknown) {
  const validation = updateTopicSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid topic name",
    };
  }

  const { name } = validation.data;

  try {
    const topic = await prisma.topic.findUnique({
      where: {
        id,
      },
    });

    if (!topic) {
      return {
        success: false,
        error: "Topic not found",
      };
    }

    const duplicate = await prisma.topic.findFirst({
      where: {
        subjectId: topic.subjectId,
        name,
        NOT: {
          id,
        },
      },
    });

    if (duplicate) {
      return {
        success: false,
        error: "Topic already exists",
      };
    }

    const updated = await prisma.topic.update({
      where: {
        id,
      },

      data: {
        name,
      },
    });

    revalidatePath(`/subjects/${topic.subjectId}`);

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to update topic",
    };
  }
}

export async function deleteTopic(id: string) {
  try {
    const topic = await prisma.topic.findUnique({
      where: {
        id,
      },

      include: {
        _count: {
          select: {
            questions: true,
            examTopics: true,
          },
        },
      },
    });

    if (!topic) {
      return {
        success: false,
        error: "Topic not found",
      };
    }

    if (topic._count.questions > 0 || topic._count.examTopics > 0) {
      return {
        success: false,
        error: "Topic is already in use and cannot be deleted",
      };
    }

    await prisma.topic.delete({
      where: {
        id,
      },
    });

    revalidatePath(`/subjects/${topic.subjectId}`);
    revalidatePath("/subjects");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to delete topic",
    };
  }
}
