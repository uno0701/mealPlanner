"use client"

import { useState, useEffect } from "react"
import type { Editor } from "@tiptap/react"
import IconPicker from "./IconPicker"
import type { CookingIcon } from "@/lib/icons"
import { getEditorSettings, saveEditorSettings } from "@/lib/editor-settings"

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
  const [collapsed, setCollapsed] = useState(false)
  const [fontFamily, setFontFamily] = useState("")
  const [fontSize, setFontSize] = useState("")

  // Load persisted settings on mount
  useEffect(() => {
    const settings = getEditorSettings()
    setCollapsed(settings.toolbarCollapsed)
    setFontFamily(settings.fontFamily)
    setFontSize(settings.fontSize)
  }, [])

  if (!editor) return null

  function toggleCollapsed() {
    const next = !collapsed
    setCollapsed(next)
    saveEditorSettings({ toolbarCollapsed: next })
  }

  function handleFontFamilyChange(value: string) {
    setFontFamily(value)
    saveEditorSettings({ fontFamily: value })
    if (value) {
      editor!.chain().focus().setFontFamily(value).run()
    } else {
      editor!.chain().focus().unsetFontFamily().run()
    }
  }

  function handleFontSizeChange(value: string) {
    setFontSize(value)
    saveEditorSettings({ fontSize: value })
    if (value) {
      editor!.chain().focus().setFontSize(value).run()
    } else {
      editor!.chain().focus().unsetFontSize().run()
    }
  }

  if (collapsed) {
    return (
      <div className="flex items-center border-b border-gray-100 bg-gray-50/50 px-3 py-1 rounded-t-md">
        <button
          type="button"
          onClick={toggleCollapsed}
          className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          title="Expand toolbar"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50/50 px-3 py-2 rounded-t-md">
      {/* Collapse toggle */}
      <button
        type="button"
        onClick={toggleCollapsed}
        className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 mr-1"
        title="Collapse toolbar"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>

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

      {/* Checklist */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`rounded px-2 py-1 text-sm ${
          editor.isActive("taskList") ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-200"
        }`}
        title="Checklist"
      >
        <svg className="h-4 w-4 inline-block" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm5 0a1 1 0 011-1h7a1 1 0 110 2H9a1 1 0 01-1-1zm-5 5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V9zm5 0a1 1 0 011-1h7a1 1 0 110 2H9a1 1 0 01-1-1zm-5 5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1zm5 0a1 1 0 011-1h7a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Font Family */}
      <select
        value={fontFamily}
        onChange={(e) => handleFontFamilyChange(e.target.value)}
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
        value={fontSize}
        onChange={(e) => handleFontSizeChange(e.target.value)}
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
