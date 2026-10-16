"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
      }),

      Underline,

      TextStyle,
      Color,

      Highlight.configure({
        multicolor: true,
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Table.configure({
        resizable: true,
      }),

      TableRow,
      TableHeader,
      TableCell,
    ],

    content: value || "",

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // API se description load hone ke baad editor mein set karega
  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();

    if (value !== currentContent) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const buttonClass = (active = false) =>
    `h-9 min-w-9 rounded px-2 text-sm transition ${
      active
        ? "bg-gray-200 text-gray-900"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">

      {/* ================= TOOLBAR ================= */}
      <div className="flex flex-wrap items-center gap-1 border-b bg-white px-3 py-2">

        {/* Undo */}
        <button
          type="button"
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={buttonClass()}
        >
          ↶
        </button>

        {/* Redo */}
        <button
          type="button"
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={buttonClass()}
        >
          ↷
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* Zoom display */}
        <button
          type="button"
          className={buttonClass()}
          title="Zoom"
        >
          −
        </button>

        <span className="px-1 text-sm text-gray-600">
          100%
        </span>

        <button
          type="button"
          className={buttonClass()}
          title="Zoom"
        >
          +
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* Heading */}
        <select
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
              ? "h3"
              : "paragraph"
          }
          onChange={(e) => {
            const value = e.target.value;

            if (value === "paragraph") {
              editor.chain().focus().setParagraph().run();
            }

            if (value === "h1") {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }

            if (value === "h2") {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }

            if (value === "h3") {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }
          }}
          className="h-9 rounded px-2 text-sm text-gray-600 outline-none hover:bg-gray-100"
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        {/* Bullet List */}
        <button
          type="button"
          title="Bullet List"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className={buttonClass(editor.isActive("bulletList"))}
        >
          ☷
        </button>

        {/* Ordered List */}
        <button
          type="button"
          title="Numbered List"
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className={buttonClass(editor.isActive("orderedList"))}
        >
          ☷
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* Bold */}
        <button
          type="button"
          title="Bold"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className={buttonClass(editor.isActive("bold"))}
        >
          <b>B</b>
        </button>

        {/* Italic */}
        <button
          type="button"
          title="Italic"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={buttonClass(editor.isActive("italic"))}
        >
          <i>I</i>
        </button>

        {/* Strike */}
        <button
          type="button"
          title="Strike"
          onClick={() =>
            editor.chain().focus().toggleStrike().run()
          }
          className={buttonClass(editor.isActive("strike"))}
        >
          <s>S</s>
        </button>

        {/* Underline */}
        <button
          type="button"
          title="Underline"
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
          className={buttonClass(editor.isActive("underline"))}
        >
          <u>U</u>
        </button>

        {/* Highlight */}
        <button
          type="button"
          title="Highlight"
          onClick={() =>
            editor.chain().focus().toggleHighlight().run()
          }
          className={buttonClass(editor.isActive("highlight"))}
        >
          🖍
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* Align Left */}
        <button
          type="button"
          title="Align Left"
          onClick={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
          className={buttonClass(
            editor.isActive({ textAlign: "left" })
          )}
        >
          ≡
        </button>

        {/* Align Center */}
        <button
          type="button"
          title="Align Center"
          onClick={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          className={buttonClass(
            editor.isActive({ textAlign: "center" })
          )}
        >
          ≡
        </button>

        {/* Align Right */}
        <button
          type="button"
          title="Align Right"
          onClick={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
          className={buttonClass(
            editor.isActive({ textAlign: "right" })
          )}
        >
          ≡
        </button>

        {/* Justify */}
        <button
          type="button"
          title="Justify"
          onClick={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
          className={buttonClass(
            editor.isActive({ textAlign: "justify" })
          )}
        >
          ≡
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* Table */}
        <button
          type="button"
          title="Insert Table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
              .run()
          }
          className={buttonClass()}
        >
          ▦
        </button>

      </div>

      {/* ================= EDITOR ================= */}

      <div className="min-h-[300px] px-4 py-3">

        <EditorContent
          editor={editor}
          className="
            min-h-[280px]

            [&_.ProseMirror]:min-h-[280px]
            [&_.ProseMirror]:outline-none
            [&_.ProseMirror]:border-none
            [&_.ProseMirror]:shadow-none

            [&_.ProseMirror_p]:mb-3

            [&_.ProseMirror_h1]:mb-4
            [&_.ProseMirror_h1]:text-3xl
            [&_.ProseMirror_h1]:font-bold

            [&_.ProseMirror_h2]:mb-3
            [&_.ProseMirror_h2]:text-2xl
            [&_.ProseMirror_h2]:font-bold

            [&_.ProseMirror_h3]:mb-2
            [&_.ProseMirror_h3]:text-xl
            [&_.ProseMirror_h3]:font-semibold

            [&_.ProseMirror_ul]:mb-3
            [&_.ProseMirror_ul]:list-disc
            [&_.ProseMirror_ul]:pl-6

            [&_.ProseMirror_ol]:mb-3
            [&_.ProseMirror_ol]:list-decimal
            [&_.ProseMirror_ol]:pl-6

            [&_.ProseMirror_blockquote]:my-3
            [&_.ProseMirror_blockquote]:border-l-4
            [&_.ProseMirror_blockquote]:border-gray-300
            [&_.ProseMirror_blockquote]:pl-4
            [&_.ProseMirror_blockquote]:italic

            [&_.ProseMirror_table]:my-4
            [&_.ProseMirror_table]:w-full
            [&_.ProseMirror_table]:border-collapse

            [&_.ProseMirror_th]:border
            [&_.ProseMirror_th]:border-gray-300
            [&_.ProseMirror_th]:bg-gray-100
            [&_.ProseMirror_th]:p-2

            [&_.ProseMirror_td]:border
            [&_.ProseMirror_td]:border-gray-300
            [&_.ProseMirror_td]:p-2
          "
        />

      </div>

    </div>
  );
}