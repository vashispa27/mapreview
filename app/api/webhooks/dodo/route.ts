import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import DodoPayments from "dodopayments"

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: "test", // "test" | "live"
  webhookKey: process.env.DODO_WEBHOOK_SECRET, // webhook secret
})

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  try {
    const event = client.webhooks.unwrap(rawBody, {
      headers: {
        "webhook-id": req.headers.get("webhook-id") || "",
        "webhook-signature": req.headers.get("webhook-signature") || "",
        "webhook-timestamp": req.headers.get("webhook-timestamp") || "",
      },
    })

    // Dodo v2 uses event_type; keep fallback to type just in case
    const eventType = (event as any).event_type || (event as any).type

    if (eventType === "payment.succeeded") {
      const paymentData = (event as any).data
      const userId = paymentData.metadata?.userId
      const plan = paymentData.metadata?.plan
      const paymentId = paymentData.payment_id || paymentData.id

      if (userId) {
        try {
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
  } catch (err) {
    console.error("❌ Invalid Dodo Webhook Signature", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }
}