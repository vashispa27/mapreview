import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function getOwnedGymSite(siteId: string, userId: string) {
  const site = await db.site.findFirst({ where: { OR: [{ id: siteId }, { slug: siteId }] } })
  if (!site || site.userId !== userId) return null
  if (!(site.businessData as any)?.isGym) return null
  return site
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string; memberId: string }> }
) {
  const { siteId, memberId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const site = await getOwnedGymSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (body.workoutPlan !== undefined) data.workoutPlan = body.workoutPlan
  if (body.dietPlan !== undefined) data.dietPlan = body.dietPlan

  const member = await db.gymMember.update({ where: { id: memberId }, data })
  return NextResponse.json({ member })
}
