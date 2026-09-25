import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCoachingPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Coaching</h1>

          <p className="text-sm text-gray-500">
            Update coaching information
          </p>
        </div>

        <Link
          href="/dashboard/coachings"
          className="text-sm text-gray-600 hover:underline"
        >
          Back
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <p className="text-sm text-gray-600">
          Coaching ID:
        </p>

        <p className="mt-1 font-medium">
          {id}
        </p>
      </div>
    </div>
  );
}