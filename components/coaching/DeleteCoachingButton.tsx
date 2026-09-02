"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteCoaching } from "@/actions/coaching.actions";

type Props = {
  id: string;
};

export default function DeleteCoachingButton({ id }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this coaching?",
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const result = await deleteCoaching(id);

      if (!result.success) {
        alert(result.error);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to deactivate coaching");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Deactivating..." : "Deactivate"}
    </button>
  );
}
