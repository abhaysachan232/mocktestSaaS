"use client";

import type { JSONContent } from "@tiptap/react";

type Props = {
  content: JSONContent | null | undefined;
};

function renderNode(node: JSONContent, key: string) {
  switch (node.type) {
    case "doc":
      return (
        <div key={key}>
          {node.content?.map((child, index) =>
            renderNode(child, `${key}-${index}`),
          )}
        </div>
      );

    case "paragraph":
      return (
        <p key={key} className="mb-2 min-h-[1.5rem] last:mb-0">
          {node.content?.map((child, index) =>
            renderNode(child, `${key}-${index}`),
          )}
        </p>
      );

    case "text": {
      let content: React.ReactNode = node.text ?? "";

      const marks = node.marks ?? [];

      for (const mark of marks) {
        switch (mark.type) {
          case "bold":
            content = <strong key={`${key}-bold`}>{content}</strong>;
            break;

          case "italic":
            content = <em key={`${key}-italic`}>{content}</em>;
            break;

          case "strike":
            content = <s key={`${key}-strike`}>{content}</s>;
            break;

          case "code":
            content = (
              <code
                key={`${key}-code`}
                className="rounded bg-gray-100 px-1 py-0.5"
              >
                {content}
              </code>
            );
            break;

          case "subscript":
            content = <sub key={`${key}-subscript`}>{content}</sub>;
            break;

          case "superscript":
            content = <sup key={`${key}-superscript`}>{content}</sup>;
            break;
        }
      }

      return <span key={key}>{content}</span>;
    }

    case "hardBreak":
      return <br key={key} />;

    case "bulletList":
      return (
        <ul key={key} className="mb-3 list-disc pl-6">
          {node.content?.map((child, index) =>
            renderNode(child, `${key}-${index}`),
          )}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={key} className="mb-3 list-decimal pl-6">
          {node.content?.map((child, index) =>
            renderNode(child, `${key}-${index}`),
          )}
        </ol>
      );

    case "listItem":
      return (
        <li key={key}>
          {node.content?.map((child, index) =>
            renderNode(child, `${key}-${index}`),
          )}
        </li>
      );

    case "heading": {
      const level = node.attrs?.level ?? 2;

      const children = node.content?.map((child, index) =>
        renderNode(child, `${key}-${index}`),
      );

      if (level === 1) {
        return (
          <h1 key={key} className="mb-3 text-2xl font-bold">
            {children}
          </h1>
        );
      }

      if (level === 3) {
        return (
          <h3 key={key} className="mb-2 text-lg font-semibold">
            {children}
          </h3>
        );
      }

      return (
        <h2 key={key} className="mb-3 text-xl font-bold">
          {children}
        </h2>
      );
    }

    case "blockquote":
      return (
        <blockquote
          key={key}
          className="mb-3 border-l-4 pl-4 italic text-gray-600"
        >
          {node.content?.map((child, index) =>
            renderNode(child, `${key}-${index}`),
          )}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre
          key={key}
          className="mb-3 overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm"
        >
          <code>{node.content?.map((child) => child.text ?? "").join("")}</code>
        </pre>
      );

    case "resizableImage": {
      console.log("IMAGE NODE:", node);
      const src = node.attrs?.src;

      if (!src) {
        return null;
      }

      const width =
        typeof node.attrs?.width === "number" ? node.attrs.width : 500;

      return (
        <div
          key={key}
          className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
        >
          <div className="relative min-h-40 w-full">
          <img
            src={src}
            alt={node.attrs?.alt ?? ""}
            width={width}
            className="object-contain"
            onLoad={() => {
              console.log("IMAGE LOADED:", src);
            }}
            onError={() => {
              console.error("IMAGE LOAD FAILED:", src);
            }}
          />
          </div>
        </div>
      );
    }

    default:
      return (
        <div key={key}>
          {node.content?.map((child, index) =>
            renderNode(child, `${key}-${index}`),
          )}
        </div>
      );
  }
}

export default function QuestionContentRenderer({ content }: Props) {
  if (!content) {
    return <span className="text-sm text-gray-400">No solution available</span>;
  }
  return <div className="text-sm leading-6">{renderNode(content, "root")}</div>;
}
