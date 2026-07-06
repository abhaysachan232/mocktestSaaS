"use client";

import Image from "next/image";
import {
  Users,
  IndianRupee,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import LogOutButton from "../ui/LogOutButton";
import { useApi } from "@/lib/use-api";
import { CoachingDashboardData } from "@/services/dashboard.service";
import { DataTable } from "../ui/DataTable";
import { StatsGrid } from "../ui/StatsGrid";

export default function CoachingDashboardPage() {
  const { data, loading, error } = useApi<CoachingDashboardData>(
    "/api/dashboard/coaching",
  );
  console.log('CoachingDashboardPage', data)
  const stats = [
    {
      title: "Total Students",
      value: data?.students?.length || 0,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Revenue",
      value: "₹1,25,000",
      icon: IndianRupee,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },

    {
      title: "Total Tests",
      value: 350,
      icon: BookOpen,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },

    {
      title: "Growth",
      value: "+18%",
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
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
        {/* Left */}
        <div className="flex items-center gap-4">
          Logo image
          {data?.coaching?.logo && <Image
            src={data?.coaching?.logo}
            alt="logo"
            width={70}
            height={70}
            className="rounded-2xl border object-cover"
          />}
          <div>
            <h1 className="text-3xl font-bold">
              {data?.coaching?.coachingName}
            </h1>

            <p className="text-gray-500 mt-1">
              Coupon :{" "}
              <span className="font-semibold">{data?.coaching?.code}</span>
            </p>
          </div>
        </div>

        {/* Logout */}
        <LogOutButton />
      </div>

      {/* Stats */}
      <div className="p-4 md:p-10">
        <StatsGrid stats={stats} />

        {/* Students */}
        <div className="mt-10 bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Referred Students</h2>

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
