import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sendSpeedChallengeEmail } from "@/lib/email"

const PROMO_CODE = process.env.NEXT_PUBLIC_PROMO_UNDER_30 ?? ""

// Only send promo when generation took MORE than 60 seconds
function shouldSendPromo(seconds: number) {
  return seconds > 60 && PROMO_CODE !== ""
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

  if (!shouldSendPromo(seconds)) {
    return NextResponse.json({ ok: false, reason: "under_60s_no_promo" })
  }

  await sendSpeedChallengeEmail(
    session.user.email,
    session.user.name ?? "",
    seconds,
    PROMO_CODE,
    "50%"
  )

  return NextResponse.json({ ok: true, discount: "50%" })
}
