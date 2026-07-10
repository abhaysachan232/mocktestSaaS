"use client";

import Link from "next/link";

import { Users, IndianRupee, Plus, Building2, BookOpen } from "lucide-react";
import { ROUTES } from "@/lib/constans";
import LogOutButton from "../ui/LogOutButton";
import { useApi } from "@/lib/use-api";

import type { AdminDashboardData } from "@/services/dashboard.service";
import { DataTable } from "../ui/DataTable";
import { StatsGrid } from "../ui/StatsGrid";

export default function AdminDashboardPage() {
  const { data, loading, error } = useApi<AdminDashboardData>(
    "/api/dashboard/admin",
  );
  console.log("AdminDashboardPage", data, loading, error);

  const stats = [
    {
      title: "Total Students",
      value: data?.students?.length || 0,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Coachings",
      value: data?.coachings?.length || 0,
      icon: Building2,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Tests",
      value: 350,
      icon: BookOpen,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Revenue",
      value: "₹1,25,000",
      icon: IndianRupee,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white border-b shadow-sm px-4 md:px-10 py-5 flex flex-col md:flex-row justify-between md:items-center gap-5">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your platform</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/create-test"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} />
            Create Test
          </Link>

          <Link
            href={`${ROUTES.DASHBOARD}${ROUTES.CREATE_COACHING}`}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Building2 size={18} />
            Create Coaching
          </Link>
          {/* <LogOutButton /> */}
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 md:p-10">
        <StatsGrid stats={stats} />
        <div className="mt-10 bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Coachings</h2>
          <div className="overflow-x-auto">
            <DataTable
              loading={loading}
              data={data?.coachings ?? []}
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
                },
                {
                  key: "mobile",
                  header: "Mobile",
                  sortable: true,
                },
              ]}
              pageSize={10}
              onSelectionChange={(ids) => {
                console.log(ids);
              }}
            />
          </div>
        </div>

        <div className="mt-10 bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Students</h2>
          <div className="overflow-x-auto">
            <DataTable
              data={data?.students ?? []}
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
                  render: (row) => new Date(row.dob).toLocaleDateString(),
                },
                {
                  key: "actions",
                  header: "Actions",
                  render: (row) => (
                    <div className="flex gap-2">
                      <button onClick={() => console.log(row.id)}>Edit</button>
                      <button onClick={() => console.log(row.id)}>
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              loading={loading}
              pageSize={10}
              onSelectionChange={(ids) => {
                console.log(ids);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
