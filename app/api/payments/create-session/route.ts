import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { DodoPayments } from "dodopayments"

const client = new DodoPayments({
  baseURL:"https://test.dodopayments.com",
  bearerToken: process.env.DODO_PAYMENTS_API_KEY || "empty",
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!process.env.DODO_PAYMENTS_API_KEY || process.env.DODO_PAYMENTS_API_KEY === "empty") {
      return NextResponse.json({ error: "Dodo API Key is not configured" }, { status: 500 })
    }

    const body = await req.json()
    const { plan } = body

    // Product IDs from Dodo Dashboard
    const productId = plan === "base"
      ? process.env.DODO_BASE_PRODUCT_ID
      : plan === "pro"
      ? process.env.DODO_PRO_PRODUCT_ID
      : undefined

    if (!productId) {
      return NextResponse.json({ 
        error: `Product ID for plan '${plan}' is not configured in environment variables.` 
      }, { status: 500 })
    }

    const checkoutSession = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      customer: {
        email: session.user.email!,
        name: session.user.name || "Customer",
      },
      metadata: {
        userId: session.user.id,
        plan: plan,
      },
      return_url: `${process.env.REDIRECT_URL || 'http://localhost:3000'}/my-sites`,
    })

    return NextResponse.json({ url: checkoutSession.checkout_url })
  } catch (error) {
    console.error("Dodo Payment Error:", error)
    return NextResponse.json({ error: "Failed to create payment session" }, { status: 500 })
  }
}
