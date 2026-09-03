"use client";

import { useRef, useState } from "react";
import { createCoaching, updateCoaching } from "@/actions/coaching.actions";
import Image from "next/image";

type CoachingFormData = {
  id?: string;
  code: string;
  coachingName: string;
  ownerName: string;
  email: string;
  mobile: string;
  address: string;
  idNumber: string;
  isActive?: boolean;
  logo?: string | null;
  idProof?: string | null;
};

type Props = {
  mode: "create" | "edit";
  initialData?: CoachingFormData;
};

export default function CoachingForm({ mode, initialData }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logo ?? null,
  );
  const isEdit = mode === "edit";

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed for logo");
      return;
    }

    const preview = URL.createObjectURL(file);

    setLogoPreview(preview);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(event.currentTarget);

      if (isEdit) {
        formData.set("isActive", String(formData.get("isActive") === "true"));
      }

      const result = isEdit
        ? await updateCoaching(formData)
        : await createCoaching(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(
        isEdit
          ? "Coaching updated successfully"
          : "Coaching created successfully",
      );

      if (!isEdit) {
        formRef.current?.reset();
        setLogoPreview(null);
      }
    } catch (error) {
      console.error(error);

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {isEdit && (
        <input type="hidden" name="id" value={initialData?.id ?? ""} />
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* CODE */}

        <div>
          <label className="mb-1 block text-sm font-medium">
            Coaching Code
          </label>

          <input
            name="code"
            defaultValue={initialData?.code ?? ""}
            disabled={isEdit}
            required
            placeholder="ABC001"
            className="w-full rounded-md border px-3 py-2 disabled:bg-gray-100"
          />

          {isEdit && (
            <input type="hidden" name="code" value={initialData?.code ?? ""} />
          )}
        </div>

        {/* COACHING NAME */}

        <div>
          <label className="mb-1 block text-sm font-medium">
            Coaching Name
          </label>

          <input
            name="coachingName"
            defaultValue={initialData?.coachingName ?? ""}
            required
            placeholder="ABC Coaching Institute"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* OWNER */}

        <div>
          <label className="mb-1 block text-sm font-medium">Owner Name</label>

          <input
            name="ownerName"
            defaultValue={initialData?.ownerName ?? ""}
            required
            placeholder="Owner name"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* EMAIL */}

        <div>
          <label className="mb-1 block text-sm font-medium">Login Email</label>

          <input
            type="email"
            name="email"
            defaultValue={initialData?.email ?? ""}
            required
            placeholder="admin@coaching.com"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* PASSWORD */}

        <div>
          <label className="mb-1 block text-sm font-medium">
            {isEdit ? "New Password" : "Password"}
          </label>

          <input
            type="password"
            name="password"
            required={!isEdit}
            placeholder={
              isEdit
                ? "Leave blank to keep current password"
                : "Minimum 8 characters"
            }
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* MOBILE */}

        <div>
          <label className="mb-1 block text-sm font-medium">Mobile</label>

          <input
            name="mobile"
            defaultValue={initialData?.mobile ?? ""}
            required
            maxLength={10}
            placeholder="9876543210"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* ID NUMBER */}

        <div>
          <label className="mb-1 block text-sm font-medium">ID Number</label>

          <input
            name="idNumber"
            defaultValue={initialData?.idNumber ?? ""}
            required
            placeholder="Registration / ID number"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* STATUS */}

        {isEdit && (
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>

            <select
              name="isActive"
              defaultValue={initialData?.isActive ? "true" : "false"}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="true">Active</option>

              <option value="false">Inactive</option>
            </select>
          </div>
        )}
      </div>

      {/* ADDRESS */}

      <div>
        <label className="mb-1 block text-sm font-medium">Address</label>

        <textarea
          name="address"
          defaultValue={initialData?.address ?? ""}
          required
          rows={4}
          placeholder="Full coaching address"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* FILES */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* LOGO */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Coaching Logo
          </label>

          <input
            type="file"
            name="logo"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleLogoChange}
            className="w-full rounded-md border p-2"
          />

          {logoPreview && (
            <div className="mt-3">
              <Image
                src={logoPreview}
                alt="Coaching logo"
                width={120}
                height={120}
                className="h-24 w-24 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* ID PROOF */}

        <div>
          <label className="mb-2 block text-sm font-medium">ID Proof</label>

          <input
            type="file"
            name="idProof"
            accept=".pdf,image/jpeg,image/png,image/webp"
            className="w-full rounded-md border p-2"
          />

          {isEdit && initialData?.idProof && (
            <a
              href={initialData.idProof}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              View existing ID proof
            </a>
          )}
        </div>
      </div>

      {/* SUBMIT */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-6 py-2 text-white disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : isEdit
              ? "Update Coaching"
              : "Create Coaching"}
        </button>
      </div>
    </form>
  );
}
