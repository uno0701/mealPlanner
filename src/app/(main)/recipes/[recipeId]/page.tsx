import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import RecipeDetailClient from "@/components/recipes/RecipeDetailClient"

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ recipeId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) notFound()

  const { recipeId } = await params

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId, userId: session.user.id },
    include: { ingredients: { include: { ingredient: true } } },
  })

  if (!recipe) notFound()

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
        <div className="flex gap-2">
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Edit
          </Link>
          <Link
            href="/recipes"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="flex gap-6 text-sm text-gray-500 mb-6">
        <span>{recipe.servings} servings</span>
        {recipe.prepTime && <span>Prep: {recipe.prepTime} min</span>}
        {recipe.cookTime && <span>Cook: {recipe.cookTime} min</span>}
      </div>

      <h2 className="text-lg font-semibold mb-3">Ingredients</h2>
      <ul className="mb-6 space-y-1">
        {recipe.ingredients.map((ri) => (
          <li key={ri.id} className="text-sm text-gray-700">
            {ri.quantity} {ri.unit} {ri.ingredient.name}
            {ri.notes && <span className="text-gray-400"> ({ri.notes})</span>}
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold mb-3">Preparation</h2>
      <RecipeDetailClient
        content={recipe.instructions || ""}
        recipeId={recipe.id}
      />
    </div>
  )
}
