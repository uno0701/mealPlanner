import Link from "next/link"
import RecipeGrid from "@/components/recipes/RecipeGrid"

export default function RecipesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Recipes</h1>
        <Link
          href="/recipes/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          New Recipe
        </Link>
      </div>
      <RecipeGrid />
    </div>
  )
}
