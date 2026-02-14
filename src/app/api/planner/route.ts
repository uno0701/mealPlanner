import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getWeekStart } from "@/lib/utils"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const weekParam = searchParams.get("week")
  const weekStart = weekParam ? new Date(weekParam) : getWeekStart()

  let weekPlan = await prisma.weekPlan.findUnique({
    where: {
      ownerId_weekStart: {
        ownerId: session.user.id,
        weekStart,
      },
    },
    include: {
      mealSlots: {
        include: { recipe: true },
      },
    },
  })

  if (!weekPlan) {
    weekPlan = await prisma.weekPlan.create({
      data: {
        weekStart,
        ownerId: session.user.id,
      },
      include: {
        mealSlots: {
          include: { recipe: true },
        },
      },
    })
  }

  return NextResponse.json(weekPlan)
}
