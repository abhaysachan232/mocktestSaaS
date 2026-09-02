import Link from "next/link";
import { getCoachings } from "@/actions/coaching.actions";
import CoachingTable from "@/components/coaching/CoachingTable";

export default async function CoachingsPage() {
  const result = await getCoachings();

  if (!result.success) {
    return <div className="p-6 text-red-600">{result.error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coachings</h1>

          <p className="text-sm text-gray-500">Manage coaching institutes</p>
        </div>

        <Link
          href="/dashboard/coachings/new"
          className="rounded-md bg-black px-4 py-2 text-sm text-white"
        >
          + Add Coaching
        </Link>
      </div>

      <CoachingTable data={result.data} />
    </div>
  );
}
