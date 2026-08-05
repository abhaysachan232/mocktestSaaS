import { auth } from "@/lib/auth";
import { ROLES } from "@/lib/constans";
import CoachingDashboard from "@/components/dashboard/CoachingDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { notFound, redirect } from "next/navigation";

const roleComponents = {
  [ROLES.ADMIN]: AdminDashboard,
  [ROLES.COACHING]: CoachingDashboard,
  [ROLES.STUDENT]: StudentDashboard,
};

export default async function DashboardPage() {
  const session = await auth();

  console.log("DashboardPage", session);
  if (!session) {
    redirect("/login");
  }

  const role = session?.user?.role;
  console.log(role);

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
