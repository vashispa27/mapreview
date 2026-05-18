import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

async function getSiteForUser(siteId: string, userId: string) {
  return db.site.findFirst({ where: { id: siteId, userId, deleted: false } })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { siteId } = await params
  const site = await getSiteForUser(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const bookings = await db.restaurantBooking.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({ bookings })
}
