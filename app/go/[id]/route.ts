import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Permanent QR redirect — links to /go/{siteId} always resolve to the
// current published URL, so QR codes survive slug changes.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const site = await db.site.findUnique({ where: { id } })

  if (!site) {
    return NextResponse.redirect(new URL("/", _req.url))
  }

  const destination = site.slug ? `/site/${site.slug}` : `/site/${site.id}`
  return NextResponse.redirect(new URL(destination, _req.url))
}
