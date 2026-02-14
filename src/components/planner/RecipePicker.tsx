"use client"

import { useState, useEffect } from "react"

interface Recipe {
  id: string
  title: string
}

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (recipeId: string) => void
}

export default function RecipePicker({ open, onClose, onSelect }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(async () => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      const res = await fetch(`/api/recipes?${params}`)
      if (res.ok) {
        const data = await res.json()
        setRecipes(data.recipes)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [open, search])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pick a Recipe</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">X</button>
        </div>
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          autoFocus
        />
        <div className="max-h-64 overflow-y-auto space-y-1">
          {recipes.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No recipes found</p>
          ) : (
            recipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => {
                  onSelect(recipe.id)
                  onClose()
                }}
                className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-blue-50"
              >
                {recipe.title}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
