import { errorResponse, successResponse } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { coachingRegisterSchema } from "@/schemas/coaching";
import { createCoaching } from "@/services/coaching.service";
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = coachingRegisterSchema.parse(body);
    console.log("validated", validated);
    const coaching = await createCoaching(validated);

    return successResponse(coaching, "Coaching registered successfully", 201);
  } catch (error) {
    return errorResponse(error, 400);
  }
}
