"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import katex from "katex";
import "katex/dist/katex.min.css";

function MathComponent({ node }: any) {
  const html = katex.renderToString(node.attrs.latex, {
    throwOnError: false,
    displayMode: true,
  });

  return (
    <NodeViewWrapper className="my-4 rounded-lg border bg-gray-50 p-4 text-center">
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </NodeViewWrapper>
  );
}

export const MathNode = Node.create({
  name: "math",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: "x^2",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-math]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-math": "",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent);
  },

  addCommands() {
    return {
      setMath:
        (latex: string) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              latex,
            },
          });
        },
    } as any;
  },
});
