"use server";

import { prisma } from "@/lib/prisma";
import { AttemptStatus, TestStatus } from "@/generated/prisma/enums";

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

export async function getAdminDashboard() {
  try {
    const [
      totalStudents,
      totalCoachings,
      totalTests,
      totalQuestions,
      publishedTests,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.coaching.count(),
      prisma.test.count(),
      prisma.question.count(),
      prisma.test.count({
        where: {
          status: TestStatus.PUBLISHED,
        },
      }),
    ]);

    // ==================================================
    // STUDENTS
    // ==================================================

    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            coaching: {
              select: {
                id: true,
                code: true,
                coachingName: true,
              },
            },
          },
        },
      },

      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
    });

    // ==================================================
    // COACHINGS
    // ==================================================

    const coachings = await prisma.coaching.findMany({
      include: {
        users: {
          where: {
            role: "COACHING",
          },

          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        coachingName: "asc",
      },
    });

    return {
      success: true,
      data: {
        stats: {
          totalStudents,
          totalCoachings,
          totalTests,
          publishedTests,
          totalQuestions,
        },
        students,
        coachings: coachings.map((coaching) => ({
          id: coaching.id,
          code: coaching.code,
          coachingName: coaching.coachingName,
          ownerName: coaching.ownerName,
          mobile: coaching.mobile,
          address: coaching.address,
          logo: coaching.logo,
          email: coaching.users[0]?.email ?? null,
          usersCount: coaching.users.length,
        })),
      },
    };
  } catch (error) {
    console.error("GET_ADMIN_DASHBOARD_ERROR:", error);
    return {
      success: false,
      error: "Unable to load admin dashboard.",
    };
  }
}

/*
|--------------------------------------------------------------------------
| COACHING DASHBOARD
|--------------------------------------------------------------------------
*/

export async function getCoachingDashboard(coachingId: string) {
  try {
    if (!coachingId) {
      return {
        success: false,
        error: "Coaching ID is required.",
      };
    }

    const coaching = await prisma.coaching.findUnique({
      where: {
        id: coachingId,
      },
      select: {
        id: true,
        code: true,
        coachingName: true,
        ownerName: true,
        mobile: true,
        address: true,
        logo: true,
        users: {
          where: {
            role: "COACHING",
          },
          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
      },
    });
    if (!coaching) {
      return {
        success: false,
        error: "Coaching not found.",
      };
    }

    const students = await prisma.student.findMany({
      where: {
        user: {
          coachingId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
    });

    const attempts = await prisma.testAttempt.findMany({
      where: {
        user: {
          coachingId,
        },
      },
      select: {
        id: true,
        testId: true,
        userId: true,
        status: true,
        startedAt: true,
        submittedAt: true,
        createdAt: true,
        test: {
          select: {
            id: true,
            name: true,
            slug: true,
            totalQuestions: true,
            totalMarks: true,
          },
        },
        user: {
          select: {
            student: {
              select: {
                name: true,
              },
            },
          },
        },
        result: {
          select: {
            marksObtained: true,
            percentage: true,
            accuracy: true,
            rank: true,
            percentile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const publishedTests = await prisma.test.findMany({
      where: {
        status: TestStatus.PUBLISHED,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        testType: true,
        duration: true,
        totalMarks: true,
        totalQuestions: true,
        publishedAt: true,
        exam: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    const totalStudents = students.length;
    const totalAttempts = attempts.length;
    const completedAttempts = attempts.filter(
      (attempt) =>
        attempt.status === AttemptStatus.SUBMITTED ||
        attempt.status === AttemptStatus.EXPIRED,
    );
    const inProgressAttempts = attempts.filter(
      (attempt) => attempt.status === AttemptStatus.IN_PROGRESS,
    );
    const results = completedAttempts
      .filter((attempt) => attempt.result !== null)
      .map((attempt) => ({
        attemptId: attempt.id,
        userId: attempt.userId,
        studentName: attempt.user.student?.name ?? "Student",
        testId: attempt.testId,
        testName: attempt.test.name,
        status: attempt.status,
        marksObtained: attempt.result!.marksObtained,
        percentage: attempt.result!.percentage,
        accuracy: attempt.result!.accuracy,
        rank: attempt.result!.rank,
        percentile: attempt.result!.percentile,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        createdAt: attempt.createdAt,
      }));

    const averagePercentage =
      results.length > 0
        ? results.reduce((sum, result) => sum + result.percentage, 0) /
          results.length
        : 0;

    const averageAccuracy =
      results.length > 0
        ? results.reduce((sum, result) => sum + result.accuracy, 0) /
          results.length
        : 0;

    const recentResults = results.slice(0, 10);

    return {
      success: true,
      data: {
        coaching: {
          id: coaching.id,
          code: coaching.code,
          coachingName: coaching.coachingName,
          ownerName: coaching.ownerName,
          mobile: coaching.mobile,
          address: coaching.address,
          logo: coaching.logo,
          email: coaching.users[0]?.email ?? null,
        },
        stats: {
          totalStudents,
          totalAttempts,
          completedAttempts: completedAttempts.length,
          inProgressAttempts: inProgressAttempts.length,
          averagePercentage: Number(averagePercentage.toFixed(2)),
          averageAccuracy: Number(averageAccuracy.toFixed(2)),
        },
        students,
        tests: publishedTests,
        attempts,
        results,
        recentResults,
      },
    };
  } catch (error) {
    console.error("GET_COACHING_DASHBOARD_ERROR:", error);
    return {
      success: false,
      error: "Unable to load coaching dashboard.",
    };
  }
}

/*
|--------------------------------------------------------------------------
| STUDENT DASHBOARD
|--------------------------------------------------------------------------
*/

export async function getStudentDashboard(userId: string) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required.",
      };
    }

    const student = await prisma.student.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        dob: true,
        mobile: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            coaching: {
              select: {
                id: true,
                code: true,
                coachingName: true,
                ownerName: true,
                mobile: true,
                address: true,
                logo: true,
              },
            },
          },
        },
      },
    });
    if (!student) {
      return {
        success: false,
        error: "Student not found.",
      };
    }

    const attempts = await prisma.testAttempt.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        testId: true,
        status: true,
        startedAt: true,
        submittedAt: true,
        createdAt: true,
        test: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            testType: true,
            status: true,
            duration: true,
            totalMarks: true,
            totalQuestions: true,
            negativeMarking: true,
            negativeMarks: true,
            exam: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        result: {
          select: {
            id: true,
            totalQuestions: true,
            attempted: true,
            correct: true,
            incorrect: true,
            skipped: true,
            totalMarks: true,
            marksObtained: true,
            positiveMarks: true,
            negativeMarks: true,
            percentage: true,
            accuracy: true,
            timeTaken: true,
            rank: true,
            percentile: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const completedAttempts = attempts.filter(
      (attempt) =>
        attempt.status === AttemptStatus.SUBMITTED ||
        attempt.status === AttemptStatus.EXPIRED,
    );

    const inProgressAttempts = attempts.filter(
      (attempt) => attempt.status === AttemptStatus.IN_PROGRESS,
    );

    const results = completedAttempts
      .filter((attempt) => attempt.result !== null)
      .map((attempt) => {
        const result = attempt.result!;
        return {
          resultId: result.id,
          attemptId: attempt.id,
          testId: attempt.testId,
          testName: attempt.test.name,
          testSlug: attempt.test.slug,
          testType: attempt.test.testType,
          exam: attempt.test.exam,
          status: attempt.status,
          totalQuestions: result.totalQuestions,
          attempted: result.attempted,
          correct: result.correct,
          incorrect: result.incorrect,
          skipped: result.skipped,
          totalMarks: result.totalMarks,
          marksObtained: result.marksObtained,
          positiveMarks: result.positiveMarks,
          negativeMarks: result.negativeMarks,
          percentage: result.percentage,
          accuracy: result.accuracy,
          timeTaken: result.timeTaken,
          rank: result.rank,
          percentile: result.percentile,
          startedAt: attempt.startedAt,
          submittedAt: attempt.submittedAt,
          createdAt: result.createdAt,
        };
      });

    const recentResults = results.slice(0, 5);
    const completedResultCount = results.length;
    const totalTests = attempts.length;
    const attemptedTests = completedAttempts.length;
    const inProgressTests = inProgressAttempts.length;
    const averageScore =
      completedResultCount > 0
        ? results.reduce((sum, result) => sum + result.marksObtained, 0) /
          completedResultCount
        : 0;
    const bestScore =
      completedResultCount > 0
        ? Math.max(...results.map((result) => result.marksObtained))
        : 0;
    const averagePercentage =
      completedResultCount > 0
        ? results.reduce((sum, result) => sum + result.percentage, 0) /
          completedResultCount
        : 0;
    const averageAccuracy =
      completedResultCount > 0
        ? results.reduce((sum, result) => sum + result.accuracy, 0) /
          completedResultCount
        : 0;
    const latestRankedResult = results.find(
      (result) => result.rank !== null || result.percentile !== null,
    );
    const overallRank = latestRankedResult?.rank ?? null;
    const overallPercentile = latestRankedResult?.percentile ?? null;
    const continueTests = inProgressAttempts.map((attempt) => ({
      attemptId: attempt.id,
      testId: attempt.testId,
      testName: attempt.test.name,
      testSlug: attempt.test.slug,
      testType: attempt.test.testType,
      duration: attempt.test.duration,
      totalQuestions: attempt.test.totalQuestions,
      totalMarks: attempt.test.totalMarks,
      startedAt: attempt.startedAt,
      exam: attempt.test.exam,
    }));
    const publishedTests = await prisma.test.findMany({
      where: {
        status: TestStatus.PUBLISHED,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        testType: true,
        duration: true,
        totalMarks: true,
        totalQuestions: true,
        negativeMarking: true,
        negativeMarks: true,
        publishedAt: true,
        exam: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    const latestAttemptByTest = new Map<string, (typeof attempts)[number]>();

    for (const attempt of attempts) {
      if (!latestAttemptByTest.has(attempt.testId)) {
        latestAttemptByTest.set(attempt.testId, attempt);
      }
    }

    const tests = publishedTests.map((test) => {
      const latestAttempt = latestAttemptByTest.get(test.id);
      let attemptStatus: "NOT_ATTEMPTED" | "IN_PROGRESS" | "COMPLETED" =
        "NOT_ATTEMPTED";

      let attemptId: string | null = null;
      let resultId: string | null = null;
      if (latestAttempt) {
        attemptId = latestAttempt.id;

        if (latestAttempt.status === AttemptStatus.IN_PROGRESS) {
          attemptStatus = "IN_PROGRESS";
        }

        if (
          latestAttempt.status === AttemptStatus.SUBMITTED ||
          latestAttempt.status === AttemptStatus.EXPIRED
        ) {
          attemptStatus = "COMPLETED";
          resultId = latestAttempt.result?.id ?? null;
        }
      }

      return {
        id: test.id,
        name: test.name,
        slug: test.slug,
        description: test.description,
        testType: test.testType,
        duration: test.duration,
        totalMarks: test.totalMarks,
        totalQuestions: test.totalQuestions,
        negativeMarking: test.negativeMarking,
        negativeMarks: test.negativeMarks,
        publishedAt: test.publishedAt,
        exam: test.exam,
        attemptStatus,
        attemptId,
        resultId,
      };
    });

    return {
      success: true,
      data: {
        student,
        stats: {
          totalTests,
          attemptedTests,
          completedTests: completedResultCount,
          inProgressTests,
          averageScore: Number(averageScore.toFixed(2)),
          bestScore: Number(bestScore.toFixed(2)),
          averagePercentage: Number(averagePercentage.toFixed(2)),
          averageAccuracy: Number(averageAccuracy.toFixed(2)),
          overallRank,
          overallPercentile,
        },
        tests,
        continueTests,
        results,
        recentResults,
      },
    };
  } catch (error) {
    console.error("GET_STUDENT_DASHBOARD_ERROR:", error);
    return {
      success: false,
      error: "Unable to load student dashboard.",
    };
  }
}
