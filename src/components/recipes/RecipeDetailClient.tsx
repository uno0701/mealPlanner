"use client"

import { useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { useAutoSave } from "@/hooks/useAutoSave"
import SaveStatusIndicator from "@/components/editor/SaveStatusIndicator"

const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-64 rounded-md bg-white shadow-sm animate-pulse" />,
})

interface Props {
  content: string
  recipeId: string
}

export default function RecipeDetailClient({ content, recipeId }: Props) {
  const saveFn = useCallback(
    async (html: string) => {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions: html }),
      })
      if (!res.ok) throw new Error("Save failed")
    },
    [recipeId],
  )

  const { status, trigger, setBaseline } = useAutoSave({ saveFn })

  useEffect(() => {
    setBaseline(content)
  }, [content, setBaseline])

  return (
    <div className="relative">
      <div className="absolute top-2 right-3 z-10">
        <SaveStatusIndicator status={status} />
      </div>
      <RichTextEditor
        content={content}
        onChange={trigger}
        placeholder="Start writing your recipe..."
      />
    </div>
  )
}
