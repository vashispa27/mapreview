import { NextRequest, NextResponse } from "next/server"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { db } from "@/lib/db"

const sns = new SNSClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()

    const cleaned = phone?.replace(/\s/g, "")
    if (!cleaned || !/^\d{10}$/.test(cleaned)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 })
    }

    const e164 = `+91${cleaned}`
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete old OTPs for this phone
    await db.phoneOtp.deleteMany({ where: { phone: cleaned } })

    // Store new OTP
    await db.phoneOtp.create({ data: { phone: cleaned, otp, expiresAt } })

    // Send via SNS
    await sns.send(new PublishCommand({
      PhoneNumber: e164,
      Message: `Your MapToSite OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": { DataType: "String", StringValue: "Transactional" },
        "AWS.SNS.SMS.SenderID": { DataType: "String", StringValue: "MapToSit" },
      },
    }))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[send-otp]", err)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
