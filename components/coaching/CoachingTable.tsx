"use client";

import Link from "next/link";
import CoachingStatusBadge from "./CoachingStatusBadge";
import DeleteCoachingButton from "./DeleteCoachingButton";
import Image from "next/image";

type Coaching = {
  id: string;
  code: string;
  coachingName: string;
  mobile: string;
  ownerName: string;
  email: string | null;
  totalUsers: number;
  isActive: boolean;
  logo: string | null;
};

type Props = {
  data: Coaching[];
};

export default function CoachingTable({ data }: Props) {
  if (!data.length) {
    return (
      <div className="rounded-lg border bg-white p-10 text-center text-gray-500">
        No coaching found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Coaching</th>
            <th className="px-4 py-3 text-left">Owner</th>
            <th className="px-4 py-3 text-left">Mobile</th>
            <th className="px-4 py-3 text-left">Login</th>
            <th className="px-4 py-3 text-center">Users</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((coaching) => (
            <tr key={coaching.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {coaching.logo ? (
                    <Image
                      src={coaching.logo}
                      alt={coaching.coachingName}
                      className="h-10 w-10 rounded-md border object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-xs">
                      N/A
                    </div>
                  )}

                  <div>
                    <div className="font-medium">{coaching.coachingName}</div>
                    <div className="text-xs text-gray-500">{coaching.code}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">{coaching.ownerName}</td>
              <td className="px-4 py-4">{coaching.mobile}</td>
              <td className="px-4 py-4">{coaching.email ?? "-"}</td>
              <td className="px-4 py-4 text-center">{coaching.totalUsers}</td>
              <td className="px-4 py-4 text-center">
                <CoachingStatusBadge active={coaching.isActive} />
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/dashboard/coachings/${coaching.id}/edit`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  {coaching.isActive && (
                    <DeleteCoachingButton id={coaching.id} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
