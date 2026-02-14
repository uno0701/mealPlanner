import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  if (query.length < 2) {
    return NextResponse.json([])
  }

  const ingredients = await prisma.ingredient.findMany({
    where: { name: { contains: query.toLowerCase(), mode: "insensitive" } },
    take: 10,
    orderBy: { name: "asc" },
  })

  return NextResponse.json(ingredients)
}
