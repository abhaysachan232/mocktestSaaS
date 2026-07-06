import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getStudentDashboard } from "@/services/dashboard.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("You are Unauthorized");
    }

    const data = await getStudentDashboard(session.user.id);
    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}
