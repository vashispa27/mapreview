import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendGymPlanEmail } from "@/lib/email"

async function getSite(siteId: string, userId: string) {
  return db.site.findFirst({ where: { OR: [{ id: siteId }, { slug: siteId }], userId, deleted: false } })
}

export async function POST(req: Request, { params }: { params: Promise<{ siteId: string; memberId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { siteId, memberId } = await params
  const site = await getSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { planId } = await req.json()

  const [member, plan] = await Promise.all([
    db.gymMember.findUnique({ where: { id: memberId } }),
    db.gymWorkoutPlan.findUnique({ where: { id: planId } }),
  ])

  if (!member || member.siteId !== site.id) return NextResponse.json({ error: "Member not found" }, { status: 404 })
  if (!plan || plan.siteId !== site.id) return NextResponse.json({ error: "Plan not found" }, { status: 404 })

  await db.gymMember.update({ where: { id: memberId }, data: { assignedPlanId: planId } })

  if (member.email) {
    const gymName = (site.businessData as any)?.name || site.businessName || "Your Gym"
    await sendGymPlanEmail({
      memberEmail: member.email,
      memberName: member.name,
      gymName,
      workoutPlan: { goal: plan.goal, notes: plan.notes, sessions: plan.sessions },
    }).catch(console.error)
  }

  return NextResponse.json({ ok: true, emailSent: !!member.email })
}
