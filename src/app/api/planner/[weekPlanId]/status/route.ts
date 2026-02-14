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
  const { status } = await request.json()

  if (!["draft", "finalized"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const weekPlan = await prisma.weekPlan.findUnique({
    where: { id: weekPlanId, ownerId: session.user.id },
  })

  if (!weekPlan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.weekPlan.update({
    where: { id: weekPlanId },
    data: { status },
  })

  return NextResponse.json(updated)
}
