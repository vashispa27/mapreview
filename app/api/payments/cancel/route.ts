import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { DodoPayments } from "dodopayments"

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
})

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionId: true, plan: true },
  })

  if (!user?.subscriptionId) {
    return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
  }

  await client.subscriptions.update(user.subscriptionId, {
    cancel_at_next_billing_date: true,
    cancel_reason: "cancelled_by_customer",
  })

  return NextResponse.json({ success: true })
}
