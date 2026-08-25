"use client";

import type { Editor } from "@tiptap/react";
import { useRef, useState } from "react";

import { uploadQuestionImage } from "@/actions/upload.actions";

type Props = {
  editor: Editor;
};

export default function EditorToolbar({
  editor,
}: Props) {
  const fileRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  async function uploadImage(file: File) {
    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const result =
        await uploadQuestionImage(formData);

      console.log(
        "uploadQuestionImage result:",
        result,
      );

      if (!result.success) {
        alert(result.error);
        return;
      }

      const imageAttrs = {
        src: result.data.secure_url,
        alt: file.name,
        width: result.data.width ?? 500,
        publicId: result.data.public_id,
        kind: "image" as const,
      };

      console.log(
        "Image attrs:",
        imageAttrs,
      );

      editor
        .chain()
        .focus()
        .insertContent({
          type: "resizableImage",
          attrs: imageAttrs,
        })
        .run();

      // IMPORTANT:
      // Check what Tiptap actually stored.
      console.log(
        "Editor JSON after image:",
        JSON.stringify(
          editor.getJSON(),
          null,
          2,
        ),
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error,
      );

      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
      <button
        type="button"
        disabled={uploading}
        className="toolbar-btn"
        onClick={() =>
          fileRef.current?.click()
        }
      >
        {uploading
          ? "Uploading..."
          : "Image"}
      </button>

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={async (event) => {
          const file =
            event.target.files?.[0];

          if (!file) {
            return;
          }

          await uploadImage(file);

          event.target.value = "";
        }}
      />
    </div>
  );
}