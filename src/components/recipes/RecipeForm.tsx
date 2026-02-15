"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import IngredientInput from "./IngredientInput"
import type { IngredientInput as IngredientType } from "@/lib/validators/recipe"

const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-64 rounded-md border border-gray-300 bg-gray-50 animate-pulse" />,
})

interface Props {
  initialData?: {
    title: string
    description?: string
    instructions?: string
    servings: number
    prepTime?: number
    cookTime?: number
    ingredients: IngredientType[]
  }
  recipeId?: string
}

export default function RecipeForm({ initialData, recipeId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.instructions || "")
  const [servings, setServings] = useState(initialData?.servings || 4)
  const [prepTime, setPrepTime] = useState(initialData?.prepTime || 0)
  const [cookTime, setCookTime] = useState(initialData?.cookTime || 0)
  const [ingredients, setIngredients] = useState<IngredientType[]>(
    initialData?.ingredients || [{ name: "", quantity: 1, unit: "whole" }]
  )

  function stripHtml(html: string): string {
    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent || div.innerText || ""
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const plainText = stripHtml(content)
    const description = plainText.slice(0, 200) || undefined

    const body = {
      title,
      description,
      instructions: content || undefined,
      servings,
      prepTime: prepTime || undefined,
      cookTime: cookTime || undefined,
      ingredients: ingredients.filter((i) => i.name.trim()),
    }

    const url = recipeId ? `/api/recipes/${recipeId}` : "/api/recipes"
    const method = recipeId ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    const recipe = await res.json()
    router.push(`/recipes/${recipe.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Servings</label>
          <input
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(parseInt(e.target.value) || 1)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prep Time (min)</label>
          <input
            type="number"
            min="0"
            value={prepTime}
            onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cook Time (min)</label>
          <input
            type="number"
            min="0"
            value={cookTime}
            onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <IngredientInput ingredients={ingredients} onChange={setIngredients} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preparation Notes
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Use the toolbar for formatting. Insert icon tags and #sections for Description, Servings, PrepTime, CookTime, or Ingredients.
        </p>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Write your recipe preparation notes here... Use # for sections and icon tags for visual markers."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : recipeId ? "Update Recipe" : "Create Recipe"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
