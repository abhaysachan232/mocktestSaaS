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
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Mathematics from "@tiptap/extension-mathematics";
import { CharacterCount } from "@tiptap/extensions";

import type { JSONContent } from "@tiptap/react";

import "katex/dist/katex.min.css";

import EditorToolbar from "./EditorToolbar";
import { ImageResizeNode } from "./ImageResizeNode";

type Props = {
  value: JSONContent;
  onChange: (value: JSONContent) => void;
  minHeight?: string;
};

export default function RichContentEditor({
  value,
  onChange,
  minHeight = "240px",
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        link: false,
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),

      Underline,

      Highlight.configure({
        multicolor: true,
      }),

      Subscript,
      Superscript,

      TextStyleKit,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),

      TableRow,
      TableHeader,
      TableCell,

      Mathematics.configure({
        katexOptions: {
          throwOnError: false,
        },
      }),

      CharacterCount,

      ImageResizeNode,
    ],

    content: value,

    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },

    editorProps: {
      attributes: {
        class: "rich-editor-content",
        spellcheck: "true",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(value);

    if (current === incoming) {
      return;
    }

    editor.commands.setContent(value, {
      emitUpdate: false,
    });
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="text-sm text-slate-500">Loading editor...</div>
      </div>
    );
  }

  const characters = editor.storage.characterCount?.characters?.() ?? 0;
  const words = editor.storage.characterCount?.words?.() ?? 0;

  return (
    <div className="rich-editor">
      <EditorToolbar editor={editor} />

      <div className="rich-editor-body">
        <EditorContent
          editor={editor}
          style={{
            minHeight,
          }}
        />
      </div>

      <div className="rich-editor-status">
        <span>{words} words</span>
        <span className="rich-editor-status-dot">•</span>
        <span>{characters} characters</span>
      </div>
    </div>
  );
}
