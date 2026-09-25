export const dynamic = "force-dynamic";

import Link from "next/link";

export default function CoachingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coachings</h1>

          <p className="text-sm text-gray-500">
            Manage coaching institutes
          </p>
        </div>

        <Link
          href="/dashboard/coachings/new"
          className="rounded-md bg-black px-4 py-2 text-sm text-white"
        >
          + Add Coaching
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <p className="text-gray-600">
          Coaching data will appear here.
        </p>
      </div>
    </div>
  );
}