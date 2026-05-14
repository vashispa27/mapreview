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

  const leads = await db.gymLead.findMany({
    where: { siteId },
    orderBy: { enquiryDate: "desc" },
  })
  return NextResponse.json({ leads })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { siteId } = await params
  const site = await getSiteForUser(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { name, phone, email, message, source } = await req.json()
  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "name and phone are required" }, { status: 400 })
  }

  const lead = await db.gymLead.create({
    data: {
      siteId,
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 20),
      email: email?.trim().slice(0, 200) || null,
      message: message?.trim().slice(0, 500) || null,
      source: source || "Walk-in",
      status: "new",
    },
  })
  return NextResponse.json({ lead }, { status: 201 })
}
