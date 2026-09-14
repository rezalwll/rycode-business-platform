"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

import type { Locale } from "@/i18n/routing";

type EditorDocument = {
  type: "doc";
  content?: Array<Record<string, unknown>>;
};

function paragraphsFromText(value: string): EditorDocument {
  const paragraphs = value
    .split(/\n{2,}/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      type: "paragraph",
      content: [{ type: "text", text: paragraph }],
    }));
  return { type: "doc", content: paragraphs };
}

function initialDocument(value: unknown, fallbackText: string): EditorDocument {
  if (typeof value === "object" && value !== null && "type" in value && value.type === "doc") {
    const content = "content" in value && Array.isArray(value.content) ? value.content : undefined;
    return { type: "doc", ...(content ? { content } : {}) };
  }
  return paragraphsFromText(fallbackText);
}

const buttonClass =
  "rounded-[4px] border border-border bg-background px-3 py-2 text-xs font-semibold aria-pressed:border-brand aria-pressed:bg-brand/10 disabled:opacity-40";

export function AdminRichText({
  locale,
  title,
  documentName = "body",
  textName = "bodyText",
  defaultDocument,
  defaultText = "",
}: {
  locale: Locale;
  title: string;
  documentName?: string;
  textName?: string;
  defaultDocument?: unknown;
  defaultText?: string | null;
}) {
  const initial = initialDocument(defaultDocument, defaultText ?? "");
  const [documentValue, setDocumentValue] = useState(() => JSON.stringify(initial));
  const [plainText, setPlainText] = useState(defaultText ?? "");
  const editor = useEditor({
    extensions: [StarterKit],
    content: initial,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      setDocumentValue(JSON.stringify(currentEditor.getJSON()));
      setPlainText(currentEditor.getText({ blockSeparator: "\n\n" }).trim());
    },
  });
  const fa = locale === "fa";

  return (
    <div className="sm:col-span-2">
      <span className="block text-xs font-semibold">{title}</span>
      <input type="hidden" name={documentName} value={documentValue} />
      <input type="hidden" name={textName} value={plainText} />
      <div className="mt-2 overflow-hidden rounded-[5px] border border-input bg-background focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        <div
          className="flex flex-wrap gap-2 border-b border-border bg-surface-2 p-2"
          role="toolbar"
          aria-label={fa ? "ابزار ویرایش متن" : "Rich text controls"}
        >
          <button
            type="button"
            className={buttonClass}
            aria-pressed={editor?.isActive("bold") ?? false}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            {fa ? "پررنگ" : "Bold"}
          </button>
          <button
            type="button"
            className={buttonClass}
            aria-pressed={editor?.isActive("heading", { level: 2 }) ?? false}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            {fa ? "تیتر ۲" : "Heading 2"}
          </button>
          <button
            type="button"
            className={buttonClass}
            aria-pressed={editor?.isActive("heading", { level: 3 }) ?? false}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            {fa ? "تیتر ۳" : "Heading 3"}
          </button>
          <button
            type="button"
            className={buttonClass}
            aria-pressed={editor?.isActive("bulletList") ?? false}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            {fa ? "فهرست" : "List"}
          </button>
          <button
            type="button"
            className={buttonClass}
            disabled={!editor?.can().chain().focus().undo().run()}
            onClick={() => editor?.chain().focus().undo().run()}
          >
            {fa ? "بازگشت" : "Undo"}
          </button>
          <button
            type="button"
            className={buttonClass}
            disabled={!editor?.can().chain().focus().redo().run()}
            onClick={() => editor?.chain().focus().redo().run()}
          >
            {fa ? "دوباره" : "Redo"}
          </button>
        </div>
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror]:min-h-56 [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-4 [&_.ProseMirror]:text-sm [&_.ProseMirror]:leading-8 [&_.ProseMirror]:outline-none [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_li]:ms-5 [&_.ProseMirror_ul]:list-disc"
        />
      </div>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        {fa
          ? "محتوا به‌صورت JSON ساختاریافته و یک نسخهٔ متن ساده برای جست‌وجو ذخیره می‌شود."
          : "Content is stored as portable structured JSON plus plain text for search."}
      </p>
    </div>
  );
}
