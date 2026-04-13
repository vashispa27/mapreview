import { MailtrapClient } from "mailtrap"

const TOKEN = process.env.MAILTRAP_TOKEN!
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || "hello@maptosite.app"

const client = new MailtrapClient({ token: TOKEN })

const sender = {
  email: SENDER_EMAIL,
  name: "MapToSite",
}

/**
 * Sends a welcome email to new users
 */
export async function sendWelcomeEmail(toEmail: string, name: string) {
  try {
    return await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: "Welcome to MapToSite! 🚀",
      text: `Hi ${name}, welcome to MapToSite. Start turning your Google Maps reviews into beautiful websites today!`,
      category: "Welcome",
    })
  } catch (error) {
    console.error("Failed to send welcome email:", error)
  }
}

/**
 * Sends notification about site generation status (Success/Failure)
 */
export async function sendSiteStatusEmail(toEmail: string, siteName: string, status: "SUCCESS" | "FAILED", url?: string) {
  const subject = status === "SUCCESS" ? "Your site is ready! 🎉" : "Action Required: Site Build Error ⚠️"
  const content = status === "SUCCESS" 
    ? `Great news! Your site "${siteName}" is live at: ${url}`
    : `We encountered an error while building "${siteName}". Please check your dashboard for details.`

  try {
    return await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: subject,
      text: content,
      category: "Site Status",
    })
  } catch (error) {
    console.error("Failed to send site status email:", error)
  }
}

/**
 * Sends payment confirmation or failure alerts
 */
export async function sendPaymentEmail(toEmail: string, plan: string, amount: number, status: "SUCCESS" | "FAILED") {
  const subject = status === "SUCCESS" ? "Payment Successful! ✅" : "Payment Failed ❌"
  const amountFormatted = (amount / 100).toFixed(2)
  const content = status === "SUCCESS"
    ? `Thank you for upgrading to the ${plan} plan. Your payment of $${amountFormatted} was successful.`
    : `Your payment for the ${plan} plan failed. Please try again from your dashboard.`

  try {
    return await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: subject,
      text: content,
      category: "Payment",
    })
  } catch (error) {
    console.error("Failed to send payment email:", error)
  }
}
