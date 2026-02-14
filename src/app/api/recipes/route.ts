import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { recipeSchema } from "@/lib/validators/recipe"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 12

  const where = {
    userId: session.user.id,
    ...(search && {
      title: { contains: search, mode: "insensitive" as const },
    }),
  }

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: { ingredients: { include: { ingredient: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.recipe.count({ where }),
  ])

  return NextResponse.json({ recipes, total, pages: Math.ceil(total / limit) })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = recipeSchema.parse(body)

    const recipe = await prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        servings: data.servings,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        userId: session.user.id,
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

    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
