"use server";

import { prisma } from "@/lib/prisma";
import { AttemptStatus } from "@/generated/prisma/enums";

export async function calculateTestRanks(testId: string) {
  try {
    if (!testId) {
      return {
        success: false,
        error: "Test ID is required.",
      };
    }

    const results = await prisma.result.findMany({
      where: {
        attempt: {
          testId,
          status: {
            in: [AttemptStatus.SUBMITTED, AttemptStatus.EXPIRED],
          },
        },
      },

      select: {
        id: true,
        marksObtained: true,
        createdAt: true,
      },

      orderBy: [
        {
          marksObtained: "desc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

    if (results.length === 0) {
      return {
        success: true,
        participantCount: 0,
      };
    }

    const participantCount = results.length;

    const rankData: {
      id: string;
      rank: number;
      percentile: number;
    }[] = [];

    let currentRank = 0;
    let previousMarks: number | null = null;

    for (let index = 0; index < results.length; index++) {
      const result = results[index];

      /*
       * Competition ranking:
       *
       * 100 → Rank 1
       * 100 → Rank 1
       * 90  → Rank 3
       */

      if (previousMarks === null || result.marksObtained !== previousMarks) {
        currentRank = index + 1;
      }

      /*
       * Percentile:
       *
       * ((N - rank) / N) * 100
       */

      const percentile =
        ((participantCount - currentRank) / participantCount) * 100;

      rankData.push({
        id: result.id,
        rank: currentRank,
        percentile: Number(percentile.toFixed(2)),
      });

      previousMarks = result.marksObtained;
    }

    await prisma.$transaction(
      rankData.map((item) =>
        prisma.result.update({
          where: {
            id: item.id,
          },

          data: {
            rank: item.rank,
            percentile: item.percentile,
          },
        }),
      ),
    );

    return {
      success: true,
      participantCount,
    };
  } catch (error) {
    console.error("CALCULATE_TEST_RANKS_ERROR:", error);

    return {
      success: false,
      error: "Failed to calculate test ranks.",
    };
  }
}
