"use client"

import { useState } from "react"
import { BusinessData, ColorScheme, ServiceItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Phone, Instagram, Linkedin, Facebook, Twitter, Send, CheckCircle } from "lucide-react"

interface ContactPageProps {
  business: BusinessData
  colorScheme: ColorScheme
  fontClass: string
  prefilledService?: ServiceItem | null
}

export function ContactPage({ business, colorScheme, fontClass, prefilledService }: ContactPageProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: prefilledService?.title ?? "",
    message: prefilledService
      ? prefilledService.id === "cart"
        ? `I'd like to order:\n${prefilledService.price}`
        : `I'd like to book: ${prefilledService.title}${prefilledService.price ? ` (${prefilledService.price})` : ""}`
      : "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // POST to contact API — graceful even if it fails
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id, businessName: business.name, ...form }),
      })
    } catch { /* silent */ }
    setSending(false)
    setSubmitted(true)
  }

  const socials = business.socials ?? {}

  return (
    <div className={cn("min-h-screen py-16", fontClass)} style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: colorScheme.primary + "18", color: colorScheme.primary }}>
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg max-w-md mx-auto" style={{ color: colorScheme.muted }}>
            We'd love to hear from you. Fill in the form and we'll get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Left — contact info */}
          <div className="md:col-span-2 space-y-6">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="flex items-center gap-4 p-4 rounded-2xl border-2 hover:border-opacity-50 transition-all group" style={{ borderColor: colorScheme.primary + "25" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colorScheme.primary }}>
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: colorScheme.muted }}>Call us</p>
                  <p className="font-bold">{business.phone}</p>
                </div>
              </a>
            )}

            {/* Social links */}
            <div className="space-y-3">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:opacity-80 transition"
                  style={{ borderColor: colorScheme.primary + "20" }}>
                  <Instagram className="w-5 h-5" style={{ color: colorScheme.primary }} />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:opacity-80 transition"
                  style={{ borderColor: colorScheme.primary + "20" }}>
                  <Linkedin className="w-5 h-5" style={{ color: colorScheme.primary }} />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:opacity-80 transition"
                  style={{ borderColor: colorScheme.primary + "20" }}>
                  <Facebook className="w-5 h-5" style={{ color: colorScheme.primary }} />
                  <span className="text-sm font-medium">Facebook</span>
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:opacity-80 transition"
                  style={{ borderColor: colorScheme.primary + "20" }}>
                  <Twitter className="w-5 h-5" style={{ color: colorScheme.primary }} />
                  <span className="text-sm font-medium">Twitter / X</span>
                </a>
              )}
            </div>
          </div>

          {/* Right — inquiry form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <CheckCircle className="w-16 h-16 mb-4" style={{ color: colorScheme.primary }} />
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p style={{ color: colorScheme.muted }}>We'll get back to you as soon as possible.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm underline" style={{ color: colorScheme.primary }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name *" value={form.name} onChange={(v) => set("name", v)} placeholder="Your name" required colorScheme={colorScheme} />
                  <Field label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="your@email.com" required colorScheme={colorScheme} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+1 555 000 0000" colorScheme={colorScheme} />
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Service / Inquiry</label>
                    <input
                      value={form.service}
                      onChange={(e) => set("service", e.target.value)}
                      placeholder="e.g. Haircut, Personal Training"
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-colors"
                      style={{ borderColor: colorScheme.primary + "25", backgroundColor: colorScheme.background, color: colorScheme.text }}
                      onFocus={(e) => e.target.style.borderColor = colorScheme.primary}
                      onBlur={(e) => e.target.style.borderColor = colorScheme.primary + "25"}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Tell us what you need..."
                    className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-colors resize-none"
                    style={{ borderColor: colorScheme.primary + "25", backgroundColor: colorScheme.background, color: colorScheme.text }}
                    onFocus={(e) => e.target.style.borderColor = colorScheme.primary}
                    onBlur={(e) => e.target.style.borderColor = colorScheme.primary + "25"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                  style={{ backgroundColor: colorScheme.primary }}
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = "text", required, colorScheme }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; required?: boolean; colorScheme: ColorScheme
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>{label}</label>
      <input
        type={type} required={required} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-colors"
        style={{ borderColor: colorScheme.primary + "25", backgroundColor: colorScheme.background, color: colorScheme.text }}
        onFocus={(e) => e.target.style.borderColor = colorScheme.primary}
        onBlur={(e) => e.target.style.borderColor = colorScheme.primary + "25"}
      />
    </div>
  )
}
