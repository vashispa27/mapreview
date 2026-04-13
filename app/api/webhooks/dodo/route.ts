import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"

const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET

function verifySignature(rawBody: string, signature: string) {
  if (!WEBHOOK_SECRET) return false
  const hmac = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex")
  
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))
  } catch (e) {
    return false
  }
}

export async function POST(req: NextRequest) {
  // Dodo V2 uses webhook-signature, but some environments might still send dodo-signature
  const signature = req.headers.get("webhook-signature") || req.headers.get("dodo-signature")
  const rawBody = await req.text()

  if (!signature || !verifySignature(rawBody, signature)) {
    console.error("❌ Invalid Dodo Webhook Signature")
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(rawBody)

  // V2 uses event_type
  if (event.event_type === "payment.succeeded" || event.type === "payment.succeeded") {
    const paymentData = event.data
    const userId = paymentData.metadata?.userId
    const plan = paymentData.metadata?.plan
    const paymentId = paymentData.payment_id || paymentData.id

    if (userId) {
      try {
        // 1. Record the payment
        await db.payment.upsert({
          where: { id: paymentId },
          update: { status: "succeeded" },
          create: {
            id: paymentId,
            amount: paymentData.amount,
            currency: paymentData.currency,
            status: "succeeded",
            userId: userId,
          },
        })

        // 2. Update the user's plan
        await db.user.update({
          where: { id: userId },
          data: {
            plan: plan || "pro",
            isLifetime: plan === "lifetime",
          },
        })
        
        console.log(`✅ Webhook: User ${userId} upgraded to ${plan}`)
      } catch (dbError) {
        console.error("❌ Database Error in Dodo Webhook:", dbError)
        return NextResponse.json({ error: "Database update failed" }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
