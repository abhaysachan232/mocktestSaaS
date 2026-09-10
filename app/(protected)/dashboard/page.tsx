"use server";

import { auth } from "@/lib/auth";
import { ROLES } from "@/lib/constans";
import CoachingDashboard from "@/components/dashboard/CoachingDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import {
  getAdminDashboard,
  getCoachingDashboard,
  getStudentDashboard,
} from "@/lib/actions/dashboard.actions";
import { notFound, redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const role = session.user.role;
  console.log('role', role, userId, session)

  if (!userId || !role) {
    notFound();
  }

  // -------------------------
  // ADMIN
  // -------------------------
  if (role === ROLES.ADMIN) {
    const result = await getAdminDashboard();
    if (!result.success || !result.data) {
    notFound();
  }
    return (
      <main className="min-h-screen bg-slate-50">
        <AdminDashboard data={result.data} />
      </main>
    );
  }

  // -------------------------
  // COACHING
  // -------------------------
  if (role === ROLES.COACHING) {
    const result = await getCoachingDashboard();
    console.log('result', result)
    if (!result.success || !result.data) {
    notFound();
  }
    
    return (
      <main className="min-h-screen bg-slate-50">
        <CoachingDashboard data={result.data} />
      </main>
    );
  }

  // -------------------------
  // STUDENT
  // -------------------------
  if (role === ROLES.STUDENT) {
    const result = await getStudentDashboard();
    if (!result.success || !result.data) {
      return <div>Unable to load dashboard.</div>;
    }
    return (
      <main className="min-h-screen bg-slate-50">
        <StudentDashboard data={result.data} />
      </main>
    );
  }

  notFound();
}
