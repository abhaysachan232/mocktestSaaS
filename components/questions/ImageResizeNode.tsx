"use client";

import { Node, mergeAttributes } from "@tiptap/core";

import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";

import { useState } from "react";

type ImageAttrs = {
  src: string | null;
  alt: string;
  width: number;
  publicId: string | null;
  kind: "image" | "equation";
};

function ImageComponent({ node, updateAttributes }: ReactNodeViewProps) {
  const attrs = node.attrs as ImageAttrs;

  const [width, setWidth] = useState(attrs.width ?? 500);

  function startResize(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startWidth = width;

    function handleMouseMove(moveEvent: MouseEvent) {
      const difference = moveEvent.clientX - startX;

      const newWidth = Math.max(100, Math.min(1000, startWidth + difference));

      setWidth(newWidth);
    }

    function handleMouseUp() {
      updateAttributes({ width: width }); // final commit sirf yahan
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("mouseup", handleMouseUp);
  }

  if (!attrs.src) {
    return (
      <NodeViewWrapper className="my-4">
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600">
          Image URL is missing
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-4">
      <div
        contentEditable={false}
        className="group relative inline-block max-w-full"
        style={{
          width: `${width}px`,
        }}
      >
        <img
          src={attrs.src}
          alt={attrs.alt ?? ""}
          draggable={false}
          className="block h-auto max-w-full rounded border"
          style={{
            width: `${width}px`,
            height: "auto",
          }}
          onError={() => {
            console.error("Failed to load image:", attrs.src);
          }}
        />

        <button
          type="button"
          onMouseDown={startResize}
          className="absolute -bottom-2 -right-2 z-10 h-5 w-5 cursor-se-resize rounded-full border border-gray-400 bg-white shadow"
          aria-label="Resize image"
        />
      </div>
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
        default: 500,
        parseHTML: (element) =>
          Number(element.getAttribute("data-width") ?? 500),
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
