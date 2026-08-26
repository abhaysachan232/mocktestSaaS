"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import type { JSONContent } from "@tiptap/react";
import EditorToolbar from "./EditorToolbar";
import { ImageResizeNode } from "./ImageResizeNode";

type Props = {
  value: JSONContent;
  onChange: (value: JSONContent) => void;
  minHeight?: string;
};

export default function QuestionEditor({
  value,
  onChange,
  minHeight = "180px",
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
      }),

      Link.configure({
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
      ImageResizeNode,
    ],
    content: value,
    onUpdate({ editor }) {
      const json = editor.getJSON();
      onChange(json);
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentContent = editor.getJSON();
    const currentString = JSON.stringify(currentContent);
    const valueString = JSON.stringify(value);

    if (currentString === valueString) {
      return;
    }

    editor.commands.setContent(value, {
      emitUpdate: false,
    });
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rounded-lg border p-4">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <EditorToolbar editor={editor} />

      <EditorContent
        editor={editor}
        className="question-editor p-4"
        style={{
          minHeight,
        }}
      />
    </div>
  );
}