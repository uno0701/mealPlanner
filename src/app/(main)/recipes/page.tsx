"use client"

import { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import RecipeGrid from "@/components/recipes/RecipeGrid"

const TagSettings = dynamic(() => import("@/components/editor/TagSettings"), {
  ssr: false,
})

export default function RecipesPage() {
  const [showTagSettings, setShowTagSettings] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Recipes</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTagSettings(true)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Tag Settings
          </button>
          <Link
            href="/recipes/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            New Recipe
          </Link>
        </div>
      </div>
      <RecipeGrid />
      {showTagSettings && <TagSettings onClose={() => setShowTagSettings(false)} />}
    </div>
  )
}
