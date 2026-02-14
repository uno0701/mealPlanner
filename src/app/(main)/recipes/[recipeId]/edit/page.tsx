import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import RecipeForm from "@/components/recipes/RecipeForm"

export default async function EditRecipePage({
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

  const initialData = {
    title: recipe.title,
    description: recipe.description || undefined,
    instructions: recipe.instructions || undefined,
    servings: recipe.servings,
    prepTime: recipe.prepTime || undefined,
    cookTime: recipe.cookTime || undefined,
    ingredients: recipe.ingredients.map((ri) => ({
      name: ri.ingredient.name,
      quantity: ri.quantity,
      unit: ri.unit,
      notes: ri.notes || undefined,
    })),
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Recipe</h1>
      <RecipeForm initialData={initialData} recipeId={recipe.id} />
    </div>
  )
}
