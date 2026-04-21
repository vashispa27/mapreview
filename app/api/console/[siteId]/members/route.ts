import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { calcEndDateByMonths, formatMonthLabel, formatDate } from "@/lib/gym-utils"
import { createGymPayment } from "@/lib/gym-billing"
import { sendGymEnrollmentEmail } from "@/lib/email"

async function getOwnedGymSite(siteId: string, userId: string) {
  const site = await db.site.findFirst({
    where: { OR: [{ id: siteId }, { slug: siteId }] },
  })
  if (!site || site.userId !== userId) return null
  const data = site.businessData as any
  if (!data?.isGym) return null
  return site
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const site = await getOwnedGymSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const members = await db.gymMember.findMany({
    where: { siteId: site.id },
    orderBy: { createdAt: "desc" },
  })

  // Sync status field in DB if expired
  const now = new Date()
  const toExpire = members.filter((m) => m.status === "active" && m.endDate <= now).map((m) => m.id)
  if (toExpire.length > 0) {
    await db.gymMember.updateMany({ where: { id: { in: toExpire } }, data: { status: "expired" } })
    toExpire.forEach((id) => {
      const m = members.find((x) => x.id === id)
      if (m) m.status = "expired"
    })
  }

  return NextResponse.json({ members })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const site = await getOwnedGymSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const { name, email, phone, durationMonths, pricePerMonth, startDate } = body

  if (!name || !phone || !durationMonths || !pricePerMonth || !startDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const months = parseInt(durationMonths)
  const perMonth = parseInt(pricePerMonth)
  if (isNaN(months) || months < 1 || isNaN(perMonth) || perMonth < 1) {
    return NextResponse.json({ error: "Invalid duration or price" }, { status: 400 })
  }

  const title = formatMonthLabel(months)
  const total = months * perMonth
  const price = `₹${total.toLocaleString("en-IN")} total (₹${perMonth.toLocaleString("en-IN")}/mo)`

  const start = new Date(startDate)
  const end = calcEndDateByMonths(start, months)

  const member = await db.gymMember.create({
    data: {
      siteId: site.id,
      name,
      email: email || null,
      phone,
      membershipPlanId: String(months),
      membershipTitle: title,
      membershipPrice: price,
      durationMonths: months,
      pricePerMonth: perMonth,
      startDate: start,
      endDate: end,
      status: "active",
    },
  })

  createGymPayment({
    siteId: site.id,
    memberId: member.id,
    memberName: name,
    memberPhone: phone,
    memberEmail: email || null,
    planTitle: title,
    durationMonths: months,
    pricePerMonth: perMonth,
    type: "enrollment",
  }).catch(console.error)

  if (email) {
    const gymName = (site.businessData as any)?.name || "Your Gym"
    sendGymEnrollmentEmail({
      memberEmail: email,
      memberName: name,
      gymName,
      planTitle: title,
      startDate: formatDate(start),
      endDate: formatDate(end),
    }).catch(console.error)
  }

  return NextResponse.json({ member }, { status: 201 })
}
