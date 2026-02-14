import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["member", "editor"]).default("member"),
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

  const members = await prisma.planMembership.findMany({
    where: { weekPlanId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(members)
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
    where: { id: weekPlanId, ownerId: session.user.id },
  })

  if (!weekPlan) {
    return NextResponse.json({ error: "Not found or not owner" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const data = inviteSchema.parse(body)

    const existing = await prisma.planMembership.findUnique({
      where: { weekPlanId_email: { weekPlanId, email: data.email } },
    })

    if (existing) {
      return NextResponse.json({ error: "Already invited" }, { status: 400 })
    }

    const invitedUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    const membership = await prisma.planMembership.create({
      data: {
        email: data.email,
        role: data.role,
        weekPlanId,
        userId: invitedUser?.id,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    return NextResponse.json(membership, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
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
  const membershipId = searchParams.get("id")

  if (!membershipId) {
    return NextResponse.json({ error: "id required" }, { status: 400 })
  }

  const weekPlan = await prisma.weekPlan.findUnique({
    where: { id: weekPlanId, ownerId: session.user.id },
  })

  if (!weekPlan) {
    return NextResponse.json({ error: "Not found or not owner" }, { status: 404 })
  }

  await prisma.planMembership.delete({ where: { id: membershipId } })
  return NextResponse.json({ success: true })
}
