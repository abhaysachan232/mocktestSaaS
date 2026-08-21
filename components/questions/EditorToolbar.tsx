"use client";

import type { Editor } from "@tiptap/react";
import { useRef, useState } from "react";
import { uploadQuestionImage } from "@/actions/upload.actions";

type Props = {
  editor: Editor;
};

export default function EditorToolbar({ editor }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File) {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadQuestionImage(formData);

      if (!result.success) {
        alert(result.error);
        return;
      }

      editor
        .chain()
        .focus()
        .insertContent({
          type: "resizableImage",
          attrs: {
            src: result.data.url,
            width: result.data.width,
            publicId: result.data.public_id,
          },
        })
        .run();
    } finally {
      setUploading(false);
    }
  }

  function openImagePicker() {
    fileRef.current?.click();
  }

  function addMath() {
    const latex = window.prompt("Enter LaTeX equation", "x^2 + y^2 = z^2");
    if (!latex?.trim()) {
      return;
    }
    (editor.chain().focus() as any).setMath(latex).run();
  }

  return (
    <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="toolbar-btn"
      >
        <b>B</b>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="toolbar-btn"
      >
        <i>I</i>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="toolbar-btn"
      >
        • List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="toolbar-btn"
      >
        1. List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className="toolbar-btn"
      >
        X²
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className="toolbar-btn"
      >
        X₂
      </button>

      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            })
            .run()
        }
        className="toolbar-btn"
      >
        Table
      </button>

      <button type="button" onClick={addMath} className="toolbar-btn">
        ∑ Math
      </button>

      <button
        type="button"
        disabled={uploading}
        onClick={openImagePicker}
        className="toolbar-btn"
      >
        {uploading ? "Uploading..." : "Image"}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        hidden
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file) {
            await uploadImage(file);
          }
          event.target.value = "";
        }}
      />
    </div>
  );
}
