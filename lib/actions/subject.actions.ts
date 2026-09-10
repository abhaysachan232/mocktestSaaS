"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { subjectSchema } from "@/schemas/subject";

export async function getSubjects() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: "asc",
      },

      include: {
        _count: {
          select: {
            topics: true,
          },
        },
      },
    });

    return {
      success: true,
      data: subjects,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to fetch subjects",
      data: [],
    };
  }
}

export async function getSubject(id: string) {
  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },

      include: {
        topics: {
          orderBy: {
            name: "asc",
          },

          include: {
            _count: {
              select: {
                // questions: true,
                examTopics: true,
              },
            },
          },
        },

        _count: {
          select: {
            topics: true,
            // questions: true,
          },
        },
      },
    });

    if (!subject) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    return {
      success: true,
      data: subject,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to fetch subject",
    };
  }
}

export async function createSubject(input: unknown) {
  const validation = subjectSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid subject name",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { name } = validation.data;

  try {
    const existing = await prisma.subject.findUnique({
      where: {
        name,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Subject already exists",
      };
    }

    const subject = await prisma.subject.create({
      data: {
        name,
      },
    });

    revalidatePath("/subjects");

    return {
      success: true,
      data: subject,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to create subject",
    };
  }
}

export async function updateSubject(id: string, input: unknown) {
  const validation = subjectSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid subject name",
    };
  }

  const { name } = validation.data;

  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },
    });

    if (!subject) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    const duplicate = await prisma.subject.findFirst({
      where: {
        name,
        NOT: {
          id,
        },
      },
    });

    if (duplicate) {
      return {
        success: false,
        error: "Subject already exists",
      };
    }

    const updated = await prisma.subject.update({
      where: {
        id,
      },

      data: {
        name,
      },
    });

    revalidatePath("/subjects");
    revalidatePath(`/subjects/${id}`);

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to update subject",
    };
  }
}

export async function deleteSubject(id: string) {
  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },

      include: {
        _count: {
          select: {
            topics: true,
            // questions: true,
            examSubjects: true,
            examTopics: true,
          },
        },
      },
    });

    if (!subject) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    if (
      subject._count.topics > 0 ||
    //   subject._count.questions > 0 ||
      subject._count.examSubjects > 0 ||
      subject._count.examTopics > 0
    ) {
      return {
        success: false,
        error: "Subject is already in use and cannot be deleted",
      };
    }

    await prisma.subject.delete({
      where: {
        id,
      },
    });

    revalidatePath("/subjects");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to delete subject",
    };
  }
}
