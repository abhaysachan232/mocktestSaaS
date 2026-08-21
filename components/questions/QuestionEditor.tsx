"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Link as TiptapLink } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import type { JSONContent } from "@tiptap/react";
import EditorToolbar from "./EditorToolbar";
import { MathNode } from "./MathNode";
import { ImageResizeNode } from "./ImageResizeNode";

type Props = {
  value: JSONContent;
  onChange: (value: JSONContent) => void;
  minHeight?: string;
};

export default function QuestionEditor({
  value,
  onChange,
  minHeight = "220px",
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      TiptapLink.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Subscript,
      Superscript,
      MathNode,
      ImageResizeNode,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  if (!editor) {
    return <div className="rounded-lg border p-5">Loading editor...</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <EditorToolbar editor={editor} />

      <EditorContent
        editor={editor}
        style={{
          minHeight,
        }}
        className="question-editor p-4"
      />
    </div>
  );
}
