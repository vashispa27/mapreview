import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sendSpeedChallengeEmail } from "@/lib/email"

const TIERS = [
  { ceiling: 60,  code: process.env.NEXT_PUBLIC_PROMO_UNDER_30 ?? "", discount: "50%" },
  { ceiling: 80,  code: process.env.NEXT_PUBLIC_PROMO_UNDER_40 ?? "", discount: "40%" },
  { ceiling: 90,  code: process.env.NEXT_PUBLIC_PROMO_UNDER_50 ?? "", discount: "30%" },
  { ceiling: 100, code: process.env.NEXT_PUBLIC_PROMO_UNDER_60 ?? "", discount: "20%" },
]

function getTier(seconds: number) {
  return TIERS.find(t => seconds < t.ceiling && t.code) ?? null
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { seconds } = await req.json()
  if (typeof seconds !== "number" || seconds <= 0) {
    return NextResponse.json({ error: "Invalid seconds" }, { status: 400 })
  }

  const tier = getTier(seconds)
  if (!tier) {
    return NextResponse.json({ ok: false, reason: "no_tier" })
  }

  await sendSpeedChallengeEmail(
    session.user.email,
    session.user.name ?? "",
    seconds,
    tier.code,
    tier.discount
  )

  return NextResponse.json({ ok: true, discount: tier.discount })
}
