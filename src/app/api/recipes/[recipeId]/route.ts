import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { recipeSchema } from "@/lib/validators/recipe"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { recipeId } = await params

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId, userId: session.user.id },
    include: { ingredients: { include: { ingredient: true } } },
  })

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
  }

  return NextResponse.json(recipe)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { recipeId } = await params

  const existing = await prisma.recipe.findUnique({
    where: { id: recipeId, userId: session.user.id },
  })

  if (!existing) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const data = recipeSchema.parse(body)

    await prisma.recipeIngredient.deleteMany({ where: { recipeId } })

    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        servings: data.servings,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        ingredients: {
          create: await Promise.all(
            data.ingredients.map(async (ing) => {
              const ingredient = await prisma.ingredient.upsert({
                where: { name: ing.name.toLowerCase().trim() },
                update: {},
                create: { name: ing.name.toLowerCase().trim() },
              })
              return {
                quantity: ing.quantity,
                unit: ing.unit,
                notes: ing.notes,
                ingredientId: ingredient.id,
              }
            })
          ),
        },
      },
      include: { ingredients: { include: { ingredient: true } } },
    })

    return NextResponse.json(recipe)
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { recipeId } = await params

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId, userId: session.user.id },
  })

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
  }

  await prisma.recipe.delete({ where: { id: recipeId } })
  return NextResponse.json({ success: true })
}
