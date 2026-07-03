"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Users,
  FileText,
  IndianRupee,
  Activity,
  Plus,
  Building2,
  Trash2,
} from "lucide-react";
import { ROUTES } from "@/lib/constans";
import LogOutButton from "../ui/LogOutButton";
import { useApi } from "@/lib/use-api";
import { CoachingRegisterInput } from "@/schemas/coaching";

export default function AdminDashboardPage() {
  const router = useRouter();

  

const {
  data: coachings,
  loading,
  error,
} = useApi<CoachingRegisterInput[]>("/api/coaching");
console.log('data', coachings, loading, error)

  

  // Logout
  const handleLogout = async () => {};

  // Delete Coaching
  const deleteCoaching = async (id: string) => {};

  // Delete Student
  const deleteStudent = async (id: string) => {};

  const stats = [
    {
      title: "Total Students",

      value: 0,

      icon: Users,
    },

    {
      title: "Total Tests",

      value: 0,

      icon: FileText,
    },

    {
      title: "Revenue",

      value: `₹${0}`,

      icon: IndianRupee,
    },

    {
      title: "Active Users",

      value: 0,

      icon: Activity,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
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
            href={ROUTES.DASHBOARD + ROUTES.CREATE_COACHING}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Building2 size={18} />
            Create Coaching
          </Link>
          <LogOutButton />
        </div>
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

        {/* Coaching List */}
        <div className="mt-10 bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Coachings</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4">Logo</th>

                  <th className="text-left py-4">Name</th>

                  <th className="text-left py-4">Email</th>

                  <th className="text-left py-4">Code</th>

                  <th className="text-left py-4">Mobile</th>
                  <th className="text-left py-4">Owner Name</th>

                  <th className="text-left py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {coachings?.map((coaching, ind) => (
                  <tr key={coaching.coachingName+ind} className="border-b">
                    <td className="py-4">
                      {coaching.logo && (
                        <Image
                          src={coaching.logo}
                          alt="logo"
                          width={55}
                          height={55}
                          className="rounded-2xl border object-cover"
                        />
                      )}
                    </td>

                    <td className="py-4 font-medium">{coaching.coachingName}</td>

                    <td className="py-4">{coaching.email}</td>

                    <td className="py-4">{coaching.code}</td>

                    <td className="py-4">{coaching.mobile}</td>
                    <td className="py-4">{coaching.ownerName}</td>

                    <td className="py-4">
                      <button
                        onClick={() => deleteCoaching(coaching.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student List */}
        <div className="mt-10 bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Students</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4">Name</th>

                  <th className="text-left py-4">Email</th>

                  <th className="text-left py-4">Action</th>
                </tr>
              </thead>

              {/* <tbody>
                {data?.students?.map((student) => (
                  <tr key={student._id} className="border-b">
                    <td className="py-4 font-medium">{student.name}</td>

                    <td className="py-4">{student.email}</td>

                    <td className="py-4">
                      <button
                        onClick={() => deleteStudent(student._id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody> */}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
