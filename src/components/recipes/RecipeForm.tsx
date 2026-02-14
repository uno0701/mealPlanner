"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import IngredientInput from "./IngredientInput"
import type { IngredientInput as IngredientType } from "@/lib/validators/recipe"

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
  const [description, setDescription] = useState(initialData?.description || "")
  const [instructions, setInstructions] = useState(initialData?.instructions || "")
  const [servings, setServings] = useState(initialData?.servings || 4)
  const [prepTime, setPrepTime] = useState(initialData?.prepTime || 0)
  const [cookTime, setCookTime] = useState(initialData?.cookTime || 0)
  const [ingredients, setIngredients] = useState<IngredientType[]>(
    initialData?.ingredients || [{ name: "", quantity: 1, unit: "whole" }]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const body = {
      title,
      description: description || undefined,
      instructions: instructions || undefined,
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={6}
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
