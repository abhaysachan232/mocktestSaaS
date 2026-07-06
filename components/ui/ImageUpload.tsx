"use client";

import { MAX_IMAGE_SIZE } from "@/lib/constans";
import { useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  folder: string;
}

export default function ImageUpload({
  value,
  onChange,
  error,
  label = "Upload Image",
  folder,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;
    setUploadError("");

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError("Image size must be less than 2 MB.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/uploadFile", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to upload image");
      }

      if (!result.url) {
        throw new Error("Invalid upload response");
      }

      onChange(result.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-medium text-sm">{label}</label>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={loading}
        className="w-full border rounded-lg p-2"
      />

      {loading && <p className="text-sm text-blue-500">Uploading...</p>}

      {value && (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
          {value}
        </div>
      )}

      {(error || uploadError) && (
        <p className="text-sm text-red-500">{error || uploadError}</p>
      )}
    </div>
  );
}
