"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { TextStyle, FontFamily, Color } from "@tiptap/extension-text-style"
import Placeholder from "@tiptap/extension-placeholder"
import { FontSize } from "./FontSizeExtension"
import EditorToolbar from "./EditorToolbar"
import type { CookingIcon } from "@/lib/icons"
import { getTagSettings } from "@/lib/tag-settings"

interface Props {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: Props) {
  const tagSettings = getTagSettings()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Placeholder.configure({ placeholder: placeholder || "Start writing your recipe..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none",
      },
    },
  })

  function handleInsertTag(icon: CookingIcon) {
    if (!editor) return
    const tagHtml = `<span data-icon-tag="${icon.id}" contenteditable="false" style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;margin:0 2px;border-radius:4px;font-size:13px;color:${tagSettings.tagColor};background:${tagSettings.tagBgColor};margin-left:24px;"><svg viewBox="0 0 24 24" width="16" height="16" style="fill:currentColor;flex-shrink:0">${icon.svg}</svg>${icon.label}</span>&nbsp;`
    editor.chain().focus().insertContent(tagHtml).run()
  }

  function handleInsertHashtag(command: string) {
    if (!editor) return
    const label = command.replace("#", "")
    const sectionHtml = `<h3 style="color:#4f46e5;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-top:16px;">${label}</h3><p></p>`
    editor.chain().focus().insertContent(sectionHtml).run()
  }

  return (
    <div className="rounded-md border border-gray-300 overflow-hidden">
      <EditorToolbar
        editor={editor}
        onInsertTag={handleInsertTag}
        onInsertHashtag={handleInsertHashtag}
      />
      <EditorContent editor={editor} />
    </div>
  )
}
