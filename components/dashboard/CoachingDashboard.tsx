"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Users, IndianRupee, TrendingUp, FileText } from "lucide-react";
import LogOutButton from "../ui/LogOutButton";
import { useApi } from "@/lib/use-api";
import { CoachingDashboardData } from "@/services/dashboard.service";

export default function CoachingDashboardPage() {
  
const {
  data,
  loading,
  error,
} = useApi<CoachingDashboardData>("/api/dashboard/coaching");
console.log('CoachingDashboardPage', data)

  // Logout

  const stats = [
    {
      title: "Total Students",

      value: 0,

      icon: Users,
    },

    {
      title: "Revenue",

      value: `₹${0}`,

      icon: IndianRupee,
    },

    {
      title: "Total Tests",

      value: 0,

      icon: FileText,
    },

    {
      title: "Growth",

      value: "+18%",

      icon: TrendingUp,
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
          Logo
          {/* {data?.coaching?.logo && (
            <Image
              src={data.coaching.logo}
              alt="logo"
              width={70}
              height={70}
              className="rounded-2xl border object-cover"
            />
          )} */}
          <div>
            <h1 className="text-3xl font-bold">Choching Name</h1>

            <p className="text-gray-500 mt-1">
              Coupon : <span className="font-semibold">Coupon_code</span>
            </p>
          </div>
        </div>

        {/* Logout */}
        <LogOutButton />
      </div>

      {/* Stats */}
      <div className="p-4 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="bg-white rounded-3xl p-7 shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500">{item.title}</p>

                    <h2 className="text-4xl font-bold mt-4">{item.value}</h2>
                  </div>

                  <div className="bg-blue-100 h-fit p-4 rounded-2xl">
                    <Icon className="text-blue-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Students */}
        <div className="mt-10 bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Referred Students</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4">Student</th>

                  <th className="text-left py-4">Exams</th>

                  <th className="text-left py-4">Avg Score</th>

                  <th className="text-left py-4">Weak Area</th>

                  <th className="text-left py-4">Strong Area</th>

                  <th className="text-left py-4">Improvement</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b last:border-none">
                  <td className="py-5 font-medium">student.name</td>
                  <td className="py-5">student.exams</td>
                  <td className="py-5">student.avgScore%</td>

                  <td className="py-5 text-red-500 font-medium">
                    student.weak
                  </td>

                  <td className="py-5 text-green-600 font-medium">
                    student.strong
                  </td>

                  <td className="py-5 font-semibold">student.improvement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
