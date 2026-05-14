import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ siteId: string; leadId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { siteId, leadId } = await params

  const site = await db.site.findFirst({ where: { id: siteId, userId: session.user.id, deleted: false } })
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const lead = await db.gymLead.update({
    where: { id: leadId, siteId },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.message !== undefined && { message: body.message }),
    },
  })
  return NextResponse.json({ lead })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ siteId: string; leadId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { siteId, leadId } = await params

  const site = await db.site.findFirst({ where: { id: siteId, userId: session.user.id, deleted: false } })
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.gymLead.delete({ where: { id: leadId, siteId } })
  return NextResponse.json({ ok: true })
}
