"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useState } from "react";

function ImageComponent({ node, updateAttributes }: any) {
  const [width, setWidth] = useState(node.attrs.width ?? 500);

  function resize(event: React.MouseEvent) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;
    function onMove(moveEvent: MouseEvent) {
      const newWidth = Math.max(100, startWidth + (moveEvent.clientX - startX));
      setWidth(newWidth);
      updateAttributes({
        width: newWidth,
      });
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <NodeViewWrapper className="my-4">
      <div
        className="relative inline-block"
        style={{
          width,
          maxWidth: "100%",
        }}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt ?? ""}
          className="block h-auto max-w-full rounded"
        />

        <button
          type="button"
          onMouseDown={resize}
          className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-full border bg-white shadow"
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

  addAttributes() {
    return {
      src: {
        default: null,
      },

      alt: {
        default: "",
      },

      width: {
        default: 500,
      },

      publicId: {
        default: null,
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
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});
