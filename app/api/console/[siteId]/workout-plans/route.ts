import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function getSite(siteId: string, userId: string) {
  return db.site.findFirst({ where: { OR: [{ id: siteId }, { slug: siteId }], userId, deleted: false } })
}

export async function GET(_req: Request, { params }: { params: Promise<{ siteId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { siteId } = await params
  const site = await getSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const plans = await db.gymWorkoutPlan.findMany({ where: { siteId: site.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json({ plans })
}

export async function POST(req: Request, { params }: { params: Promise<{ siteId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { siteId } = await params
  const site = await getSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const body = await req.json()
  const plan = await db.gymWorkoutPlan.create({
    data: { siteId: site.id, name: body.name || "Untitled Plan", goal: body.goal || null, notes: body.notes || null, sessions: body.sessions ?? [] },
  })
  return NextResponse.json({ plan })
}
