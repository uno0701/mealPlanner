import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const invitations = await prisma.planMembership.findMany({
    where: {
      email: session.user.email,
      status: "pending",
    },
    include: {
      weekPlan: {
        include: {
          owner: { select: { name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(invitations)
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { membershipId, action } = await request.json()

  if (!["accept", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  const membership = await prisma.planMembership.findUnique({
    where: { id: membershipId },
  })

  if (!membership || membership.email !== session.user.email) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.planMembership.update({
    where: { id: membershipId },
    data: {
      status: action === "accept" ? "accepted" : "rejected",
      userId: action === "accept" ? session.user.id : membership.userId,
    },
  })

  return NextResponse.json(updated)
}
