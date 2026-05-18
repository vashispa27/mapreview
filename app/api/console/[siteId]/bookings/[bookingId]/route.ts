import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

async function getSiteForUser(siteId: string, userId: string) {
  return db.site.findFirst({ where: { id: siteId, userId, deleted: false } })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ siteId: string; bookingId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { siteId, bookingId } = await params
  const site = await getSiteForUser(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { status } = await req.json()
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const booking = await db.restaurantBooking.update({
    where: { id: bookingId, siteId },
    data: { status },
  })
  return NextResponse.json({ booking })
}
