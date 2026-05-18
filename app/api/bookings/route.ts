import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { businessId, name, phone, guests, date, time, notes } = await req.json()

    if (!businessId || !name?.trim() || !phone?.trim() || !guests || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const site = await db.site.findFirst({
      where: { OR: [{ id: businessId }, { slug: businessId }], deleted: false },
    })
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 })

    const booking = await db.restaurantBooking.create({
      data: {
        siteId: site.id,
        name: name.trim().slice(0, 100),
        phone: phone.trim().slice(0, 20),
        guests: Math.max(1, Math.min(50, Number(guests))),
        date,
        time,
        notes: notes?.trim().slice(0, 500) || null,
        status: "pending",
      },
    })

    return NextResponse.json({ ok: true, booking }, { status: 201 })
  } catch (err) {
    console.error("[Bookings POST]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
