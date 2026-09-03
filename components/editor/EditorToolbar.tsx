"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
  Code2,
  Eraser,
  FlaskConical,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Palette,
  Plus,
  Redo2,
  RemoveFormatting,
  Sigma,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table2,
  Type,
  Underline as UnderlineIcon,
  Undo2,
  X,
} from "lucide-react";

import { uploadFile } from "@/actions/upload.actions";

type Props = {
  editor: Editor;
};

type PopupProps = {
  children: ReactNode;
  align?: "left" | "right";
};

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Inter", value: "Inter" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Verdana", value: "Verdana" },
];

const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
];

const TEXT_COLORS = [
  "#0f172a",
  "#334155",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#db2777",
];

const HIGHLIGHT_COLORS = [
  "#fef08a",
  "#fde68a",
  "#bbf7d0",
  "#bfdbfe",
  "#ddd6fe",
  "#fbcfe8",
  "#fecaca",
  "#fed7aa",
];

/* =========================================================
   CHEMISTRY DATA
========================================================= */

const CHEMISTRY_ELEMENTS = [
  "H",
  "He",
  "Li",
  "Be",
  "B",
  "C",
  "N",
  "O",
  "F",
  "Ne",
  "Na",
  "Mg",
  "Al",
  "Si",
  "P",
  "S",
  "Cl",
  "Ar",
  "K",
  "Ca",
  "Sc",
  "Ti",
  "V",
  "Cr",
  "Mn",
  "Fe",
  "Co",
  "Ni",
  "Cu",
  "Zn",
  "Ga",
  "Ge",
  "As",
  "Se",
  "Br",
  "Kr",
  "Rb",
  "Sr",
  "Y",
  "Zr",
  "Nb",
  "Mo",
  "Tc",
  "Ru",
  "Rh",
  "Pd",
  "Ag",
  "Cd",
  "In",
  "Sn",
  "Sb",
  "Te",
  "I",
  "Xe",
  "Cs",
  "Ba",
  "La",
  "Ce",
  "Pr",
  "Nd",
  "Sm",
  "Eu",
  "Gd",
  "Tb",
  "Dy",
  "Ho",
  "Er",
  "Tm",
  "Yb",
  "Lu",
  "Hf",
  "Ta",
  "W",
  "Re",
  "Os",
  "Ir",
  "Pt",
  "Au",
  "Hg",
  "Tl",
  "Pb",
  "Bi",
  "Po",
  "At",
  "Rn",
];

const CHEMISTRY_SYMBOLS = [
  { label: "→", value: "→" },
  { label: "⇌", value: "⇌" },
  { label: "⟶", value: "⟶" },
  { label: "⟵", value: "⟵" },
  { label: "↑", value: "↑" },
  { label: "↓", value: "↓" },
  { label: "Δ", value: "Δ" },
  { label: "°", value: "°" },
  { label: "±", value: "±" },
  { label: "≈", value: "≈" },
  { label: "≡", value: "≡" },
  { label: "∞", value: "∞" },
];

const CHEMISTRY_GREEK = [
  { label: "α", value: "α" },
  { label: "β", value: "β" },
  { label: "γ", value: "γ" },
  { label: "δ", value: "δ" },
  { label: "ε", value: "ε" },
  { label: "θ", value: "θ" },
  { label: "λ", value: "λ" },
  { label: "μ", value: "μ" },
  { label: "π", value: "π" },
  { label: "σ", value: "σ" },
  { label: "φ", value: "φ" },
  { label: "ω", value: "ω" },
];

const CHEMISTRY_IONS = [
  "H⁺",
  "H⁻",
  "Na⁺",
  "K⁺",
  "Li⁺",
  "Ag⁺",
  "Cu⁺",
  "Cu²⁺",
  "Fe²⁺",
  "Fe³⁺",
  "Mg²⁺",
  "Ca²⁺",
  "Zn²⁺",
  "Al³⁺",
  "NH₄⁺",
  "OH⁻",
  "Cl⁻",
  "Br⁻",
  "I⁻",
  "NO₃⁻",
  "NO₂⁻",
  "SO₄²⁻",
  "SO₃²⁻",
  "CO₃²⁻",
  "HCO₃⁻",
  "PO₄³⁻",
  "CH₃COO⁻",
];

const CHEMISTRY_FORMULAS = [
  "H₂O",
  "CO₂",
  "CO",
  "O₂",
  "H₂",
  "N₂",
  "Cl₂",
  "NH₃",
  "CH₄",
  "C₂H₅OH",
  "HCl",
  "H₂SO₄",
  "HNO₃",
  "H₂CO₃",
  "NaOH",
  "KOH",
  "Ca(OH)₂",
  "NaCl",
  "Na₂CO₃",
  "NaHCO₃",
  "CaCO₃",
  "CaO",
  "CaCl₂",
  "MgO",
  "MgCl₂",
  "Al₂O₃",
  "Fe₂O₃",
  "Fe₃O₄",
  "CuSO₄",
  "ZnSO₄",
  "KMnO₄",
  "K₂Cr₂O₇",
  "AgNO₃",
  "NH₄Cl",
];

const CHEMISTRY_STATES = ["(s)", "(l)", "(g)", "(aq)"];

const CHEMISTRY_QUANTITIES = [
  "pH",
  "pOH",
  "pKa",
  "pKb",
  "Ka",
  "Kb",
  "Kc",
  "Kp",
  "ΔH",
  "ΔG",
  "ΔS",
  "E°",
  "Ecell",
  "λ",
  "ν",
  "c",
  "R",
  "Nₐ",
];

/* =========================================================
   UI HELPERS
========================================================= */

function Popup({ children, align = "left" }: PopupProps) {
  return (
    <div
      className={
        align === "right" ? "editor-popup editor-popup-right" : "editor-popup"
      }
    >
      {children}
    </div>
  );
}

function ToolbarButton({
  children,
  title,
  active = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      className={["editor-toolbar-btn", active ? "is-active" : ""].join(" ")}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ToolbarGroup({ children }: { children: ReactNode }) {
  return <div className="editor-toolbar-group">{children}</div>;
}

function PopupButton({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={["editor-popup-item", active ? "is-active" : ""].join(" ")}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* =========================================================
   MAIN TOOLBAR
========================================================= */

export default function EditorToolbar({ editor }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [openPopup, setOpenPopup] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!toolbarRef.current) {
        return;
      }

      if (!toolbarRef.current.contains(event.target as Node)) {
        setOpenPopup(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function togglePopup(name: string) {
    setOpenPopup((current) => (current === name ? null : name));
  }

  function closePopup() {
    setOpenPopup(null);
  }

  /* =======================================================
     TEXT
  ======================================================= */

  function setHeading(level: 1 | 2 | 3) {
    editor.chain().focus().toggleHeading({ level }).run();

    closePopup();
  }

  function setParagraph() {
    editor.chain().focus().setParagraph().run();
    closePopup();
  }

  function setFontFamily(value: string) {
    const chain = editor.chain().focus();

    if (!value) {
      chain.unsetFontFamily().run();
    } else {
      chain.setFontFamily(value).run();
    }

    closePopup();
  }

  function setFontSize(value: string) {
    editor.chain().focus().setFontSize(value).run();
    closePopup();
  }

  function setTextColor(color: string) {
    editor.chain().focus().setColor(color).run();
    closePopup();
  }

  function setHighlight(color: string) {
    editor.chain().focus().setHighlight({ color }).run();

    closePopup();
  }

  function clearHighlight() {
    editor.chain().focus().unsetHighlight().run();
    closePopup();
  }

  function setAlignment(alignment: "left" | "center" | "right" | "justify") {
    editor.chain().focus().setTextAlign(alignment).run();

    closePopup();
  }

  /* =======================================================
     LINK
  ======================================================= */

  function insertLink() {
    const currentHref = editor.getAttributes("link").href ?? "";

    setLinkUrl(currentHref);
    setOpenPopup("link");
  }

  function applyLink() {
    const url = linkUrl.trim();

    if (!url) {
      editor.chain().focus().unsetLink().run();
      closePopup();
      return;
    }

    editor
      .chain()
      .focus()
      .setLink({
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
      })
      .run();

    closePopup();
  }

  /* =======================================================
     IMAGE
  ======================================================= */

  async function uploadImage(file: File) {
    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const result = await uploadFile(formData, {
        folder: "questions",
        maxSizeMB: 5,
        resourceType: "image",
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      });

      if (!result.success) {
        window.alert(result.error);
        return;
      }

      const originalWidth = result.data.width ?? 600;

      const displayWidth = Math.min(originalWidth, 700);

      editor
        .chain()
        .focus()
        .insertContent({
          type: "resizableImage",
          attrs: {
            src: result.data.secure_url,
            alt: file.name,
            width: displayWidth,
            publicId: result.data.public_id,
            kind: "image",
          },
        })
        .run();
    } catch (error) {
      console.error("Image upload error:", error);

      window.alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  /* =======================================================
     MATH
  ======================================================= */

  function insertMath(type: "inline" | "block") {
    const latex = window.prompt(
      type === "inline" ? "Enter inline LaTeX:" : "Enter block LaTeX:",
      type === "inline" ? "\\frac{a}{b}" : "x^2 + y^2 = z^2",
    );

    if (!latex?.trim()) {
      return;
    }

    if (type === "inline") {
      editor
        .chain()
        .focus()
        .insertInlineMath({
          latex: latex.trim(),
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertBlockMath({
          latex: latex.trim(),
        })
        .run();
    }

    closePopup();
  }

  /* =======================================================
     CHEMISTRY
  ======================================================= */

  function insertChemistryText(value: string) {
    editor.chain().focus().insertContent(value).run();

    closePopup();
  }

  function insertChemistryFormula(formula: string) {
    editor.chain().focus().insertContent(formula).run();

    closePopup();
  }

  function insertSubscript() {
    editor.chain().focus().toggleSubscript().run();
  }

  function insertSuperscript() {
    editor.chain().focus().toggleSuperscript().run();
  }

  /* =======================================================
     TABLE
  ======================================================= */

  function insertTable(rows: number, cols: number, withHeader = true) {
    editor
      .chain()
      .focus()
      .insertTable({
        rows,
        cols,
        withHeaderRow: withHeader,
      })
      .run();

    closePopup();
  }

  /* =======================================================
     CLEAR
  ======================================================= */

  function clearFormatting() {
    editor.chain().focus().clearNodes().unsetAllMarks().run();

    closePopup();
  }

  return (
    <div ref={toolbarRef} className="rich-editor-toolbar">
      {/* ==================================================
          UNDO / REDO
      ================================================== */}

      <ToolbarGroup>
        <ToolbarButton
          title="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={18} />
        </ToolbarButton>

        <ToolbarButton
          title="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={18} />
        </ToolbarButton>
      </ToolbarGroup>

      {/* ==================================================
          TEXT STYLE
      ================================================== */}

      <ToolbarGroup>
        <div className="editor-popup-wrapper">
          <button
            type="button"
            className="editor-toolbar-select"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => togglePopup("text")}
          >
            <Type size={17} />

            <span>Text</span>

            <ChevronDown size={14} />
          </button>

          {openPopup === "text" && (
            <Popup>
              <div className="editor-popup-label">Paragraph style</div>

              <PopupButton
                active={editor.isActive("paragraph")}
                onClick={setParagraph}
              >
                Normal text
              </PopupButton>

              <PopupButton
                active={editor.isActive("heading", { level: 1 })}
                onClick={() => setHeading(1)}
              >
                <strong>Heading 1</strong>
              </PopupButton>

              <PopupButton
                active={editor.isActive("heading", { level: 2 })}
                onClick={() => setHeading(2)}
              >
                <strong>Heading 2</strong>
              </PopupButton>

              <PopupButton
                active={editor.isActive("heading", { level: 3 })}
                onClick={() => setHeading(3)}
              >
                <strong>Heading 3</strong>
              </PopupButton>
            </Popup>
          )}
        </div>
      </ToolbarGroup>

      {/* ==================================================
          FONT
      ================================================== */}

      <ToolbarGroup>
        <div className="editor-popup-wrapper">
          <button
            type="button"
            className="editor-toolbar-select editor-toolbar-select-wide"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => togglePopup("font")}
          >
            <span>Font</span>
            <ChevronDown size={14} />
          </button>

          {openPopup === "font" && (
            <Popup>
              <div className="editor-popup-label">Font family</div>

              {FONT_FAMILIES.map((font) => (
                <PopupButton
                  key={font.label}
                  onClick={() => setFontFamily(font.value)}
                >
                  <span
                    style={{
                      fontFamily: font.value || "inherit",
                    }}
                  >
                    {font.label}
                  </span>
                </PopupButton>
              ))}
            </Popup>
          )}
        </div>

        <div className="editor-popup-wrapper">
          <button
            type="button"
            className="editor-toolbar-select editor-toolbar-size"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => togglePopup("size")}
          >
            <span>16</span>
            <ChevronDown size={13} />
          </button>

          {openPopup === "size" && (
            <Popup>
              <div className="editor-popup-label">Font size</div>

              {FONT_SIZES.map((size) => (
                <PopupButton key={size} onClick={() => setFontSize(size)}>
                  {size}
                </PopupButton>
              ))}
            </Popup>
          )}
        </div>
      </ToolbarGroup>

      {/* ==================================================
          TEXT FORMATTING
      ================================================== */}

      <ToolbarGroup>
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>

        <ToolbarButton
          title="Strike"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={18} />
        </ToolbarButton>

        <ToolbarButton
          title="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code2 size={18} />
        </ToolbarButton>
      </ToolbarGroup>

      {/* ==================================================
          SUBSCRIPT / SUPERSCRIPT
      ================================================== */}

      <ToolbarGroup>
        <ToolbarButton
          title="Subscript"
          active={editor.isActive("subscript")}
          onClick={insertSubscript}
        >
          <SubscriptIcon size={18} />
        </ToolbarButton>

        <ToolbarButton
          title="Superscript"
          active={editor.isActive("superscript")}
          onClick={insertSuperscript}
        >
          <SuperscriptIcon size={18} />
        </ToolbarButton>
      </ToolbarGroup>

      {/* ==================================================
          LISTS
      ================================================== */}

      <ToolbarGroup>
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={19} />
        </ToolbarButton>

        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={19} />
        </ToolbarButton>
      </ToolbarGroup>

      {/* ==================================================
          ALIGNMENT
      ================================================== */}

      <ToolbarGroup>
        <div className="editor-popup-wrapper">
          <button
            type="button"
            className="editor-toolbar-select editor-toolbar-icon-select"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => togglePopup("align")}
          >
            {editor.isActive({
              textAlign: "center",
            }) ? (
              <AlignCenter size={18} />
            ) : editor.isActive({
                textAlign: "right",
              }) ? (
              <AlignRight size={18} />
            ) : editor.isActive({
                textAlign: "justify",
              }) ? (
              <AlignJustify size={18} />
            ) : (
              <AlignLeft size={18} />
            )}

            <ChevronDown size={13} />
          </button>

          {openPopup === "align" && (
            <Popup align="right">
              <PopupButton onClick={() => setAlignment("left")}>
                <AlignLeft size={17} />
                <span>Left</span>
              </PopupButton>

              <PopupButton onClick={() => setAlignment("center")}>
                <AlignCenter size={17} />
                <span>Center</span>
              </PopupButton>

              <PopupButton onClick={() => setAlignment("right")}>
                <AlignRight size={17} />
                <span>Right</span>
              </PopupButton>

              <PopupButton onClick={() => setAlignment("justify")}>
                <AlignJustify size={17} />
                <span>Justify</span>
              </PopupButton>
            </Popup>
          )}
        </div>
      </ToolbarGroup>

      {/* ==================================================
          COLORS
      ================================================== */}

      <ToolbarGroup>
        <div className="editor-popup-wrapper">
          <button
            type="button"
            className="editor-toolbar-select editor-toolbar-icon-select"
            title="Text color"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => togglePopup("color")}
          >
            <Palette size={19} />
            <ChevronDown size={13} />
          </button>

          {openPopup === "color" && (
            <Popup>
              <div className="editor-popup-label">Text color</div>

              <div className="editor-color-grid">
                {TEXT_COLORS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    title={color}
                    className="editor-color-swatch"
                    style={{
                      backgroundColor: color,
                    }}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setTextColor(color)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="editor-popup-clear"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();

                  closePopup();
                }}
              >
                <X size={14} />
                Remove color
              </button>
            </Popup>
          )}
        </div>

        <div className="editor-popup-wrapper">
          <button
            type="button"
            className="editor-toolbar-select editor-toolbar-icon-select"
            title="Highlight"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => togglePopup("highlight")}
          >
            <Highlighter size={19} />
            <ChevronDown size={13} />
          </button>

          {openPopup === "highlight" && (
            <Popup>
              <div className="editor-popup-label">Highlight</div>

              <div className="editor-color-grid">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    title={color}
                    className="editor-color-swatch editor-highlight-swatch"
                    style={{
                      backgroundColor: color,
                    }}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setHighlight(color)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="editor-popup-clear"
                onClick={clearHighlight}
              >
                <X size={14} />
                Remove highlight
              </button>
            </Popup>
          )}
        </div>
      </ToolbarGroup>

      {/* ==================================================
          LINK
      ================================================== */}

      <ToolbarGroup>
        <div className="editor-popup-wrapper">
          <ToolbarButton
            title="Link"
            active={editor.isActive("link")}
            onClick={insertLink}
          >
            <LinkIcon size={19} />
          </ToolbarButton>

          {openPopup === "link" && (
            <Popup>
              <div className="editor-popup-label">Add link</div>

              <input
                autoFocus
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyLink();
                  }
                }}
                placeholder="https://example.com"
                className="editor-popup-input"
              />

              <div className="editor-popup-actions">
                <button
                  type="button"
                  className="editor-popup-primary"
                  onClick={applyLink}
                >
                  Apply
                </button>

                <button
                  type="button"
                  className="editor-popup-secondary"
                  onClick={closePopup}
                >
                  Cancel
                </button>
              </div>
            </Popup>
          )}
        </div>
      </ToolbarGroup>

      {/* ==================================================
          IMAGE
      ================================================== */}

      <ToolbarGroup>
        <ToolbarButton
          title={uploading ? "Uploading image..." : "Insert image"}
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <ImageIcon size={19} />
        </ToolbarButton>

        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/png,image/jpeg,image/webp"
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (!file) {
              return;
            }

            await uploadImage(file);

            event.target.value = "";
          }}
        />
      </ToolbarGroup>

      {/* ==================================================
          TABLE
      ================================================== */}

      <ToolbarGroup>
        <div className="editor-popup-wrapper">
          <button
            type="button"
            className={[
              "editor-toolbar-btn",
              editor.isActive("table") ? "is-active" : "",
            ].join(" ")}
            title="Table"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => togglePopup("table")}
          >
            <Table2 size={19} />
          </button>

          {openPopup === "table" && (
            <Popup align="right">
              <div className="editor-popup-label">Insert table</div>

              <div className="editor-table-grid">
                {Array.from({
                  length: 25,
                }).map((_, index) => {
                  const row = Math.floor(index / 5) + 1;

                  const col = (index % 5) + 1;

                  return (
                    <button
                      type="button"
                      key={index}
                      title={`${row} × ${col}`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => insertTable(row, col)}
                    />
                  );
                })}
              </div>

              <div className="editor-popup-divider" />

              <PopupButton
                onClick={() => editor.chain().focus().addRowAfter().run()}
              >
                <Plus size={15} />
                Add row
              </PopupButton>

              <PopupButton
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              >
                <Plus size={15} />
                Add column
              </PopupButton>

              <PopupButton
                onClick={() => editor.chain().focus().deleteRow().run()}
              >
                <Minus size={15} />
                Delete row
              </PopupButton>

              <PopupButton
                onClick={() => editor.chain().focus().deleteColumn().run()}
              >
                <Minus size={15} />
                Delete column
              </PopupButton>

              <PopupButton
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              >
                <Check size={15} />
                Toggle header
              </PopupButton>

              <PopupButton
                onClick={() => editor.chain().focus().mergeOrSplit().run()}
              >
                Merge / split cells
              </PopupButton>

              <PopupButton
                onClick={() => editor.chain().focus().deleteTable().run()}
              >
                <X size={15} />
                Delete table
              </PopupButton>
            </Popup>
          )}
        </div>
      </ToolbarGroup>

      {/* ==================================================
          MATHEMATICS
      ================================================== */}

      <ToolbarGroup>
        <div className="editor-popup-wrapper">
          <button
            type="button"
            className="editor-toolbar-select editor-toolbar-icon-select"
            title="Mathematics"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => togglePopup("math")}
          >
            <Sigma size={19} />
            <ChevronDown size={13} />
          </button>

          {openPopup === "math" && (
            <Popup align="right">
              <div className="editor-popup-label">Mathematics</div>

              <PopupButton onClick={() => insertMath("inline")}>
                Inline equation
              </PopupButton>

              <PopupButton onClick={() => insertMath("block")}>
                Block equation
              </PopupButton>
            </Popup>
          )}
        </div>
      </ToolbarGroup>

      {/* ==================================================
          CHEMISTRY
      ================================================== */}

      <ToolbarGroup>
        <div className="editor-popup-wrapper">
          <button
            type="button"
            className="editor-toolbar-select editor-toolbar-icon-select"
            title="Chemistry"
            aria-label="Chemistry"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => togglePopup("chemistry")}
          >
            <FlaskConical size={19} />
            <ChevronDown size={13} />
          </button>

          {openPopup === "chemistry" && (
            <Popup align="right">
              <div className="editor-popup-label">Chemistry</div>

              {/* ELEMENTS */}

              <div className="editor-popup-section-title">Elements</div>

              <div
                className="editor-chemistry-grid"
                style={{
                  gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                }}
              >
                {CHEMISTRY_ELEMENTS.map((element) => (
                  <button
                    type="button"
                    key={element}
                    className="editor-chemistry-symbol"
                    title={`Insert ${element}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertChemistryText(element)}
                  >
                    {element}
                  </button>
                ))}
              </div>

              <div className="editor-popup-divider" />

              {/* IONS */}

              <div className="editor-popup-section-title">Common ions</div>

              <div className="editor-chemistry-grid">
                {CHEMISTRY_IONS.map((ion) => (
                  <button
                    type="button"
                    key={ion}
                    className="editor-chemistry-symbol"
                    title={`Insert ${ion}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertChemistryFormula(ion)}
                  >
                    {ion}
                  </button>
                ))}
              </div>

              <div className="editor-popup-divider" />

              {/* FORMULAS */}

              <div className="editor-popup-section-title">Common formulas</div>

              <div className="editor-chemistry-grid">
                {CHEMISTRY_FORMULAS.map((formula) => (
                  <button
                    type="button"
                    key={formula}
                    className="editor-chemistry-formula"
                    title={`Insert ${formula}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertChemistryFormula(formula)}
                  >
                    {formula}
                  </button>
                ))}
              </div>

              <div className="editor-popup-divider" />

              {/* REACTION SYMBOLS */}

              <div className="editor-popup-section-title">Reaction symbols</div>

              <div className="editor-chemistry-grid">
                {CHEMISTRY_SYMBOLS.map((symbol) => (
                  <button
                    type="button"
                    key={symbol.value}
                    className="editor-chemistry-symbol"
                    title={`Insert ${symbol.value}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertChemistryText(symbol.value)}
                  >
                    {symbol.label}
                  </button>
                ))}
              </div>

              <div className="editor-popup-divider" />

              {/* GREEK */}

              <div className="editor-popup-section-title">Greek symbols</div>

              <div className="editor-chemistry-grid">
                {CHEMISTRY_GREEK.map((symbol) => (
                  <button
                    type="button"
                    key={symbol.value}
                    className="editor-chemistry-symbol"
                    title={`Insert ${symbol.value}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertChemistryText(symbol.value)}
                  >
                    {symbol.label}
                  </button>
                ))}
              </div>

              <div className="editor-popup-divider" />

              {/* STATES */}

              <div className="editor-popup-section-title">States</div>

              <div className="editor-chemistry-grid">
                {CHEMISTRY_STATES.map((state) => (
                  <button
                    type="button"
                    key={state}
                    className="editor-chemistry-symbol"
                    title={`Insert ${state}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertChemistryText(state)}
                  >
                    {state}
                  </button>
                ))}
              </div>

              <div className="editor-popup-divider" />

              {/* QUANTITIES */}

              <div className="editor-popup-section-title">
                Chemistry quantities
              </div>

              <div className="editor-chemistry-grid">
                {CHEMISTRY_QUANTITIES.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="editor-chemistry-formula"
                    title={`Insert ${item}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertChemistryText(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="editor-popup-divider" />

              {/* QUICK ACTIONS */}

              <div className="editor-popup-section-title">Formatting</div>

              <PopupButton
                onClick={() => {
                  insertSubscript();
                  closePopup();
                }}
              >
                <SubscriptIcon size={15} />
                Subscript
              </PopupButton>

              <PopupButton
                onClick={() => {
                  insertSuperscript();
                  closePopup();
                }}
              >
                <SuperscriptIcon size={15} />
                Superscript
              </PopupButton>
            </Popup>
          )}
        </div>
      </ToolbarGroup>

      {/* ==================================================
          MORE
      ================================================== */}

      <ToolbarGroup>
        <div className="editor-popup-wrapper">
          <button
            type="button"
            className="editor-toolbar-select editor-toolbar-more"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => togglePopup("more")}
          >
            More
            <ChevronDown size={14} />
          </button>

          {openPopup === "more" && (
            <Popup align="right">
              <PopupButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                Blockquote
              </PopupButton>

              <PopupButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Minus size={15} />
                Horizontal rule
              </PopupButton>

              <PopupButton
                onClick={() => editor.chain().focus().setHardBreak().run()}
              >
                Line break
              </PopupButton>

              <div className="editor-popup-divider" />

              <PopupButton
                onClick={() => {
                  editor.chain().focus().unsetAllMarks().run();

                  closePopup();
                }}
              >
                <Eraser size={15} />
                Clear formatting
              </PopupButton>

              <PopupButton onClick={clearFormatting}>
                <RemoveFormatting size={15} />
                Reset block
              </PopupButton>
            </Popup>
          )}
        </div>
      </ToolbarGroup>
    </div>
  );
}
