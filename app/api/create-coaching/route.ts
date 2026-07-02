import { coachingRegisterSchema } from "@/schemas/coaching";
import { createCoaching, getAllCoachings } from "@/services/coaching.service";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET() {
  try {
    return successResponse(await getAllCoachings());
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
