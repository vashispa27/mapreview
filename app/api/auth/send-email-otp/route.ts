import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendOtpEmail } from "@/lib/email"

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const normalised = email.trim().toLowerCase()
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await db.emailOtp.deleteMany({ where: { email: normalised } })
    await db.emailOtp.create({ data: { email: normalised, otp, expiresAt } })

    await sendOtpEmail(normalised, otp)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[send-email-otp]", err)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
