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

  const { searchParams } = new URL(req.url)
  const fy = searchParams.get("fy") || undefined
  const exportCsv = searchParams.get("export") === "csv"

  const payments = await db.gymPayment.findMany({
    where: { siteId: site.id, ...(fy ? { financialYear: fy } : {}) },
    orderBy: { invoiceDate: "desc" },
  })

  if (exportCsv) {
    const settings = await db.gymSettings.findUnique({ where: { siteId: site.id } })
    const gymName = settings?.businessName || (site.businessData as any)?.name || "Gym"
    const state = settings?.state || ""

    const headers = [
      "Invoice No.", "Invoice Date", "Member Name", "Phone",
      "SAC Code", "Plan", "Duration (months)", "Place of Supply",
      "Taxable Value (₹)", "CGST Rate (%)", "CGST Amount (₹)",
      "SGST Rate (%)", "SGST Amount (₹)", "IGST Rate (%)", "IGST Amount (₹)",
      "Total (₹)", "Type"
    ]

    const rows = payments.map((p) => [
      p.invoiceNumber,
      new Date(p.invoiceDate).toLocaleDateString("en-IN"),
      p.memberName,
      p.memberPhone,
      "999723",
      p.planTitle,
      p.durationMonths,
      state,
      p.taxableAmount.toFixed(2),
      p.isInterstate ? "0" : "2.5",
      p.cgst.toFixed(2),
      p.isInterstate ? "0" : "2.5",
      p.sgst.toFixed(2),
      p.isInterstate ? "5" : "0",
      p.igst.toFixed(2),
      p.totalAmount.toFixed(2),
      p.type,
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const fyLabel = fy || "all"
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${gymName}-GSTR1-${fyLabel}.csv"`,
      },
    })
  }

  return NextResponse.json({ payments })
}
