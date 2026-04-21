import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { calcEndDateByMonths, formatDate } from "@/lib/gym-utils"
import { createGymPayment } from "@/lib/gym-billing"
import { sendGymRenewalEmail } from "@/lib/email"

async function getOwnedGymSite(siteId: string, userId: string) {
  const site = await db.site.findFirst({
    where: { OR: [{ id: siteId }, { slug: siteId }] },
  })
  if (!site || site.userId !== userId) return null
  const data = site.businessData as any
  if (!data?.isGym) return null
  return site
}

// GET — member profile
export async function GET(
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

  const payments = await db.gymPayment.findMany({
    where: { memberId },
    orderBy: { invoiceDate: "desc" },
    take: 10,
  })

  return NextResponse.json({ member, payments })
}

// PATCH — renew membership
export async function PATCH(
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

  const months = parseInt(member.membershipPlanId) || 1
  const base = member.endDate > new Date() ? member.endDate : new Date()
  const newStart = base
  const newEnd = calcEndDateByMonths(base, months)

  const updated = await db.gymMember.update({
    where: { id: memberId },
    data: {
      startDate: newStart,
      endDate: newEnd,
      status: "active",
      // Reset reminder flags for new cycle
      notified7Days: false,
      notified1Day: false,
      notifiedExpired: false,
    },
  })

  createGymPayment({
    siteId: site.id,
    memberId: member.id,
    memberName: member.name,
    memberPhone: member.phone,
    memberEmail: member.email,
    planTitle: member.membershipTitle,
    durationMonths: months,
    pricePerMonth: member.pricePerMonth,
    type: "renewal",
  }).catch(console.error)

  if (member.email) {
    const gymName = (site.businessData as any)?.name || "Your Gym"
    sendGymRenewalEmail({
      memberEmail: member.email,
      memberName: member.name,
      gymName,
      planTitle: member.membershipTitle,
      startDate: formatDate(newStart),
      endDate: formatDate(newEnd),
    }).catch(console.error)
  }

  return NextResponse.json({ member: updated })
}

// DELETE — remove member
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string; memberId: string }> }
) {
  const { siteId, memberId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const site = await getOwnedGymSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.gymMember.deleteMany({ where: { id: memberId, siteId: site.id } })
  return NextResponse.json({ ok: true })
}
