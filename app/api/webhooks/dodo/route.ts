import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { DodoPayments } from "dodopayments"
import {
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
  sendPaymentCancelledEmail,
} from "@/lib/email"

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  webhookKey: process.env.DODO_WEBHOOK_SECRET,
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headers = Object.fromEntries(req.headers.entries())

  try {
    const event = client.webhooks.unwrap(body, { headers })

    if (event.type === "payment.succeeded") {
      const paymentData = event.data
      const paymentId = paymentData.payment_id
      const amount = paymentData.total_amount
      const currency = paymentData.currency
      const userId = (paymentData.metadata as any)?.userId
      const plan = (paymentData.metadata as any)?.plan as "base" | "pro"

      if (userId) {
        const planExpiresAt = new Date()
        planExpiresAt.setFullYear(planExpiresAt.getFullYear() + 1)

        await db.payment.upsert({
          where: { id: paymentId },
          update: { status: "succeeded", amount },
          create: { id: paymentId, amount, currency, status: "succeeded", userId },
        })

        await db.user.update({
          where: { id: userId },
          data: { plan: plan || "base", planExpiresAt },
        })

        const user = await db.user.findUnique({ where: { id: userId } })
        if (user?.email) {
          await sendPaymentSuccessEmail(
            user.email,
            user.name || "",
            plan || "base",
            amount,
            planExpiresAt
          )
        }

        console.log(`✅ Payment succeeded: user ${userId} → ${plan}. Valid until ${planExpiresAt.toISOString()}`)
      }
    }

    if (event.type === "payment.failed") {
      const paymentData = event.data
      const paymentId = paymentData.payment_id
      const userId = (paymentData.metadata as any)?.userId
      const plan = (paymentData.metadata as any)?.plan ?? "base"

      await db.payment.upsert({
        where: { id: paymentId },
        update: { status: "failed" },
        create: {
          id: paymentId,
          amount: paymentData.total_amount ?? 0,
          currency: paymentData.currency ?? "usd",
          status: "failed",
          userId: userId ?? "unknown",
        },
      })

      const user = await db.user.findUnique({ where: { id: userId || "" } })
      if (user?.email) {
        await sendPaymentFailedEmail(user.email, user.name || "", plan)
      }

      console.log(`❌ Payment failed: ${paymentId} for user ${userId}`)
    }

    if (event.type === "payment.cancelled") {
      const paymentData = event.data
      const paymentId = paymentData.payment_id
      const userId = (paymentData.metadata as any)?.userId
      const plan = (paymentData.metadata as any)?.plan ?? "base"

      await db.payment.upsert({
        where: { id: paymentId },
        update: { status: "cancelled" },
        create: {
          id: paymentId,
          amount: paymentData.total_amount ?? 0,
          currency: paymentData.currency ?? "usd",
          status: "cancelled",
          userId: userId ?? "unknown",
        },
      })

      const user = await db.user.findUnique({ where: { id: userId || "" } })
      if (user?.email) {
        await sendPaymentCancelledEmail(user.email, user.name || "", plan)
      }

      console.log(`🚫 Payment cancelled: ${paymentId} for user ${userId}`)
    }

    if (event.type === "payment.processing") {
      const paymentData = event.data
      const paymentId = paymentData.payment_id
      const userId = (paymentData.metadata as any)?.userId

      await db.payment.upsert({
        where: { id: paymentId },
        update: { status: "processing" },
        create: {
          id: paymentId,
          amount: paymentData.total_amount ?? 0,
          currency: paymentData.currency ?? "usd",
          status: "processing",
          userId: userId ?? "unknown",
        },
      })

      console.log(`⏳ Payment processing: ${paymentId} for user ${userId}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Dodo Webhook Verification Failed:", error)
    return NextResponse.json({ error: "Invalid signature or payload" }, { status: 401 })
  }
}
