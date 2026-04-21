import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendGymPlanEmail } from "@/lib/email"

async function getOwnedGymSite(siteId: string, userId: string) {
  const site = await db.site.findFirst({ where: { OR: [{ id: siteId }, { slug: siteId }] } })
  if (!site || site.userId !== userId) return null
  if (!(site.businessData as any)?.isGym) return null
  return site
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string; memberId: string }> }
) {
  const { siteId, memberId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const site = await getOwnedGymSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const member = await db.gymMember.findFirst({ where: { id: memberId, siteId: site.id } })
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 })
  if (!member.email) return NextResponse.json({ error: "Member has no email" }, { status: 400 })

  const settings = await db.gymSettings.findUnique({ where: { siteId: site.id } })
  const gymName = settings?.businessName || (site.businessData as any)?.name || "Your Gym"

  const body = await req.json()
  const workoutPlan = body.includeWorkout ? member.workoutPlan : undefined
  const dietPlan = body.includeDiet ? member.dietPlan : undefined

  if (!workoutPlan && !dietPlan) {
    return NextResponse.json({ error: "Nothing to send" }, { status: 400 })
  }

  await sendGymPlanEmail({
    memberEmail: member.email,
    memberName: member.name,
    gymName,
    workoutPlan: workoutPlan ?? undefined,
    dietPlan: dietPlan ?? undefined,
  })

  return NextResponse.json({ ok: true })
}
