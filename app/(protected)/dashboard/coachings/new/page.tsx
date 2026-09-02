import Link from "next/link";
import CoachingForm from "@/components/coaching/CoachingForm";

export default function NewCoachingPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add Coaching</h1>

          <p className="text-sm text-gray-500">Create a new coaching account</p>
        </div>

        <Link
          href="/dashboard/coachings"
          className="text-sm text-gray-600 hover:underline"
        >
          Back
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <CoachingForm mode="create" />
      </div>
    </div>
  );
}
