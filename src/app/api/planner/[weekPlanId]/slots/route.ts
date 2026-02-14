import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const slotSchema = z.object({
  day: z.number().int().min(0).max(6),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  recipeId: z.string().min(1),
})

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
    where: { id: weekPlanId, ownerId: session.user.id },
  })

  if (!weekPlan) {
    return NextResponse.json({ error: "Week plan not found" }, { status: 404 })
  }

  if (weekPlan.status === "finalized") {
    return NextResponse.json({ error: "Cannot modify a finalized plan" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const data = slotSchema.parse(body)

    const slot = await prisma.mealSlot.create({
      data: {
        day: data.day,
        mealType: data.mealType,
        recipeId: data.recipeId,
        weekPlanId,
      },
      include: { recipe: true },
    })

    return NextResponse.json(slot, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ weekPlanId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { weekPlanId } = await params
  const { searchParams } = new URL(request.url)
  const slotId = searchParams.get("slotId")

  if (!slotId) {
    return NextResponse.json({ error: "slotId is required" }, { status: 400 })
  }

  const weekPlan = await prisma.weekPlan.findUnique({
    where: { id: weekPlanId, ownerId: session.user.id },
  })

  if (!weekPlan || weekPlan.status === "finalized") {
    return NextResponse.json({ error: "Cannot modify" }, { status: 400 })
  }

  await prisma.mealSlot.delete({ where: { id: slotId } })
  return NextResponse.json({ success: true })
}
