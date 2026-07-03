import { getAdminDashboard } from "@/services/dashboard.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const data = await getAdminDashboard();

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}
