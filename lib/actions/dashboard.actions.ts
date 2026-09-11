"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AttemptStatus, Role, TestStatus } from "@/generated/prisma/enums";

export async function getAdminDashboard() {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Unauthorized.",
      };
    }

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

    const students = await prisma.student.findMany({
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
            createdAt: true,
            coachings: {
              select: {
                createdAt: true,
                coaching: {
                  select: {
                    id: true,
                    code: true,
                    coachingName: true,
                    logo: true,
                    ownerName: true,
                    mobile: true,
                    address: true,
                    isActive: true,
                  },
                },
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

    const coachings = await prisma.coaching.findMany({
      select: {
        id: true,
        code: true,
        coachingName: true,
        ownerName: true,
        mobile: true,
        address: true,
        logo: true,
        isActive: true,
        createdAt: true,
        users: {
          where: {
            user: {
              role: Role.COACHING,
            },
          },
          select: {
            user: {
              select: {
                id: true,
                email: true,
                isActive: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 1,
        },
        _count: {
          select: {
            users: true,
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
          isActive: coaching.isActive,
          email: coaching.users[0]?.user.email ?? null,
          userIsActive: coaching.users[0]?.user.isActive ?? false,
          usersCount: coaching._count.users,
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

export async function getCoachingDashboard() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized.",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        coachings: {
          select: {
            createdAt: true,
            coaching: {
              select: {
                id: true,
                code: true,
                coachingName: true,
                ownerName: true,
                mobile: true,
                address: true,
                logo: true,
                isActive: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    if (user.role !== Role.COACHING) {
      return {
        success: false,
        error: "User is not a coaching user.",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: "Coaching account is inactive.",
      };
    }

    const coaching = user.coachings[0]?.coaching;

    if (!coaching) {
      return {
        success: false,
        error: "Coaching is not assigned to this user.",
      };
    }

    if (!coaching.isActive) {
      return {
        success: false,
        error: "Coaching is inactive.",
      };
    }

    const coachingId = coaching.id;

    const coachingUsers = await prisma.userCoaching.findMany({
      where: {
        coachingId,
        user: {
          role: Role.COACHING,
        },
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const students = await prisma.student.findMany({
      where: {
        user: {
          coachings: {
            some: {
              coachingId,
            },
          },
        },
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
            createdAt: true,
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
          coachings: {
            some: {
              coachingId,
            },
          },
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
            id: true,
            student: {
              select: {
                name: true,
              },
            },
          },
        },
        result: {
          select: {
            id: true,
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
        description: true,
        testType: true,
        duration: true,
        totalMarks: true,
        totalQuestions: true,
        negativeMarking: true,
        negativeMarks: true,
        publishedAt: true,
        createdAt: true,
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
          userId: attempt.userId,
          studentName: attempt.user.student?.name ?? "Student",
          testId: attempt.testId,
          testName: attempt.test.name,
          status: attempt.status,
          marksObtained: result.marksObtained,
          percentage: result.percentage,
          accuracy: result.accuracy,
          rank: result.rank,
          percentile: result.percentile,
          startedAt: attempt.startedAt,
          submittedAt: attempt.submittedAt,
          createdAt: attempt.createdAt,
        };
      });

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
          email: coachingUsers[0]?.user.email ?? user.email,
          isActive: coaching.isActive,
        },

        stats: {
          totalStudents: students.length,
          totalAttempts: attempts.length,
          completedAttempts: completedAttempts.length,
          inProgressAttempts: inProgressAttempts.length,
          totalTests: publishedTests.length,
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

export async function getStudentDashboard() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized.",
      };
    }

    if (session.user.role !== Role.STUDENT) {
      return {
        success: false,
        error: "Only students can access this dashboard.",
      };
    }

    const userId = session.user.id;

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
            coachings: {
              select: {
                id: true,
                coachingId: true,
                createdAt: true,
                coaching: {
                  select: {
                    id: true,
                    code: true,
                    coachingName: true,
                    ownerName: true,
                    mobile: true,
                    address: true,
                    logo: true,
                    isActive: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
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

    if (student.user.role !== Role.STUDENT) {
      return {
        success: false,
        error: "User is not a student.",
      };
    }

    if (!student.user.isActive) {
      return {
        success: false,
        error: "Student account is inactive.",
      };
    }

    const coachings = student.user.coachings.map(
      (membership) => membership.coaching,
    );

    const coachingIds = student.user.coachings
      .filter((membership) => membership.coaching.isActive)
      .map((membership) => membership.coachingId);

    /*
     * ---------------------------------------------------------
     * PUBLISHED TESTS
     * ---------------------------------------------------------
     */

    const tests = await prisma.test.findMany({
      where: {
        status: TestStatus.PUBLISHED,
        OR: [
          {
            user: {
              role: Role.ADMIN,
            },
          },
          ...(coachingIds.length > 0
            ? [
                {
                  user: {
                    role: Role.COACHING,
                    coachings: {
                      some: {
                        coachingId: {
                          in: coachingIds,
                        },
                      },
                    },
                  },
                },
              ]
            : []),
        ],
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

        attempts: {
          where: {
            userId,
          },
          select: {
            id: true,
            status: true,
            startedAt: true,
            submittedAt: true,
            expiresAt: true,
            createdAt: true,

            answers: {
              select: {
                selectedOptionIds: true,
                isAttempted: true,
                markedForReview: true,

                question: {
                  select: {
                    id: true,
                    type: true,
                    options: {
                      select: {
                        id: true,
                        isCorrect: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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

    /*
     * ---------------------------------------------------------
     * TEST TYPE MAP (Prisma enum -> frontend TestItem type)
     * ---------------------------------------------------------
     */

    const testTypeMap: Record<
      (typeof tests)[number]["testType"],
      "MOCK_TEST" | "PRACTICE" | "PREVIOUS_YEAR" | "SECTIONAL" | "FULL_LENGTH"
    > = {
      MOCK: "MOCK_TEST",
      PRACTICE: "PRACTICE",
      FULL_LENGTH: "FULL_LENGTH",
      SUBJECT_WISE: "SECTIONAL",
      TOPIC_WISE: "SECTIONAL",
    };

    /*
     * ---------------------------------------------------------
     * CALCULATE ATTEMPT RESULT
     * ---------------------------------------------------------
     */

    type CalculatedResult = {
      attemptId: string;
      testId: string;
      testName: string;
      examName: string;
      testType:
        | "PRACTICE"
        | "MOCK"
        | "FULL_LENGTH"
        | "SUBJECT_WISE"
        | "TOPIC_WISE";
      attemptedAt: Date;
      totalQuestions: number;
      attempted: number;
      correct: number;
      incorrect: number;
      skipped: number;
      totalMarks: number;
      marksObtained: number;
      positiveMarks: number;
      negativeMarks: number;
      percentage: number;
      accuracy: number;
      duration: number;
      timeTaken: number;
    };

    const calculateAttemptResult = (
      test: (typeof tests)[number],
      attempt: (typeof tests)[number]["attempts"][number],
    ): CalculatedResult => {
      const attemptedAnswers = attempt.answers.filter(
        (answer) => answer.isAttempted,
      );

      let correct = 0;
      let incorrect = 0;

      for (const answer of attemptedAnswers) {
        const correctOptionIds = answer.question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.id)
          .sort();

        const selectedOptionIds = [...answer.selectedOptionIds].sort();

        const isCorrect =
          correctOptionIds.length === selectedOptionIds.length &&
          correctOptionIds.every(
            (optionId, index) => optionId === selectedOptionIds[index],
          );

        if (isCorrect) {
          correct += 1;
        } else {
          incorrect += 1;
        }
      }

      const attempted = attemptedAnswers.length;

      const skipped = Math.max(test.totalQuestions - attempted, 0);

      const marksPerQuestion =
        test.totalQuestions > 0 ? test.totalMarks / test.totalQuestions : 0;

      const negativeMarksPerQuestion =
        test.negativeMarking && test.negativeMarks ? test.negativeMarks : 0;

      const positiveMarks = correct * marksPerQuestion;

      const negativeMarks = incorrect * negativeMarksPerQuestion;

      const marksObtained = positiveMarks - negativeMarks;

      const percentage =
        test.totalMarks > 0 ? (marksObtained / test.totalMarks) * 100 : 0;

      const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

      const endTime = attempt.submittedAt ?? attempt.expiresAt;

      const timeTaken = Math.max(
        0,
        Math.floor((endTime.getTime() - attempt.startedAt.getTime()) / 1000),
      );

      return {
        attemptId: attempt.id,
        testId: test.id,
        testName: test.name,
        examName: test.exam.name,
        testType: test.testType,

        attemptedAt: attempt.submittedAt ?? attempt.createdAt,

        totalQuestions: test.totalQuestions,
        attempted,
        correct,
        incorrect,
        skipped,

        totalMarks: test.totalMarks,
        marksObtained,
        positiveMarks,
        negativeMarks,

        percentage,
        accuracy,

        duration: test.duration,
        timeTaken,
      };
    };

    /*
     * ---------------------------------------------------------
     * ALL STUDENT RESULTS (for Results.tsx)
     * ---------------------------------------------------------
     */

    const results: CalculatedResult[] = [];

    for (const test of tests) {
      const submittedAttempts = test.attempts.filter(
        (attempt) => attempt.status === "SUBMITTED",
      );

      for (const attempt of submittedAttempts) {
        results.push(calculateAttemptResult(test, attempt));
      }
    }

    results.sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime());

    /*
     * ---------------------------------------------------------
     * FORMAT TESTS (for Tests.tsx / TestItem)
     * ---------------------------------------------------------
     */

    const formattedTests = tests.map((test) => {
      const attempts = test.attempts;

      const inProgressAttempt = attempts.find(
        (attempt) => attempt.status === "IN_PROGRESS",
      );

      const submittedAttempts = attempts.filter(
        (attempt) => attempt.status === "SUBMITTED",
      );

      const calculatedAttempts = submittedAttempts.map((attempt) =>
        calculateAttemptResult(test, attempt),
      );

      const latestSubmittedAttempt = calculatedAttempts[0] ?? null;

      const bestAttempt = calculatedAttempts.reduce<CalculatedResult | null>(
        (best, current) => {
          if (!best) return current;
          return current.marksObtained > best.marksObtained ? current : best;
        },
        null,
      );

      let status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" = "NOT_STARTED";

      if (inProgressAttempt) {
        status = "IN_PROGRESS";
      } else if (submittedAttempts.length > 0) {
        status = "COMPLETED";
      }

      // Single source of truth for "which attempt to open on View Result"
      const attemptIdToReview =
        inProgressAttempt?.id ?? bestAttempt?.attemptId ?? null;

      return {
        id: test.id,
        title: test.name,

        exam: {
          id: test.exam.id,
          name: test.exam.name,
        },

        subject: null,

        type: testTypeMap[test.testType],

        questions: test.totalQuestions,
        duration: test.duration,
        totalMarks: test.totalMarks,

        language: "English",

        isFree: true,
        price: null,

        attempts: submittedAttempts.length,

        lastScore: latestSubmittedAttempt?.marksObtained ?? null,
        bestScore: bestAttempt?.marksObtained ?? null,

        status,

        // Top-level field TestItem/onViewResult expects
        attemptId: attemptIdToReview ?? undefined,

        negativeMarking: test.negativeMarking,
        negativeMarks: test.negativeMarks,
      };
    });

    /*
     * ---------------------------------------------------------
     * EXAMS
     * ---------------------------------------------------------
     */

    const exams = Array.from(
      new Map(
        tests.map((test) => [
          test.exam.id,
          {
            id: test.exam.id,
            name: test.exam.name,
          },
        ]),
      ).values(),
    );

    /*
     * ---------------------------------------------------------
     * LEADERBOARD (all-time, across the same test pool this
     * student can see — admin tests + their coaching's tests)
     * ---------------------------------------------------------
     */

    const testIds = tests.map((test) => test.id);

    const leaderboardAttempts =
      testIds.length > 0
        ? await prisma.testAttempt.findMany({
            where: {
              status: "SUBMITTED",
              testId: { in: testIds },
              result: { isNot: null },
            },
            select: {
              userId: true,
              user: {
                select: {
                  student: {
                    select: { name: true },
                  },
                  coachings: {
                    select: {
                      coaching: { select: { coachingName: true } },
                    },
                    orderBy: { createdAt: "asc" },
                    take: 1,
                  },
                },
              },
              result: {
                select: {
                  score: true,
                },
              },
            },
          })
        : [];

    type LeaderboardAgg = {
      userId: string;
      studentName: string;
      coachingName: string | null;
      totalScore: number;
      totalTests: number;
    };

    const leaderboardByUser = new Map<string, LeaderboardAgg>();

    for (const attempt of leaderboardAttempts) {
      if (!attempt.result) continue;

      const existing = leaderboardByUser.get(attempt.userId);
      const marks = attempt.result.score;

      if (existing) {
        existing.totalScore += marks;
        existing.totalTests += 1;
      } else {
        leaderboardByUser.set(attempt.userId, {
          userId: attempt.userId,
          studentName: attempt.user.student?.name ?? "Student",
          coachingName:
            attempt.user.coachings[0]?.coaching.coachingName ?? null,
          totalScore: marks,
          totalTests: 1,
        });
      }
    }

    const leaderboardEntries = Array.from(leaderboardByUser.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({
        rank: index + 1,
        studentId: entry.userId,
        studentName: entry.studentName,
        avatarUrl: null,
        coachingName: entry.coachingName,
        score: Math.round(entry.totalScore * 100) / 100,
        totalTests: entry.totalTests,
        isCurrentUser: entry.userId === userId,
        trend: "SAME" as const,
      }));

    const leaderboardCurrentUserEntry =
      leaderboardEntries.find((entry) => entry.isCurrentUser) ?? null;

    /*
     * ---------------------------------------------------------
     * RESULT SUMMARY
     * ---------------------------------------------------------
     */

    const totalTestsAttempted = results.length;

    const totalPercentage = results.reduce(
      (sum, result) => sum + result.percentage,
      0,
    );

    const totalAccuracy = results.reduce(
      (sum, result) => sum + result.accuracy,
      0,
    );

    const averagePercentage =
      totalTestsAttempted > 0 ? totalPercentage / totalTestsAttempted : 0;

    const averageAccuracy =
      totalTestsAttempted > 0 ? totalAccuracy / totalTestsAttempted : 0;

    const bestResult =
      results.length > 0
        ? results.reduce((best, current) =>
            current.marksObtained > best.marksObtained ? current : best,
          )
        : null;

    const totalAttempted = results.reduce(
      (sum, result) => sum + result.attempted,
      0,
    );

    const totalCorrect = results.reduce(
      (sum, result) => sum + result.correct,
      0,
    );

    const totalIncorrect = results.reduce(
      (sum, result) => sum + result.incorrect,
      0,
    );

    const totalSkipped = results.reduce(
      (sum, result) => sum + result.skipped,
      0,
    );

    return {
      success: true,

      data: {
        student: {
          name: student.name,
          dob: student.dob,
          mobile: student.mobile,
          email: student.user.email,
        },

        coachings: coachings.map((coaching) => ({
          id: coaching.id,
          code: coaching.code,
          name: coaching.coachingName,
          logo: coaching.logo,
          mobile: coaching.mobile,
          address: coaching.address,
        })),

        exams,

        tests: formattedTests,

        /*
         * Leaderboard.tsx props
         */
        leaderboard: {
          entries: leaderboardEntries,
          currentUserEntry: leaderboardCurrentUserEntry,
          period: "ALL_TIME" as const,
        },

        /*
         * Results.tsx props
         */
        results,

        resultSummary: {
          totalTestsAttempted,
          averagePercentage,
          bestScore: bestResult?.marksObtained ?? 0,
          averageAccuracy,

          totalAttempted,
          totalCorrect,
          totalIncorrect,
          totalSkipped,
        },
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