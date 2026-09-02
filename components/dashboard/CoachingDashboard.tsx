"use client";

import Image from "next/image";
import { Users, BookOpen } from "lucide-react";

import LogOutButton from "../ui/LogOutButton";
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
  email: string;
  // idProof: string | null;
  // idNumber: string;
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white border-b shadow-sm px-4 md:px-10 py-5 flex flex-col md:flex-row justify-between md:items-center gap-5">
        {/* Coaching Information */}
        <div className="flex items-center gap-4">
          {data.coaching.logo ? (
            <Image
              src={data.coaching.logo}
              alt={`${data.coaching.coachingName} logo`}
              width={70}
              height={70}
              className="rounded-2xl border object-cover"
            />
          ) : (
            <div className="w-[70px] h-[70px] rounded-2xl border bg-gray-100 flex items-center justify-center text-gray-400">
              Logo
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold">{data.coaching.coachingName}</h1>

            <p className="text-gray-500 mt-1">
              Code: <span className="font-semibold">{data.coaching.code}</span>
            </p>
          </div>
        </div>

        {/* Logout */}
        <LogOutButton />
      </div>

      {/* Dashboard */}
      <div className="p-4 md:p-10">
        {/* Stats */}
        <StatsGrid stats={stats} />

        {/* Students */}
        <div className="mt-10 bg-white rounded-3xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Students</h2>

              <p className="text-gray-500 mt-1">
                Students registered under this coaching
              </p>
            </div>

            <span className="text-sm font-medium text-gray-500">
              Total: {data.stats.totalStudents}
            </span>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              data={data.students}
              columns={[
                {
                  key: "name",
                  header: "Name",
                  sortable: true,
                },
                {
                  key: "email",
                  header: "Email",
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
                  render: (row) =>
                    new Date(row.dob).toLocaleDateString("en-IN"),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                        onClick={() => console.log("Edit:", row.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => console.log("Delete:", row.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
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
        </div>
      </div>
    </div>
  );
}
