import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ weekPlanId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { weekPlanId } = await params
  const { shared } = await request.json()

  const weekPlan = await prisma.weekPlan.findUnique({
    where: { id: weekPlanId, ownerId: session.user.id },
  })

  if (!weekPlan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const groceryList = await prisma.groceryList.upsert({
    where: { weekPlanId },
    update: { shared: !!shared },
    create: { weekPlanId, shared: !!shared },
  })

  return NextResponse.json(groceryList)
}
