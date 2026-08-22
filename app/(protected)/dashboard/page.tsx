import { auth } from "@/lib/auth";
import { ROLES } from "@/lib/constans";
import CoachingDashboard from "@/components/dashboard/CoachingDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import {
  getAdminDashboard,
  getCoachingDashboard,
  getStudentDashboard,
} from "@/actions/dashboard.actions";
import { notFound, redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const role = session.user.role;

  if (!userId || !role) {
    notFound();
  }

  // -------------------------
  // ADMIN
  // -------------------------
  if (role === ROLES.ADMIN) {
    const data = await getAdminDashboard();
    if (!data) {
      notFound();
    }
    return (
      <main className="min-h-screen bg-slate-50">
        <AdminDashboard userId={userId} data={data} />
      </main>
    );
  }

  // -------------------------
  // COACHING
  // -------------------------
  if (role === ROLES.COACHING) {
    const data = await getCoachingDashboard(userId);
    if (!data) {
      notFound();
    }
    return (
      <main className="min-h-screen bg-slate-50">
        <CoachingDashboard userId={userId} data={data} />
      </main>
    );
  }

  // -------------------------
  // STUDENT
  // -------------------------
  if (role === ROLES.STUDENT) {
    const data = await getStudentDashboard(userId);
    if (!data) {
      notFound();
    }
    return (
      <main className="min-h-screen bg-slate-50">
        <StudentDashboard userId={userId} data={data} />
      </main>
    );
  }

  notFound();
}
