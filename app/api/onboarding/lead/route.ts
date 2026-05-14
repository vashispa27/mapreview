import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { gymName, mapsUrl, step, sessionId } = await req.json()

    if (!gymName || !step) {
      return NextResponse.json({ error: "gymName and step are required" }, { status: 400 })
    }

    const session = await auth()

    await db.onboardingLead.create({
      data: {
        gymName: gymName.trim().slice(0, 200),
        mapsUrl: mapsUrl || null,
        step,
        sessionId: sessionId || null,
        userId: session?.user?.id || null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Best-effort — don't block the user if DB fails
    console.error("onboarding lead tracking failed:", err)
    return NextResponse.json({ ok: true })
  }
}
