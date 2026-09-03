"use client";

import Image from "next/image";
import { Node, mergeAttributes } from "@tiptap/core";

import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";

import { useRef, useState } from "react";

type ImageAttrs = {
  src: string | null;
  alt: string;
  width: number;
  publicId: string | null;
  kind: "image" | "equation";
};

const MIN_WIDTH = 160;
const MAX_WIDTH = 900;
const DEFAULT_WIDTH = 600;

function normalizeWidth(value: unknown): number {
  const width = Number(value);

  if (!Number.isFinite(width) || width <= 0) {
    return DEFAULT_WIDTH;
  }

  return Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH);
}

function ImageComponent({
  node,
  updateAttributes,
  selected,
}: ReactNodeViewProps) {
  const attrs = node.attrs as ImageAttrs;

  const nodeWidth = normalizeWidth(attrs.width);

  const [width, setWidth] = useState(nodeWidth);
  const [resizing, setResizing] = useState(false);

  const widthRef = useRef(nodeWidth);

  /*
   * IMPORTANT:
   *
   * Do NOT use useEffect(() => setWidth(...)).
   *
   * Tiptap normally creates/updates the NodeView when the node
   * attributes change. We update local state only when the
   * component is not actively being resized.
   */
  if (!resizing && width !== nodeWidth) {
    setWidth(nodeWidth);
  }

  function startResize(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startWidth = width;

    widthRef.current = startWidth;

    setResizing(true);

    function handleMouseMove(moveEvent: MouseEvent) {
      const difference = moveEvent.clientX - startX;

      const nextWidth = Math.max(
        MIN_WIDTH,
        Math.min(MAX_WIDTH, startWidth + difference),
      );

      widthRef.current = nextWidth;

      setWidth(nextWidth);
    }

    function handleMouseUp() {
      const finalWidth = Math.round(widthRef.current);

      updateAttributes({
        width: finalWidth,
      });

      setResizing(false);

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  if (!attrs.src) {
    return (
      <NodeViewWrapper className="rich-image-node">
        <div className="rich-image-error">Image URL is missing</div>
      </NodeViewWrapper>
    );
  }

  /*
   * We don't have image height in the current node attributes.
   * `height: auto` lets the browser preserve the actual ratio.
   */
  const imageHeight = Math.max(40, Math.round(width * 0.5625));

  return (
    <NodeViewWrapper className="rich-image-node">
      <figure
        contentEditable={false}
        className={["rich-image-figure", selected ? "rich-image-selected" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="rich-image-frame">
          <Image
            src={attrs.src}
            alt={attrs.alt || "Question image"}
            width={width}
            height={imageHeight}
            draggable={false}
            className="rich-image"
            sizes="(max-width: 900px) 100vw, 900px"
            style={{
              width: `${width}px`,
              height: "auto",
              maxWidth: "100%",
            }}
            unoptimized
            onError={() => {
              console.error("Failed to load image:", attrs.src);
            }}
          />
        </div>

        {(selected || resizing) && (
          <>
            <button
              type="button"
              aria-label="Resize image"
              className="rich-image-resize-handle"
              onMouseDown={startResize}
            />

            {resizing && (
              <div className="rich-image-size">{Math.round(width)} px</div>
            )}
          </>
        )}
      </figure>
    </NodeViewWrapper>
  );
}

export const ImageResizeNode = Node.create({
  name: "resizableImage",

  group: "block",

  atom: true,

  selectable: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,

        parseHTML: (element) => element.getAttribute("src"),
      },

      alt: {
        default: "",

        parseHTML: (element) => element.getAttribute("alt") ?? "",
      },

      width: {
        default: DEFAULT_WIDTH,

        parseHTML: (element) => {
          const value = Number(element.getAttribute("data-width"));

          return Number.isFinite(value) && value > 0 ? value : DEFAULT_WIDTH;
        },
      },

      publicId: {
        default: null,

        parseHTML: (element) => element.getAttribute("data-public-id"),
      },

      kind: {
        default: "image",

        parseHTML: (element) => element.getAttribute("data-kind") ?? "image",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-resizable-image]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-resizable-image": "",
        "data-width": HTMLAttributes.width,
        "data-public-id": HTMLAttributes.publicId,
        "data-kind": HTMLAttributes.kind,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});
