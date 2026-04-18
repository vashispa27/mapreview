import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendInquiryEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessId, businessName, name, email, phone, service, message } = body

    console.log("[Contact Form]", body)

    // Look up site owner's email
    if (businessId) {
      const site = await db.site.findFirst({
        where: { OR: [{ id: businessId }, { slug: businessId }] },
        include: { user: { select: { email: true } } },
      })

      const ownerEmail = site?.user?.email
      if (ownerEmail) {
        await sendInquiryEmail(ownerEmail, businessName || "your business", {
          name: name || "Anonymous",
          email: email || "",
          phone,
          service,
          message: message || "",
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[Contact Form Error]", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
