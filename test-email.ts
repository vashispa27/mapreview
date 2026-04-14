/**
 * Standalone test script for Mailtrap Emails
 * Usage: 
 * 1. Set MAILTRAP_TOKEN and MAILTRAP_SENDER_EMAIL in .env
 * 2. Run: npx tsx test-email.ts <your-email-address>
 */

import "dotenv/config"
import { sendWelcomeEmail, sendSiteStatusEmail, sendPaymentEmail } from "./lib/email"

async function testEmails() {
  const targetEmail = process.argv[2]

  if (!targetEmail) {
    console.error("❌ Error: Please provide an email address to send the test to.")
    console.log("Usage: npx tsx test-email.ts your@email.com")
    return
  }

  console.log(`🚀 Starting Mailtrap test for: ${targetEmail}`)

  try {
    // 1. Test Welcome Email
    console.log("📨 Sending Welcome Email...")
    await sendWelcomeEmail(targetEmail, "Test User")
    console.log("✅ Welcome Email Sent!")

    // 2. Test Site Success Email
    console.log("📨 Sending Site Success Email...")
    await sendSiteStatusEmail(targetEmail, "Mario's Pizza", "SUCCESS", "https://maptosite.app/site/marios-pizza")
    console.log("✅ Site Success Email Sent!")

    // 3. Test Payment Email
    console.log("📨 Sending Payment Success Email...")
    await sendPaymentEmail(targetEmail, "Lifetime", 9900, "SUCCESS")
    console.log("✅ Payment Email Sent!")

    console.log("\n✨ All tests completed! Check your Mailtrap inbox.")

  } catch (error) {
    console.error("💥 Error during email test:")
    console.error(error)
  }
}

testEmails()
