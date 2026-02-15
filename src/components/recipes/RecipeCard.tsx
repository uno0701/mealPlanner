import Link from "next/link"

interface Props {
  recipe: {
    id: string
    title: string
    description?: string | null
    prepTime?: number | null
    cookTime?: number | null
    servings: number
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

export default function RecipeCard({ recipe }: Props) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
  const preview = recipe.description ? stripHtml(recipe.description) : ""

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{recipe.title}</h3>
      {preview && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{preview}</p>
      )}
      <div className="flex gap-4 text-xs text-gray-400">
        {totalTime > 0 && <span>{totalTime} min</span>}
        <span>{recipe.servings} servings</span>
      </div>
    </Link>
  )
}
