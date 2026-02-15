"use client"

import { useState } from "react"
import type { Editor } from "@tiptap/react"
import IconPicker from "./IconPicker"
import type { CookingIcon } from "@/lib/icons"

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "ui-monospace, monospace" },
  { label: "Sans", value: "Inter, system-ui, sans-serif" },
  { label: "Cursive", value: "cursive" },
]

const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28", "32"]

const HASHTAG_COMMANDS = ["#Description", "#Servings", "#PrepTime", "#CookTime", "#Ingredients"]

interface Props {
  editor: Editor | null
  onInsertTag: (icon: CookingIcon) => void
  onInsertHashtag: (command: string) => void
}

export default function EditorToolbar({ editor, onInsertTag, onInsertHashtag }: Props) {
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showHashtags, setShowHashtags] = useState(false)

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2 rounded-t-md">
      {/* Bold, Italic, Underline */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`rounded px-2 py-1 text-sm font-bold ${
          editor.isActive("bold") ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`rounded px-2 py-1 text-sm italic ${
          editor.isActive("italic") ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`rounded px-2 py-1 text-sm underline ${
          editor.isActive("underline") ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        U
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded px-2 py-1 text-sm ${
          editor.isActive("bulletList") ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        &bull; List
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Font Family */}
      <select
        value=""
        onChange={(e) => {
          if (e.target.value) {
            editor.chain().focus().setFontFamily(e.target.value).run()
          } else {
            editor.chain().focus().unsetFontFamily().run()
          }
        }}
        className="rounded border border-gray-300 px-1 py-1 text-xs text-gray-600"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      {/* Font Size */}
      <select
        value=""
        onChange={(e) => {
          if (e.target.value) {
            editor.chain().focus().setFontSize(e.target.value).run()
          } else {
            editor.chain().focus().unsetFontSize().run()
          }
        }}
        className="rounded border border-gray-300 px-1 py-1 text-xs text-gray-600"
      >
        <option value="">Size</option>
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>
            {s}px
          </option>
        ))}
      </select>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Icon Tag Picker */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowIconPicker(!showIconPicker)}
          className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-200"
          title="Insert icon tag"
        >
          🏷️ Tag
        </button>
        {showIconPicker && (
          <IconPicker
            onSelect={onInsertTag}
            onClose={() => setShowIconPicker(false)}
          />
        )}
      </div>

      {/* Hashtag Commands */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowHashtags(!showHashtags)}
          className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-200"
          title="Insert section"
        >
          # Section
        </button>
        {showHashtags && (
          <div className="absolute z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
            {HASHTAG_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  onInsertHashtag(cmd)
                  setShowHashtags(false)
                }}
                className="block w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-indigo-50"
              >
                {cmd}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
