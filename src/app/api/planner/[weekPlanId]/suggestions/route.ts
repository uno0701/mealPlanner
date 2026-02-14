import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const suggestionSchema = z.object({
  day: z.number().int().min(0).max(6),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  recipeId: z.string().min(1),
  note: z.string().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ weekPlanId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { weekPlanId } = await params

  const suggestions = await prisma.mealSuggestion.findMany({
    where: { weekPlanId },
    include: {
      recipe: { select: { id: true, title: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(suggestions)
}

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
    include: { memberships: true },
  })

  if (!weekPlan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const isMember = weekPlan.memberships.some(
    (m) => m.userId === session.user.id && m.status === "accepted"
  )

  if (!isMember && weekPlan.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const data = suggestionSchema.parse(body)

    const suggestion = await prisma.mealSuggestion.create({
      data: {
        day: data.day,
        mealType: data.mealType,
        recipeId: data.recipeId,
        note: data.note,
        suggestedBy: session.user.id,
        weekPlanId,
      },
      include: {
        recipe: { select: { id: true, title: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(suggestion, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ weekPlanId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { weekPlanId } = await params
  const { suggestionId, status } = await request.json()

  if (!["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const weekPlan = await prisma.weekPlan.findUnique({
    where: { id: weekPlanId, ownerId: session.user.id },
  })

  if (!weekPlan) {
    return NextResponse.json({ error: "Only owner can accept/reject" }, { status: 403 })
  }

  const suggestion = await prisma.mealSuggestion.update({
    where: { id: suggestionId },
    data: { status },
  })

  if (status === "accepted") {
    await prisma.mealSlot.create({
      data: {
        day: suggestion.day,
        mealType: suggestion.mealType,
        recipeId: suggestion.recipeId,
        weekPlanId,
      },
    })
  }

  return NextResponse.json(suggestion)
}
