import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function getOwnedGymSite(siteId: string, userId: string) {
  const site = await db.site.findFirst({ where: { OR: [{ id: siteId }, { slug: siteId }] } })
  if (!site || site.userId !== userId) return null
  if (!(site.businessData as any)?.isGym) return null
  return site
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const site = await getOwnedGymSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const settings = await db.gymSettings.findUnique({ where: { siteId: site.id } })
  return NextResponse.json({ settings: settings ?? null })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const site = await getOwnedGymSite(siteId, session.user.id)
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const { gstin, businessName, address, state, isComposition, invoicePrefix } = body

  const settings = await db.gymSettings.upsert({
    where: { siteId: site.id },
    create: {
      siteId: site.id,
      gstin: gstin || null,
      businessName: businessName || null,
      address: address || null,
      state: state || null,
      isComposition: !!isComposition,
      invoicePrefix: invoicePrefix || "INV",
    },
    update: {
      gstin: gstin || null,
      businessName: businessName || null,
      address: address || null,
      state: state || null,
      isComposition: !!isComposition,
      invoicePrefix: invoicePrefix || "INV",
    },
  })

  return NextResponse.json({ settings })
}
