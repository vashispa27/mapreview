import { MailtrapClient } from "mailtrap"

const TOKEN = process.env.MAILTRAP_TOKEN!
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || "hello@maptosite.app"
const APP_URL = process.env.NEXTAUTH_URL || "https://maptosite.app"

const client = new MailtrapClient({ token: TOKEN })

const sender = {
  email: SENDER_EMAIL,
  name: "MapToSite",
}

// ─── Shared layout ───────────────────────────────────────────────────────────

function layout(previewText: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${previewText}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a2e;">

  <!-- Preview text (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}</div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:#4f46e5;border-radius:12px;padding:10px 14px;display:inline-block;">
                    <span style="color:#ffffff;font-size:18px;font-weight:900;letter-spacing:-0.5px;">📍 MapToSite</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;box-shadow:0 2px 16px rgba(0,0,0,0.08);overflow:hidden;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 0 8px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                You're receiving this because you have an account at
                <a href="${APP_URL}" style="color:#4f46e5;text-decoration:none;">MapToSite</a>.
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} MapToSite. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`
}

function heroSection(iconEmoji: string, bgColor: string, title: string, subtitle: string): string {
  return `
  <div style="background:${bgColor};padding:36px 40px 28px;text-align:center;">
    <div style="font-size:48px;margin-bottom:12px;line-height:1;">${iconEmoji}</div>
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:#1a1a2e;letter-spacing:-0.5px;">${title}</h1>
    <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.5;">${subtitle}</p>
  </div>`
}

function button(text: string, href: string, primary = true): string {
  const bg = primary ? "#4f46e5" : "#f3f4f6"
  const color = primary ? "#ffffff" : "#374151"
  return `
  <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
    <tr>
      <td style="background:${bg};border-radius:10px;padding:14px 32px;">
        <a href="${href}" style="color:${color};font-size:15px;font-weight:800;text-decoration:none;letter-spacing:0.3px;white-space:nowrap;">${text}</a>
      </td>
    </tr>
  </table>`
}

function featureRow(emoji: string, text: string): string {
  return `
  <tr>
    <td style="padding:6px 0;">
      <table cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="width:28px;vertical-align:top;padding-top:1px;">
            <span style="font-size:16px;">${emoji}</span>
          </td>
          <td style="font-size:14px;color:#374151;line-height:1.5;">${text}</td>
        </tr>
      </table>
    </td>
  </tr>`
}

// ─── Welcome Email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(toEmail: string, name: string) {
  const firstName = name?.split(" ")[0] || "there"

  const body = `
  ${heroSection("🎉", "linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%)", `Welcome aboard, ${firstName}!`, "You're all set to turn Google Maps reviews into beautiful websites.")}

  <div style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      MapToSite lets you create professional websites from any Google Maps listing in seconds — no design skills needed.
    </p>

    <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;">Here's how to get started:</p>

    <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
      ${featureRow("🔗", "Grab any Google Maps short link (maps.app.goo.gl/…)")}
      ${featureRow("⚡", "Paste it on MapToSite and click Generate")}
      ${featureRow("🎨", "Customize colors, layout and publish with one click")}
    </table>

    <div style="margin:28px 0;">
      ${button("Create My First Site →", `${APP_URL}`)}
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      Questions? Reply to this email — we're always happy to help.
    </p>
  </div>`

  try {
    return await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: `Welcome to MapToSite, ${firstName}! 🚀`,
      html: layout(`You're all set, ${firstName}! Start building your first site.`, body),
      text: `Hi ${firstName}, welcome to MapToSite! Start building your first website at ${APP_URL}`,
      category: "Welcome",
    })
  } catch (error) {
    console.error("Failed to send welcome email:", error)
  }
}

// ─── Payment Success Email ────────────────────────────────────────────────────

export async function sendPaymentSuccessEmail(
  toEmail: string,
  name: string,
  plan: "base" | "pro",
  amount: number,
  planExpiresAt: Date | null
) {
  const firstName = name?.split(" ")[0] || "there"
  const amountFormatted = `₹${(amount / 100).toFixed(0)}`
  const planLabel = plan === "pro" ? "Pro" : "Base"
  const expiryFormatted = planExpiresAt
    ? planExpiresAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null
  const planColor = plan === "pro" ? "#4f46e5" : "#374151"
  const planBg = plan === "pro" ? "#eef2ff" : "#f9fafb"

  const proFeatures = plan === "pro" ? [
    featureRow("✅", "10 websites with unlimited edits"),
    featureRow("✅", "200 reviews analysed per site"),
    featureRow("✅", "Weekly reviews report analysis"),
    featureRow("✅", "Request for custom domain"),
    featureRow("✅", "7-day priority Discord support"),
  ] : [
    featureRow("✅", "3 websites with unlimited edits"),
    featureRow("✅", "50 reviews analysed per site"),
    featureRow("✅", "Automatic updates with live reviews"),
    featureRow("✅", "Custom URL with MapToSite branding"),
    featureRow("✅", "7-day Discord support"),
  ]

  const body = `
  ${heroSection("🎊", "linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%)", "Payment Confirmed!", `Your ${planLabel} plan is now active.`)}

  <div style="padding:32px 40px;">

    <!-- Receipt box -->
    <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;background:${planBg};border:1.5px solid #e5e7eb;border-radius:12px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tr>
              <td style="font-size:13px;color:#6b7280;">Plan</td>
              <td align="right">
                <span style="font-size:13px;font-weight:800;color:${planColor};background:${plan === "pro" ? "#e0e7ff" : "#f3f4f6"};padding:2px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">${planLabel}</span>
              </td>
            </tr>
            <tr>
              <td style="padding-top:10px;font-size:13px;color:#6b7280;">Amount paid</td>
              <td align="right" style="padding-top:10px;font-size:14px;font-weight:700;color:#1a1a2e;">${amountFormatted}</td>
            </tr>
            <tr>
              <td style="padding-top:10px;font-size:13px;color:#6b7280;">${plan === "pro" ? "Payment" : (expiryFormatted ? "Valid until" : "Billing")}</td>
              <td align="right" style="padding-top:10px;font-size:14px;font-weight:700;color:#1a1a2e;">${plan === "pro" ? "₹9,999/year · renews annually" : (expiryFormatted ?? "₹999/month · renews automatically")}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;">What's included in your plan:</p>
    <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
      ${proFeatures.join("")}
    </table>

    <div style="margin:28px 0;">
      ${button("Go to My Dashboard →", `${APP_URL}/my-sites`)}
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      Thank you for supporting MapToSite, ${firstName}! If you have any questions about your plan, just reply to this email.
    </p>
  </div>`

  try {
    return await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: `Your ${planLabel} plan is active! ✅`,
      html: layout(`Payment confirmed — your ${planLabel} plan is now live.`, body),
      text: `Hi ${firstName}, your ${planLabel} plan payment of ${amountFormatted} was successful. Plan valid until ${expiryFormatted}. Visit ${APP_URL}/my-sites to get started.`,
      category: "Payment",
    })
  } catch (error) {
    console.error("Failed to send payment success email:", error)
  }
}

// ─── Payment Failed Email ─────────────────────────────────────────────────────

export async function sendPaymentFailedEmail(toEmail: string, name: string, plan: string) {
  const firstName = name?.split(" ")[0] || "there"
  const planLabel = plan === "pro" ? "Pro" : plan === "base" ? "Base" : plan

  const body = `
  ${heroSection("❌", "linear-gradient(135deg,#fef2f2 0%,#fee2e2 100%)", "Payment Failed", "We couldn't process your payment.")}

  <div style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      Hi ${firstName}, your payment for the <strong>${planLabel}</strong> plan was declined. This can happen due to:
    </p>

    <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
      ${featureRow("💳", "Insufficient funds or card limit reached")}
      ${featureRow("🔒", "Card issuer declined the transaction")}
      ${featureRow("📋", "Incorrect billing details")}
    </table>

    <div style="background:#fef2f2;border:1.5px solid #fecaca;border-radius:12px;padding:16px 20px;margin:24px 0;">
      <p style="margin:0;font-size:14px;color:#991b1b;line-height:1.6;">
        <strong>No charge was made</strong> to your account. Your access level has not changed.
      </p>
    </div>

    <div style="margin:24px 0;">
      ${button("Try Again →", `${APP_URL}/#pricing`)}
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      If you keep seeing this error, please contact your bank or reach out to us and we'll sort it out.
    </p>
  </div>`

  try {
    return await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: `Payment failed — let's fix that 🔧`,
      html: layout("Your payment didn't go through — here's what to do.", body),
      text: `Hi ${firstName}, your payment for the ${planLabel} plan failed. Please try again at ${APP_URL}/#pricing`,
      category: "Payment",
    })
  } catch (error) {
    console.error("Failed to send payment failed email:", error)
  }
}

// ─── Payment Cancelled Email ──────────────────────────────────────────────────

export async function sendPaymentCancelledEmail(toEmail: string, name: string, plan: string) {
  const firstName = name?.split(" ")[0] || "there"
  const planLabel = plan === "pro" ? "Pro" : plan === "base" ? "Base" : plan

  const body = `
  ${heroSection("🚫", "linear-gradient(135deg,#f9fafb 0%,#f3f4f6 100%)", "Payment Cancelled", "Your checkout session was cancelled.")}

  <div style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      Hi ${firstName}, your checkout for the <strong>${planLabel}</strong> plan was cancelled. No payment was taken.
    </p>

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      If this was a mistake or you'd like to try again, you can restart the checkout from the pricing page.
    </p>

    <div style="margin:24px 0;">
      ${button("View Plans →", `${APP_URL}/#pricing`)}
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      Changed your mind? No problem — your account will remain on the free tier until you upgrade.
    </p>
  </div>`

  try {
    return await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: `Your checkout was cancelled`,
      html: layout("You cancelled the checkout — here's what happened.", body),
      text: `Hi ${firstName}, your checkout for the ${planLabel} plan was cancelled. You can restart at ${APP_URL}/#pricing`,
      category: "Payment",
    })
  } catch (error) {
    console.error("Failed to send payment cancelled email:", error)
  }
}

// ─── Site Status Email ────────────────────────────────────────────────────────

export async function sendSiteStatusEmail(
  toEmail: string,
  siteName: string,
  status: "SUCCESS" | "FAILED",
  url?: string
) {
  const isSuccess = status === "SUCCESS"

  const body = isSuccess ? `
  ${heroSection("🚀", "linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)", "Your site is live!", `"${siteName}" is ready to share.`)}

  <div style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      Great news! Your website for <strong>${siteName}</strong> has been generated and is live.
    </p>

    ${url ? `
    <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
      <p style="margin:0 0 6px;font-size:12px;color:#15803d;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Your site URL</p>
      <a href="${url}" style="font-size:14px;color:#16a34a;word-break:break-all;">${url}</a>
    </div>` : ""}

    <div style="margin:24px 0;">
      ${button("View & Customize →", url || `${APP_URL}/my-sites`)}
    </div>
  </div>` : `
  ${heroSection("⚠️", "linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)", "Build failed", `We couldn't generate "${siteName}".`)}

  <div style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      Something went wrong while building your site for <strong>${siteName}</strong>. This is usually a temporary issue.
    </p>

    <div style="margin:24px 0;">
      ${button("Try Again →", `${APP_URL}`)}
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      If the issue persists, please reply to this email and we'll investigate.
    </p>
  </div>`

  try {
    return await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: isSuccess ? `"${siteName}" is live! 🎉` : `Build failed for "${siteName}" ⚠️`,
      html: layout(isSuccess ? `Your site is live!` : `Build error for ${siteName}`, body),
      text: isSuccess
        ? `Your site "${siteName}" is live at: ${url}`
        : `We encountered an error while building "${siteName}". Please try again at ${APP_URL}`,
      category: "Site Status",
    })
  } catch (error) {
    console.error("Failed to send site status email:", error)
  }
}

// ─── Inquiry Email (contact form submission) ─────────────────────────────────

export async function sendInquiryEmail(
  ownerEmail: string,
  businessName: string,
  inquiry: {
    name: string
    email: string
    phone?: string
    service?: string
    message: string
  }
) {
  const rows = [
    ["Name", inquiry.name],
    ["Email", `<a href="mailto:${inquiry.email}" style="color:#4f46e5;">${inquiry.email}</a>`],
    ...(inquiry.phone ? [["Phone", inquiry.phone]] : []),
    ...(inquiry.service ? [["Service / Inquiry", inquiry.service]] : []),
  ]
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#6b7280;width:130px;vertical-align:top;">${label}</td>
        <td style="padding:8px 0;font-size:14px;color:#1a1a2e;font-weight:600;">${value}</td>
      </tr>`
    )
    .join("")

  const body = `
  ${heroSection("✉️", "linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%)", "New Inquiry", `Someone reached out via your ${businessName} website.`)}

  <div style="padding:32px 40px;">
    <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          ${rows}
        </table>
      </td></tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
    <div style="background:#ffffff;border:1.5px solid #e5e7eb;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${inquiry.message}</p>
    </div>

    <div style="margin:24px 0;">
      ${button(`Reply to ${inquiry.name} →`, `mailto:${inquiry.email}`)}
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      This inquiry was submitted through your MapToSite website.
    </p>
  </div>`

  try {
    return await client.send({
      from: sender,
      to: [{ email: ownerEmail }],
      subject: `New inquiry from ${inquiry.name} — ${businessName}`,
      html: layout(`${inquiry.name} sent you a message via ${businessName}`, body),
      text: `New inquiry from ${inquiry.name} (${inquiry.email})\n\nMessage:\n${inquiry.message}`,
      category: "Inquiry",
    })
  } catch (error) {
    console.error("Failed to send inquiry email:", error)
  }
}

// ─── Speed Challenge Promo Email ─────────────────────────────────────────────

export async function sendSpeedChallengeEmail(
  toEmail: string,
  name: string,
  seconds: number,
  promoCode: string,
  discount: string
) {
  const firstName = name?.split(" ")[0] || "there"

  const body = `
  ${heroSection("⚡", "linear-gradient(135deg,#fdf4ff 0%,#ede9fe 100%)", `You built it in ${seconds} seconds!`, `You earned ${discount} off your MapToSite plan.`)}

  <div style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      Hi ${firstName}, you just completed the MapToSite Speed Challenge in <strong>${seconds} seconds</strong> — that earns you <strong>${discount} off</strong> any plan.
    </p>

    <div style="background:#f5f3ff;border:1.5px solid #c4b5fd;border-radius:12px;padding:20px 24px;margin:0 0 24px;text-align:center;">
      <p style="margin:0 0 6px;font-size:12px;color:#7c3aed;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Your discount code</p>
      <p style="margin:0;font-size:28px;font-weight:900;letter-spacing:2px;color:#4c1d95;">${promoCode}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#6b7280;">${discount} off — apply at checkout</p>
    </div>

    <div style="margin:24px 0;">
      ${button("Claim My Discount →", `${APP_URL}/#pricing`)}
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      This code is for you — use it when you upgrade to any paid plan.
    </p>
  </div>`

  try {
    return await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: `⚡ You did it in ${seconds}s — here's your ${discount} discount code`,
      html: layout(`Speed Challenge complete! Your ${discount} off code inside.`, body),
      text: `Hi ${firstName}, you completed the Speed Challenge in ${seconds}s! Use code ${promoCode} for ${discount} off at ${APP_URL}/#pricing`,
      category: "Speed Challenge",
    })
  } catch (error) {
    console.error("Failed to send speed challenge email:", error)
  }
}

// ─── Gym Member Emails ────────────────────────────────────────────────────────

interface GymMemberEmailParams {
  memberEmail: string
  memberName: string
  gymName: string
  planTitle: string
  startDate: string
  endDate: string
}

export async function sendGymEnrollmentEmail({ memberEmail, memberName, gymName, planTitle, startDate, endDate }: GymMemberEmailParams) {
  const firstName = memberName.split(" ")[0] || memberName

  const body = `
  ${heroSection("💪", "linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)", `Welcome, ${firstName}!`, `Your membership at ${gymName} is now active.`)}

  <div style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      Your <strong>${planTitle}</strong> membership has been activated. Here are your details:
    </p>

    <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tr>
            <td style="font-size:13px;color:#6b7280;padding-bottom:10px;">Gym</td>
            <td align="right" style="font-size:14px;font-weight:700;color:#1a1a2e;padding-bottom:10px;">${gymName}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#6b7280;padding-bottom:10px;">Membership</td>
            <td align="right" style="font-size:14px;font-weight:700;color:#1a1a2e;padding-bottom:10px;">${planTitle}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#6b7280;padding-bottom:10px;">Start date</td>
            <td align="right" style="font-size:14px;font-weight:700;color:#1a1a2e;padding-bottom:10px;">${startDate}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#6b7280;">Valid until</td>
            <td align="right" style="font-size:14px;font-weight:700;color:#16a34a;">${endDate}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      See you at the gym! Contact your gym directly for any questions about your membership.
    </p>
  </div>`

  try {
    return await client.send({
      from: sender,
      to: [{ email: memberEmail }],
      subject: `Your ${gymName} membership is active 💪`,
      html: layout(`Welcome! Your ${planTitle} at ${gymName} starts today.`, body),
      text: `Hi ${firstName}, your ${planTitle} membership at ${gymName} is active from ${startDate} to ${endDate}.`,
      category: "Gym Membership",
    })
  } catch (error) {
    console.error("Failed to send gym enrollment email:", error)
  }
}

export async function sendGymRenewalEmail({ memberEmail, memberName, gymName, planTitle, startDate, endDate }: GymMemberEmailParams) {
  const firstName = memberName.split(" ")[0] || memberName

  const body = `
  ${heroSection("🔄", "linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)", "Membership Renewed!", `Your ${gymName} membership has been extended.`)}

  <div style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      Great news, ${firstName}! Your <strong>${planTitle}</strong> membership has been renewed.
    </p>

    <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;background:#eff6ff;border:1.5px solid #93c5fd;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tr>
            <td style="font-size:13px;color:#6b7280;padding-bottom:10px;">New start date</td>
            <td align="right" style="font-size:14px;font-weight:700;color:#1a1a2e;padding-bottom:10px;">${startDate}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#6b7280;">Valid until</td>
            <td align="right" style="font-size:14px;font-weight:700;color:#1d4ed8;">${endDate}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      Keep up the great work — see you at ${gymName}!
    </p>
  </div>`

  try {
    return await client.send({
      from: sender,
      to: [{ email: memberEmail }],
      subject: `Membership renewed at ${gymName} ✅`,
      html: layout(`Your ${planTitle} at ${gymName} has been renewed until ${endDate}.`, body),
      text: `Hi ${firstName}, your ${planTitle} at ${gymName} has been renewed. Valid until ${endDate}.`,
      category: "Gym Membership",
    })
  } catch (error) {
    console.error("Failed to send gym renewal email:", error)
  }
}

export async function sendGymExpiryReminderEmail({ memberEmail, memberName, gymName, planTitle, endDate }: Omit<GymMemberEmailParams, "startDate"> & { startDate?: string }, daysLeft: number) {
  const firstName = memberName.split(" ")[0] || memberName
  const urgency = daysLeft <= 1 ? "🚨" : "⏰"
  const urgencyText = daysLeft === 0 ? "expires today" : daysLeft === 1 ? "expires tomorrow" : `expires in ${daysLeft} days`

  const body = `
  ${heroSection(urgency, "linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)", `Your membership ${urgencyText}`, `${gymName} — ${planTitle}`)}

  <div style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      Hi ${firstName}, your <strong>${planTitle}</strong> membership at <strong>${gymName}</strong> ${urgencyText} on <strong>${endDate}</strong>.
    </p>

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      Contact your gym to renew and keep your fitness streak going!
    </p>

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      This is an automated reminder from your gym's management system.
    </p>
  </div>`

  try {
    return await client.send({
      from: sender,
      to: [{ email: memberEmail }],
      subject: `${urgency} Your ${gymName} membership ${urgencyText}`,
      html: layout(`Your ${planTitle} at ${gymName} ${urgencyText} — contact your gym to renew.`, body),
      text: `Hi ${firstName}, your ${planTitle} at ${gymName} ${urgencyText} on ${endDate}. Contact your gym to renew.`,
      category: "Gym Reminder",
    })
  } catch (error) {
    console.error("Failed to send gym expiry reminder:", error)
  }
}

// ─── Gym Plan Email ───────────────────────────────────────────────────────────

export async function sendGymPlanEmail({
  memberEmail, memberName, gymName, workoutPlan, dietPlan,
}: {
  memberEmail: string
  memberName: string
  gymName: string
  workoutPlan?: any
  dietPlan?: any
}) {
  const firstName = memberName.split(" ")[0] || memberName

  const workoutHtml = workoutPlan?.sessions?.length ? `
    <h2 style="font-size:18px;font-weight:700;color:#1a1a2e;margin:32px 0 8px">💪 Workout Plan</h2>
    ${workoutPlan.goal ? `<p style="color:#666;margin:0 0 16px">Goal: <strong>${workoutPlan.goal}</strong></p>` : ""}
    ${(workoutPlan.sessions as any[]).map((s: any) => `
      <h3 style="font-size:15px;font-weight:700;margin:20px 0 8px;color:#1a1a2e">${s.name || "Workout"} <span style="font-size:12px;color:#9ca3af;font-weight:400;text-transform:capitalize">(${s.type})</span></h3>
      ${s.exercises?.length ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:8px">
          <tr style="background:#f9fafb">
            ${["Exercise","Sets","Reps","Weight","Rest"].map((h) => `<th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#555;border-bottom:1px solid #e5e7eb">${h}</th>`).join("")}
          </tr>
          ${s.exercises.map((e: any) => `<tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:8px 12px;font-size:13px">${e.name}</td>
            <td style="padding:8px 12px;font-size:13px;text-align:center">${e.sets}</td>
            <td style="padding:8px 12px;font-size:13px;text-align:center">${e.reps}</td>
            <td style="padding:8px 12px;font-size:13px;text-align:center">${e.weight || "—"}</td>
            <td style="padding:8px 12px;font-size:13px;text-align:center">${e.rest}</td>
          </tr>`).join("")}
        </table>` : ""}
      ${s.notes ? `<p style="font-size:12px;color:#9ca3af;font-style:italic;margin:4px 0 0">${s.notes}</p>` : ""}
    `).join("")}
    ${workoutPlan.notes ? `<p style="font-size:13px;color:#666;margin:12px 0 0;font-style:italic">Note: ${workoutPlan.notes}</p>` : ""}
  ` : ""

  const macroBar = (label: string, grams: number, cal: number, color: string) =>
    `<td style="text-align:center;padding:12px">
      <div style="font-size:22px;font-weight:700;color:${color}">${grams}g</div>
      <div style="font-size:11px;color:#666;margin-top:2px">${label}</div>
      <div style="font-size:11px;color:#9ca3af">${cal} kcal</div>
    </td>`

  const dietHtml = dietPlan ? `
    <h2 style="font-size:18px;font-weight:700;color:#1a1a2e;margin:32px 0 8px">🥗 Diet Plan</h2>
    ${dietPlan.goal ? `<p style="color:#666;margin:0 0 16px">Goal: <strong>${dietPlan.goal}</strong></p>` : ""}
    <table width="100%" style="background:#f0fdf4;border-radius:8px;margin-bottom:20px;border:1px solid #bbf7d0" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align:center;padding:16px 12px;border-right:1px solid #bbf7d0">
          <div style="font-size:28px;font-weight:800;color:#16a34a">${dietPlan.totalCalories}</div>
          <div style="font-size:12px;color:#666">Daily Calories</div>
        </td>
        ${macroBar("Protein", dietPlan.protein, Math.round(dietPlan.protein * 4), "#2563eb")}
        ${macroBar("Carbs", dietPlan.carbs, Math.round(dietPlan.carbs * 4), "#d97706")}
        ${macroBar("Fat", dietPlan.fat, Math.round(dietPlan.fat * 9), "#dc2626")}
      </tr>
    </table>
    ${dietPlan.meals?.length ? `
      ${dietPlan.meals.map((m: any) => `
        <div style="margin-bottom:12px;padding:14px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
          <div style="font-weight:700;font-size:14px">${m.name}${m.time ? ` <span style="font-weight:400;color:#9ca3af;font-size:12px">· ${m.time}</span>` : ""}</div>
          ${m.calories ? `<div style="font-size:12px;color:#666;margin-top:2px">${m.calories} kcal · Protein ${m.protein || 0}g · Carbs ${m.carbs || 0}g · Fat ${m.fat || 0}g</div>` : ""}
          ${m.foods?.length ? `<ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#374151">${m.foods.filter(Boolean).map((f: string) => `<li style="margin-bottom:2px">${f}</li>`).join("")}</ul>` : ""}
        </div>
      `).join("")}
    ` : ""}
    ${dietPlan.notes ? `<p style="font-size:13px;color:#666;margin:12px 0 0;font-style:italic">Note: ${dietPlan.notes}</p>` : ""}
  ` : ""

  return client.send({
    from: sender,
    to: [{ email: memberEmail, name: memberName }],
    subject: `Your Personalised Plan from ${gymName}`,
    html: layout(`Your plan from ${gymName} is ready`, `
      <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Hey ${firstName}! 👋</h1>
      <p style="color:#555;margin:0 0 24px">Your trainer at <strong>${gymName}</strong> has prepared a personalised plan for you. Follow it consistently for best results!</p>
      ${workoutHtml}
      ${dietHtml}
      <p style="margin:32px 0 0;color:#9ca3af;font-size:12px">Stay consistent, stay strong. 💪</p>
    `),
  })
}

// ─── Legacy shim (used by existing webhook code) ─────────────────────────────

export async function sendPaymentEmail(
  toEmail: string,
  plan: string,
  amount: number,
  status: "SUCCESS" | "FAILED"
) {
  if (status === "SUCCESS") {
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    return sendPaymentSuccessEmail(toEmail, "", plan as "base" | "pro", amount, expires)
  }
  return sendPaymentFailedEmail(toEmail, "", plan)
}
