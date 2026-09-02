"use client";

import Link from "next/link";
import { Users, Plus, Building2, BookOpen, FileQuestion } from "lucide-react";
import { ROUTES } from "@/lib/constans";
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
    coaching?: {
      id: string;
      code: string;
      coachingName: string;
    } | null;
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
  console.log(data, data.stats);
  const stats = [
    {
      title: "Total Students",
      value: data?.stats?.totalStudents ?? data?.students?.length ?? 0,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Coachings",
      value: data?.stats?.totalCoachings ?? data?.coachings?.length ?? 0,
      icon: Building2,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Tests",
      value: data?.stats?.totalTests ?? 0,
      icon: BookOpen,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Questions",
      value: data?.stats?.totalQuestions ?? 0,
      icon: FileQuestion,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const formatDate = (value: string | Date) => {
    if (!value) return "-";

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

  const students = data?.students ?? [];
  const coachings = data?.coachings ?? [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-4 md:px-10 py-5">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your examination platform
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/subjects"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <Plus size={18} />
              Subjects
            </Link>

            <Link
              href="/questions"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <Plus size={18} />
              Questions
            </Link>

            <Link
              href="/exams"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <Plus size={18} />
              Exams
            </Link>

            <Link
              href="/tests"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <Plus size={18} />
              Tests
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="p-4 md:p-10 space-y-10">
        {/* Stats */}
        <StatsGrid stats={stats} />

        {/* Coachings */}
        <section className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Coachings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage registered coaching institutes
              </p>
            </div>

            <Link
              href={`${ROUTES.DASHBOARD}${'/coachings'}`}
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
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
                        onClick={() => console.log("Edit Coaching:", row.id)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => console.log("Delete Coaching:", row.id)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
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

        {/* Students */}
        <section className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Students</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage registered students
              </p>
            </div>

            <span className="text-sm text-gray-500">
              Total:{" "}
              <span className="font-semibold text-gray-900">
                {students.length}
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
                  render: (row) => row.user?.email ?? "-",
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
                  render: (row) =>
                    row.user?.coaching?.coachingName ?? "Independent",
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.user?.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.user?.isActive ? "Active" : "Inactive"}
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
                        onClick={() => console.log("Edit Student:", row.id)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => console.log("Delete Student:", row.id)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
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
      </main>
    </div>
  );
}
