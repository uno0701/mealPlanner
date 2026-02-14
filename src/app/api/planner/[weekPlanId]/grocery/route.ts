import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseIngredient } from "@/lib/ingredients/parser"
import { aggregateIngredients } from "@/lib/ingredients/aggregator"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ weekPlanId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { weekPlanId } = await params

  const weekPlan = await prisma.weekPlan.findUnique({
    where: { id: weekPlanId },
    include: {
      mealSlots: {
        include: {
          recipe: {
            include: {
              ingredients: { include: { ingredient: true } },
            },
          },
        },
      },
      memberships: true,
    },
  })

  if (!weekPlan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const isOwner = weekPlan.ownerId === session.user.id
  const isMember = weekPlan.memberships.some(
    (m) => m.userId === session.user.id && m.status === "accepted"
  )

  if (!isOwner && !isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const allIngredients = weekPlan.mealSlots.flatMap((slot) =>
    slot.recipe.ingredients.map((ri) =>
      parseIngredient(ri.ingredient.name, ri.quantity, ri.unit)
    )
  )

  const aggregated = aggregateIngredients(allIngredients)

  const groceryList = await prisma.groceryList.upsert({
    where: { weekPlanId },
    update: {
      items: {
        deleteMany: { isManual: false },
        create: aggregated.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
        })),
      },
    },
    create: {
      weekPlanId,
      items: {
        create: aggregated.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
        })),
      },
    },
    include: { items: { orderBy: { name: "asc" } } },
  })

  return NextResponse.json(groceryList)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ weekPlanId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { weekPlanId } = await params

  const groceryList = await prisma.groceryList.findUnique({
    where: { weekPlanId },
    include: { items: { orderBy: { name: "asc" } } },
  })

  if (!groceryList) {
    return NextResponse.json({ items: [] })
  }

  return NextResponse.json(groceryList)
}
