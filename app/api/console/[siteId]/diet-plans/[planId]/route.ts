import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function getSite(siteId: string, userId: string) {
  return db.site.findFirst({ where: { OR: [{ id: siteId }, { slug: siteId }], userId, deleted: false } })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ siteId: string; planId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { siteId, planId } = await params
  const site = await getSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const body = await req.json()
  await db.gymDietPlan.updateMany({
    where: { id: planId, siteId: site.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.goal !== undefined && { goal: body.goal }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.totalCalories !== undefined && { totalCalories: body.totalCalories }),
      ...(body.protein !== undefined && { protein: body.protein }),
      ...(body.carbs !== undefined && { carbs: body.carbs }),
      ...(body.fat !== undefined && { fat: body.fat }),
      ...(body.meals !== undefined && { meals: body.meals }),
    },
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ siteId: string; planId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { siteId, planId } = await params
  const site = await getSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await db.gymDietPlan.deleteMany({ where: { id: planId, siteId: site.id } })
  return NextResponse.json({ ok: true })
}
