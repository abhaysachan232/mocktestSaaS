"use client";

import Image from "next/image";
import type { JSONContent } from "@tiptap/react";
import type { ReactNode } from "react";

type Props = {
  content: JSONContent | null | undefined;

  /**
   * Compact mode:
   * Used in question listing/table/card views.
   * Images are limited to a smaller width.
   */
  compact?: boolean;
};

/* ============================================================
   HELPERS
   ============================================================ */

function renderChildren(
  node: JSONContent,
  key: string,
  compact: boolean,
): ReactNode {
  if (!Array.isArray(node.content)) {
    return null;
  }

  return node.content.map((child, index) =>
    renderNode(child, `${key}-${index}`, compact),
  );
}

/* ============================================================
   RENDER NODE
   ============================================================ */

function renderNode(
  node: JSONContent,
  key: string,
  compact: boolean,
): ReactNode {
  switch (node.type) {
    /* ========================================================
       DOCUMENT
       ======================================================== */

    case "doc":
      return (
        <div
          key={key}
          className="
            rich-content
            min-w-0
            max-w-none
            break-words
            text-[15px]
            leading-7
            text-slate-700

            [&_p]:break-words

            [&_ul]:list-disc
            [&_ol]:list-decimal

            [&_ul]:pl-6
            [&_ol]:pl-6

            [&_li]:list-item

            [&_ul_ul]:list-[circle]
            [&_ul_ul_ul]:list-[square]
          "
        >
          {renderChildren(node, key, compact)}
        </div>
      );

    /* ========================================================
       PARAGRAPH
       ======================================================== */

    case "paragraph":
      return (
        <p
          key={key}
          className="
            mb-3
            break-words
            whitespace-pre-wrap
            text-[15px]
            leading-7
            text-slate-700
            last:mb-0
          "
        >
          {renderChildren(node, key, compact)}
        </p>
      );

    /* ========================================================
       TEXT + MARKS
       ======================================================== */

    case "text": {
      let value: ReactNode = node.text ?? "";

      for (const mark of node.marks ?? []) {
        switch (mark.type) {
          /* --------------------------------------------------
             BOLD
             -------------------------------------------------- */

          case "bold":
            value = (
              <strong
                key={`${key}-bold`}
                className="font-semibold text-slate-900"
              >
                {value}
              </strong>
            );
            break;

          /* --------------------------------------------------
             ITALIC
             -------------------------------------------------- */

          case "italic":
            value = (
              <em key={`${key}-italic`} className="italic text-slate-700">
                {value}
              </em>
            );
            break;

          /* --------------------------------------------------
             STRIKE
             -------------------------------------------------- */

          case "strike":
            value = (
              <s key={`${key}-strike`} className="text-slate-500 line-through">
                {value}
              </s>
            );
            break;

          /* --------------------------------------------------
             INLINE CODE
             -------------------------------------------------- */

          case "code":
            value = (
              <code
                key={`${key}-code`}
                className="
                  mx-0.5
                  rounded-md
                  border
                  border-slate-200
                  bg-slate-100
                  px-1.5
                  py-0.5
                  font-mono
                  text-[13px]
                  text-pink-600
                "
              >
                {value}
              </code>
            );
            break;

          /* --------------------------------------------------
             SUBSCRIPT
             -------------------------------------------------- */

          case "subscript":
            value = (
              <sub
                key={`${key}-subscript`}
                className="
                  align-sub
                  text-[0.72em]
                  leading-none
                "
              >
                {value}
              </sub>
            );
            break;

          /* --------------------------------------------------
             SUPERSCRIPT
             -------------------------------------------------- */

          case "superscript":
            value = (
              <sup
                key={`${key}-superscript`}
                className="
                  align-super
                  text-[0.72em]
                  leading-none
                "
              >
                {value}
              </sup>
            );
            break;

          /* --------------------------------------------------
             LINK
             -------------------------------------------------- */

          case "link": {
            const href =
              typeof mark.attrs?.href === "string" ? mark.attrs.href : null;

            if (!href) {
              break;
            }

            value = (
              <a
                key={`${key}-link`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  font-medium
                  text-blue-600
                  underline
                  decoration-blue-300
                  underline-offset-2
                  transition
                  hover:text-blue-700
                  hover:decoration-blue-500
                "
              >
                {value}
              </a>
            );

            break;
          }

          default:
            break;
        }
      }

      return <span key={key}>{value}</span>;
    }

    /* ========================================================
       HARD BREAK
       ======================================================== */

    case "hardBreak":
      return <br key={key} />;

    /* ========================================================
       HEADING
       ======================================================== */

    case "heading": {
      const level = Number(node.attrs?.level ?? 2);

      if (level === 1) {
        return (
          <h1
            key={key}
            className="
              mt-6
              mb-4
              text-2xl
              font-bold
              leading-tight
              tracking-tight
              text-slate-950
              first:mt-0
            "
          >
            {renderChildren(node, key, compact)}
          </h1>
        );
      }

      if (level === 3) {
        return (
          <h3
            key={key}
            className="
              mt-5
              mb-2
              text-lg
              font-semibold
              leading-7
              text-slate-900
            "
          >
            {renderChildren(node, key, compact)}
          </h3>
        );
      }

      return (
        <h2
          key={key}
          className="
            mt-5
            mb-3
            text-xl
            font-bold
            leading-7
            text-slate-900
          "
        >
          {renderChildren(node, key, compact)}
        </h2>
      );
    }

    /* ========================================================
       BULLET LIST
       ======================================================== */

    case "bulletList":
      return (
        <ul
          key={key}
          data-type="bulletList"
          className="
            my-3
            list-disc
            list-outside
            pl-6
            text-[15px]
            leading-7
            text-slate-700

            [&>li]:list-item
            [&>li]:pl-1

            [&>li>p]:m-0
            [&>li>p]:p-0

            [&_ul]:my-1
            [&_ul]:list-circle

            [&_ol]:my-1
            [&_ol]:list-decimal
          "
          style={{
            listStyleType: "disc",
            listStylePosition: "outside",
          }}
        >
          {renderChildren(node, key, compact)}
        </ul>
      );

    /* ========================================================
       ORDERED LIST
       ======================================================== */

    case "orderedList":
      return (
        <ol
          key={key}
          data-type="orderedList"
          className="
            my-3
            list-decimal
            list-outside
            pl-6
            text-[15px]
            leading-7
            text-slate-700

            [&>li]:list-item
            [&>li]:pl-1

            [&>li>p]:m-0
            [&>li>p]:p-0

            [&_ul]:my-1
            [&_ul]:list-disc

            [&_ol]:my-1
            [&_ol]:list-decimal
          "
          style={{
            listStyleType: "decimal",
            listStylePosition: "outside",
          }}
        >
          {renderChildren(node, key, compact)}
        </ol>
      );

    /* ========================================================
       LIST ITEM
       ======================================================== */

    case "listItem":
      return (
        <li
          key={key}
          className="
            list-item
            pl-1
            leading-7

            [&>p]:m-0
            [&>p]:inline
          "
        >
          {renderChildren(node, key, compact)}
        </li>
      );

    /* ========================================================
       BLOCKQUOTE
       ======================================================== */

    case "blockquote":
      return (
        <blockquote
          key={key}
          className="
            my-4
            rounded-r-lg
            border-l-4
            border-slate-300
            bg-slate-50
            px-4
            py-3
            text-slate-600

            [&>p]:mb-0
          "
        >
          {renderChildren(node, key, compact)}
        </blockquote>
      );

    /* ========================================================
       CODE BLOCK
       ======================================================== */

    case "codeBlock": {
      const code = (node.content ?? [])
        .map((child) => {
          if (child.type === "text") {
            return child.text ?? "";
          }

          return child.content?.map((item) => item.text ?? "").join("") ?? "";
        })
        .join("");

      return (
        <pre
          key={key}
          className="
            my-4
            max-w-full
            overflow-x-auto
            rounded-xl
            border
            border-slate-800
            bg-slate-950
            p-4
            text-sm
            leading-6
          "
        >
          <code className="font-mono text-slate-100">{code}</code>
        </pre>
      );
    }

    /* ========================================================
       RESIZABLE IMAGE
       ======================================================== */

    case "resizableImage": {
      const src = node.attrs?.src;

      if (typeof src !== "string" || !src.trim()) {
        return null;
      }

      const alt =
        typeof node.attrs?.alt === "string" ? node.attrs.alt : "Question image";

      /* ------------------------------------------------------
         WIDTH
         ------------------------------------------------------ */

      const originalWidth =
        typeof node.attrs?.width === "number" && node.attrs.width > 0
          ? node.attrs.width
          : 320;

      const displayWidth = compact
        ? Math.min(originalWidth, 220)
        : originalWidth;

      /* ------------------------------------------------------
         HEIGHT

         Prefer stored image height.

         Fallback:
         use 180px instead of assuming a fake 60% ratio.
         ------------------------------------------------------ */

      const originalHeight =
        typeof node.attrs?.height === "number" && node.attrs.height > 0
          ? node.attrs.height
          : 180;

      const aspectRatio =
        originalWidth > 0 ? originalHeight / originalWidth : 0.5625;

      const displayHeight = Math.max(
        40,
        Math.round(displayWidth * aspectRatio),
      );

      /* ------------------------------------------------------
         IMAGE
         ------------------------------------------------------ */

      return (
        <span
          key={key}
          className="
            mx-1
            inline-block
            max-w-full
            align-middle
            leading-none
          "
          style={{
            maxWidth: "100%",
          }}
        >
          <span
            className="
              group
              relative
              inline-block
              max-w-full
              overflow-hidden
              rounded-lg
              border
              border-slate-200
              bg-white
              align-middle
              shadow-sm
              transition
              hover:border-slate-300
              hover:shadow-md
            "
          >
            <Image
              src={src}
              alt={alt}
              width={displayWidth}
              height={displayHeight}
              className="
                block
                h-auto
                max-w-full
                object-contain
              "
              sizes={
                compact
                  ? "220px"
                  : `(max-width: 640px) 100vw, ${originalWidth}px`
              }
            />
          </span>
        </span>
      );
    }

    /* ========================================================
       DEFAULT / UNKNOWN NODE
       ======================================================== */

    default:
      return <span key={key}>{renderChildren(node, key, compact)}</span>;
  }
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function RichContentRenderer({
  content,
  compact = false,
}: Props) {
  if (!content) {
    return (
      <div
        className="
          rounded-lg
          border
          border-dashed
          border-slate-200
          bg-slate-50
          px-4
          py-3
          text-sm
          text-slate-400
        "
      >
        No solution available
      </div>
    );
  }

  return (
    <div
      className="
        rich-content
        min-w-0
        max-w-none
        break-words
        text-slate-700

        [&_ul]:list-disc
        [&_ol]:list-decimal
        [&_li]:list-item

        [&_ul]:list-outside
        [&_ol]:list-outside

        [&_ul]:pl-6
        [&_ol]:pl-6

        [&_ul_ul]:list-[circle]
        [&_ul_ul_ul]:list-[square]

        [&_li>p]:m-0
      "
    >
      {renderNode(content, "root", compact)}
    </div>
  );
}
