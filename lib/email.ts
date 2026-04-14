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
  const amountFormatted = `$${(amount / 100).toFixed(2)}`
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
              <td style="padding-top:10px;font-size:13px;color:#6b7280;">${expiryFormatted ? "Valid until" : "Billing"}</td>
              <td align="right" style="padding-top:10px;font-size:14px;font-weight:700;color:#1a1a2e;">${expiryFormatted ?? "Monthly · renews automatically"}</td>
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
