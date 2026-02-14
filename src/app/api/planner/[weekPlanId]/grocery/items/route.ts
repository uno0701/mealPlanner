import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const addItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
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

  let groceryList = await prisma.groceryList.findUnique({
    where: { weekPlanId },
  })

  if (!groceryList) {
    groceryList = await prisma.groceryList.create({
      data: { weekPlanId },
    })
  }

  try {
    const body = await request.json()
    const data = addItemSchema.parse(body)

    const item = await prisma.groceryListItem.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        isManual: true,
        groceryListId: groceryList.id,
      },
    })

    return NextResponse.json(item, { status: 201 })
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

  await params

  const { itemId, checked } = await request.json()

  if (!itemId || typeof checked !== "boolean") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const item = await prisma.groceryListItem.update({
    where: { id: itemId },
    data: { checked },
  })

  return NextResponse.json(item)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ weekPlanId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await params

  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get("itemId")

  if (!itemId) {
    return NextResponse.json({ error: "itemId required" }, { status: 400 })
  }

  await prisma.groceryListItem.delete({ where: { id: itemId } })
  return NextResponse.json({ success: true })
}
