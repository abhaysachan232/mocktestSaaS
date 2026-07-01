"use client";

import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { ROLES } from "@/lib/constans";
import CoachingDashboard from "@/components/dashboard/CoachingDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { notFound } from "next/navigation";

const roleComponents = {
  [ROLES.ADMIN]: AdminDashboard,
  [ROLES.COACHING]: CoachingDashboard,
  [ROLES.STUDENT]: StudentDashboard,
};

export default function DashboardPage() {
  const { data: session, status } = useSession();

  console.log('DashboardPage', session, status);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const role = session?.user?.role;

  if (!role) {
    notFound();
  }

  const DashboardComponent =
    roleComponents[role as keyof typeof roleComponents];

  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardComponent />
    </main>
  );
}
