"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Plus, Users } from "lucide-react";

import { DataTable } from "../ui/DataTable";
import { StatsGrid } from "../ui/StatsGrid";

type Coaching = {
  id: string;
  code: string;
  coachingName: string;
  mobile: string;
  logo: string | null;
  address: string;
  ownerName: string;
  email: string | null;
};

type CoachingStudent = {
  id: string;
  name: string;
  dob: string | Date;
  mobile: string;
  user: {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
  };
};

type CoachingDashboardStats = {
  totalStudents: number;
  totalTests: number;
  publishedTests: number;
  totalAttempts: number;
};

type CoachingTest = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  testType: string;
  status: string;
  examId: string;
  duration: number;
  totalMarks: number;
  totalQuestions: number;
  negativeMarking: boolean;
  negativeMarks: number | null;
  publishedAt: string | Date | null;
  createdAt: string | Date;
};

type CoachingAttempt = {
  id: string;
  testId: string;
  userId: string;
  status: string;
  startedAt: string | Date;
  submittedAt: string | Date | null;
  createdAt: string | Date;
  test: {
    id: string;
    name: string;
    totalMarks: number;
    totalQuestions: number;
  };
  user: {
    id: string;
    email: string;
    student: {
      id: string;
      name: string;
    } | null;
  };
};

type CoachingResult = {
  id: string;
  attemptId: string;
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
  timeTaken: number;
  rank: number | null;
  percentile: number | null;
  createdAt: string | Date;
  attempt: {
    id: string;
    testId: string;
    userId: string;
    test: {
      id: string;
      name: string;
    };
    user: {
      id: string;
      email: string;
      student: {
        id: string;
        name: string;
      } | null;
    };
  };
};

type CoachingDashboardData = {
  coaching: Coaching;
  students: CoachingStudent[];
  stats: CoachingDashboardStats;
  tests: CoachingTest[];
  attempts: CoachingAttempt[];
  results: CoachingResult[];
  recentResults: CoachingResult[];
};

type Props = {
  data: CoachingDashboardData;
};

export default function CoachingDashboardPage({ data }: Props) {
  const stats = [
    {
      title: "Total Students",
      value: data.stats.totalStudents,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Tests",
      value: data.stats.totalTests,
      icon: BookOpen,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Published Tests",
      value: data.stats.publishedTests,
      icon: BookOpen,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Test Attempts",
      value: data.stats.totalAttempts,
      icon: Users,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const students = data.students ?? [];

  const formatDate = (value: string | Date) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white px-4 py-5 shadow-sm md:px-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            {data.coaching.logo ? (
              <Image
                src={data.coaching.logo}
                alt={`${data.coaching.coachingName} logo`}
                width={70}
                height={70}
                className="h-[70px] w-[70px] rounded-2xl border object-cover"
              />
            ) : (
              <div className="flex h-[70px] w-[70px] items-center justify-center rounded-2xl border bg-gray-100 text-sm text-gray-400">
                Logo
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {data.coaching.coachingName}
              </h1>

              <p className="mt-1 text-gray-500">
                Code:{" "}
                <span className="font-semibold text-gray-700">
                  {data.coaching.code}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/questions"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Questions
            </Link>

            <Link
              href="/exams"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Exams
            </Link>

            <Link
              href="/tests"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Tests
            </Link>
          </div>
        </div>
      </header>

      <section className="space-y-10 p-4 md:p-10">
        <StatsGrid stats={stats} />

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Students
              </h2>

              <p className="mt-1 text-gray-500">
                Students registered under this coaching
              </p>
            </div>

            <span className="text-sm font-medium text-gray-500">
              Total: {data.stats.totalStudents}
            </span>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              data={students}
              columns={[
                {
                  key: "name",
                  header: "Name",
                  sortable: true,
                },
                {
                  key: "email",
                  header: "Email",
                  sortable: true,
                  render: (row) => row.user.email,
                },
                {
                  key: "mobile",
                  header: "Mobile",
                  sortable: true,
                },
                {
                  key: "dob",
                  header: "DOB",
                  sortable: true,
                  render: (row) => formatDate(row.dob),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        row.user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.user.isActive ? "Active" : "Inactive"}
                    </span>
                  ),
                },
                {
                  key: "actions",
                  header: "Actions",
                  render: (row) => (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => console.log("Edit Student:", row.id)}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          console.log("Delete Student:", row.id)
                        }
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              pageSize={10}
              onSelectionChange={(ids) => {
                console.log("Selected students:", ids);
              }}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
