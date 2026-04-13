import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { DodoPayments } from "dodopayments"

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  webhookSecret: process.env.DODO_WEBHOOK_SECRET!,
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headers = Object.fromEntries(req.headers.entries())

  try {
    // Official Dodo SDK Unwrap method for secure verification and parsing
    const event = client.webhooks.unwrap(body, headers)

    // Handle Payment Succeeded
    if (event.type === "payment.succeeded") {
      const paymentData = event.data
      
      const paymentId = paymentData.payment_id
      const amount = paymentData.total_amount
      const currency = paymentData.currency
      const userId = (paymentData.metadata as any)?.userId
      const plan = (paymentData.metadata as any)?.plan

      if (userId) {
        // 1. Record the payment
        await db.payment.upsert({
          where: { id: paymentId },
          update: { 
            status: "succeeded",
            amount: amount,
          },
          create: {
            id: paymentId,
            amount: amount,
            currency: currency,
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
        
        console.log(`✅ Webhook: User ${userId} upgraded to ${plan} (Amount: ${amount} ${currency})`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Dodo Webhook Verification Failed:", error)
    return NextResponse.json({ error: "Invalid signature or payload" }, { status: 401 })
  }
}
