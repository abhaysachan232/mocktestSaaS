import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoachingById } from "@/actions/coaching.actions";
import CoachingForm from "@/components/coaching/CoachingForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCoachingPage({ params }: Props) {
  const { id } = await params;
  const result = await getCoachingById(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Coaching</h1>

          <p className="text-sm text-gray-500">Update coaching information</p>
        </div>

        <Link
          href="/dashboard/coachings"
          className="text-sm text-gray-600 hover:underline"
        >
          Back
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <CoachingForm mode="edit" initialData={result.data} />
      </div>
    </div>
  );
}
