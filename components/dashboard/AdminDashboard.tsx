"use client";

import Link from "next/link";
import {
  Building2,
  BookOpen,
  FileQuestion,
  Plus,
  Users,
} from "lucide-react";

import { DataTable } from "../ui/DataTable";
import { StatsGrid } from "../ui/StatsGrid";

type Coaching = {
  id: string;
  code: string;
  coachingName: string;
  ownerName: string;
  mobile: string;
  address: string;
  logo: string | null;
  email: string | null;
};

type StudentCoaching = {
  id: string;
  code: string;
  coachingName: string;
};

type Student = {
  id: string;
  name: string;
  dob: string | Date;
  mobile: string;
  user: {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    coachings?: Array<{
      coaching: StudentCoaching;
    }>;
  };
};

type DashboardStats = {
  totalStudents: number;
  totalCoachings: number;
  totalTests: number;
  totalQuestions: number;
  publishedTests: number;
};

type AdminDashboardData = {
  stats: DashboardStats;
  students: Student[];
  coachings: Coaching[];
};

type Props = {
  data: AdminDashboardData;
};

export default function AdminDashboardPage({ data }: Props) {
  const stats = [
    {
      title: "Total Students",
      value: data.stats.totalStudents,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Coachings",
      value: data.stats.totalCoachings,
      icon: Building2,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Tests",
      value: data.stats.totalTests,
      icon: BookOpen,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Questions",
      value: data.stats.totalQuestions,
      icon: FileQuestion,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const students = data.students ?? [];
  const coachings = data.coachings ?? [];

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

  const getCoachingName = (student: Student) => {
    const coaching = student.user.coachings?.[0]?.coaching;

    return coaching?.coachingName ?? "Independent";
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white px-4 py-5 shadow-sm md:px-10">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your examination platform
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/subjects"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Subjects
            </Link>

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
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Coachings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage registered coaching institutes
              </p>
            </div>

            <Link
              href="/dashboard/coachings"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
            >
              <Plus size={16} />
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              data={coachings}
              columns={[
                {
                  key: "code",
                  header: "Code",
                  sortable: true,
                },
                {
                  key: "coachingName",
                  header: "Coaching",
                  sortable: true,
                },
                {
                  key: "ownerName",
                  header: "Owner",
                  sortable: true,
                },
                {
                  key: "email",
                  header: "Email",
                  sortable: true,
                  render: (row) => row.email ?? "-",
                },
                {
                  key: "mobile",
                  header: "Mobile",
                  sortable: true,
                  render: (row) => row.mobile ?? "-",
                },
                {
                  key: "address",
                  header: "Address",
                  render: (row) => (
                    <span
                      className="block max-w-[250px] truncate"
                      title={row.address}
                    >
                      {row.address || "-"}
                    </span>
                  ),
                },
                {
                  key: "actions",
                  header: "Actions",
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          console.log("Edit Coaching:", row.id)
                        }
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          console.log("Delete Coaching:", row.id)
                        }
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              pageSize={10}
              onSelectionChange={(ids) => {
                console.log("Selected coaching IDs:", ids);
              }}
            />
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Students
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage registered students
              </p>
            </div>

            <span className="text-sm text-gray-500">
              Total:{" "}
              <span className="font-semibold text-gray-900">
                {data.stats.totalStudents}
              </span>
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
                  render: (row) => row.user.email ?? "-",
                },
                {
                  key: "mobile",
                  header: "Mobile",
                  sortable: true,
                  render: (row) => row.mobile ?? "-",
                },
                {
                  key: "coaching",
                  header: "Coaching",
                  sortable: true,
                  render: (row) => getCoachingName(row),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
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
                  key: "dob",
                  header: "DOB",
                  sortable: true,
                  render: (row) => formatDate(row.dob),
                },
                {
                  key: "actions",
                  header: "Actions",
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          console.log("Edit Student:", row.id)
                        }
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          console.log("Delete Student:", row.id)
                        }
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              pageSize={10}
              onSelectionChange={(ids) => {
                console.log("Selected student IDs:", ids);
              }}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
