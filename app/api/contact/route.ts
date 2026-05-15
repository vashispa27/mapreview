import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendInquiryEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessId, businessName, name, email, phone, service, message } = body

    console.log("[Contact Form]", body)

    // Look up site owner's email
    if (!businessId) {
      console.warn("[Contact Form] No businessId provided")
      return NextResponse.json({ ok: false, reason: "no_business_id" }, { status: 400 })
    }

    const site = await db.site.findFirst({
      where: { OR: [{ id: businessId }, { slug: businessId }] },
      include: { user: { select: { email: true } } },
    })

    if (!site) {
      console.warn("[Contact Form] Site not found for businessId:", businessId)
      return NextResponse.json({ ok: false, reason: "site_not_found" }, { status: 404 })
    }

    // Save lead to database so it appears in the gym console
    await db.gymLead.create({
      data: {
        siteId: site.id,
        name: name || "Anonymous",
        phone: phone || "",
        email: email || null,
        message: service ? `[${service}] ${message || ""}`.trim() : (message || null),
        source: "Website",
        status: "new",
      },
    }).catch(err => console.error("[Contact Form] Failed to save lead:", err))

    const ownerEmail = site.user?.email
    if (ownerEmail) {
      await sendInquiryEmail(ownerEmail, businessName || "your business", {
        name: name || "Anonymous",
        email: email || "",
        phone,
        service,
        message: message || "",
      }).catch(err => console.error("[Contact Form] Failed to send email:", err))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[Contact Form Error]", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
