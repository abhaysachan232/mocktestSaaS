import { errorResponse, successResponse } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { getCoachingDashboard } from "@/services/dashboard.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.coachingId) {
      throw new Error("Coaching not found");
    }

    const data = await getCoachingDashboard(session.user.coachingId);

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}
