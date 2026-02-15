"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const RichTextViewer = dynamic(() => import("@/components/editor/RichTextViewer"), {
  ssr: false,
})
const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-64 rounded-md border border-gray-300 bg-gray-50 animate-pulse" />,
})

interface Props {
  content: string
  recipeId: string
}

export default function RecipeDetailClient({ content, recipeId }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/recipes/${recipeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instructions: editContent }),
    })
    if (res.ok) {
      setEditing(false)
      router.refresh()
    }
    setSaving(false)
  }

  if (editing) {
    return (
      <div>
        <RichTextEditor content={editContent} onChange={setEditContent} />
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setEditContent(content)
              setEditing(false)
            }}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return <RichTextViewer content={content} onClick={() => setEditing(true)} />
}
