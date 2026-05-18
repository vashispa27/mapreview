"use client"

import { useState, useEffect } from "react"
import { BusinessData, ColorScheme, ServiceItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Phone, Instagram, Linkedin, Facebook, Twitter, Send, CheckCircle, CalendarDays, MessageSquare } from "lucide-react"

interface ContactPageProps {
  business: BusinessData
  colorScheme: ColorScheme
  fontClass: string
  prefilledService?: ServiceItem | null
}

// ─── Book Table form (food sites) ───────────────────────────────────────────
function BookTableForm({ business, colorScheme }: { business: BusinessData; colorScheme: ColorScheme }) {
  const today = new Date().toISOString().split("T")[0]
  const [form, setForm] = useState({ name: "", phone: "", guests: "2", date: "", time: "19:00", notes: "" })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          name: form.name,
          phone: form.phone,
          guests: Number(form.guests),
          date: form.date,
          time: form.time,
          notes: form.notes,
        }),
      })
    } catch { /* silent */ }
    setSending(false)
    setSubmitted(true)
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: `2px solid ${colorScheme.primary}25`,
    backgroundColor: colorScheme.background,
    color: colorScheme.text,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s",
  }

  if (submitted) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CheckCircle className="w-14 h-14 mb-4" style={{ color: colorScheme.primary }} />
      <h3 className="text-2xl font-bold mb-2">Booking Received!</h3>
      <p style={{ color: colorScheme.muted }}>We'll confirm your reservation soon. See you there!</p>
      <button onClick={() => setSubmitted(false)} className="mt-6 text-sm underline" style={{ color: colorScheme.primary }}>
        Make another booking
      </button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Your Name *</label>
          <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Priya Sharma" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = colorScheme.primary)}
            onBlur={e => (e.target.style.borderColor = colorScheme.primary + "25")} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Phone Number *</label>
          <input required value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = colorScheme.primary)}
            onBlur={e => (e.target.style.borderColor = colorScheme.primary + "25")} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Number of Guests *</label>
        <select required value={form.guests} onChange={e => set("guests", e.target.value)} style={inputStyle}
          onFocus={e => (e.target.style.borderColor = colorScheme.primary)}
          onBlur={e => (e.target.style.borderColor = colorScheme.primary + "25")}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
            <option key={n} value={String(n)}>{n} {n === 1 ? "Guest" : "Guests"}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Date *</label>
          <input required type="date" min={today} value={form.date} onChange={e => set("date", e.target.value)} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = colorScheme.primary)}
            onBlur={e => (e.target.style.borderColor = colorScheme.primary + "25")} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Preferred Time *</label>
          <input required type="time" value={form.time} onChange={e => set("time", e.target.value)} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = colorScheme.primary)}
            onBlur={e => (e.target.style.borderColor = colorScheme.primary + "25")} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Special Requests</label>
        <textarea rows={3} value={form.notes} onChange={e => set("notes", e.target.value)}
          placeholder="Allergies, occasion, seating preference..."
          className="resize-none"
          style={{ ...inputStyle }}
          onFocus={e => (e.target.style.borderColor = colorScheme.primary)}
          onBlur={e => (e.target.style.borderColor = colorScheme.primary + "25")} />
      </div>

      <button type="submit" disabled={sending}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
        style={{ backgroundColor: colorScheme.primary }}>
        <CalendarDays className="w-4 h-4" />
        {sending ? "Sending…" : "Confirm Booking"}
      </button>
    </form>
  )
}

// ─── Inquiry form (food sites) ────────────────────────────────────────────────
function InquiryForm({ business, colorScheme }: { business: BusinessData; colorScheme: ColorScheme }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: `2px solid ${colorScheme.primary}25`,
    backgroundColor: colorScheme.background,
    color: colorScheme.text,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          businessName: business.name,
          name: form.name,
          phone: form.phone,
          email: "",
          message: form.message,
        }),
      })
    } catch { /* silent */ }
    setSending(false)
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CheckCircle className="w-14 h-14 mb-4" style={{ color: colorScheme.primary }} />
      <h3 className="text-2xl font-bold mb-2">Enquiry Sent!</h3>
      <p style={{ color: colorScheme.muted }}>We'll get back to you shortly.</p>
      <button onClick={() => setSubmitted(false)} className="mt-6 text-sm underline" style={{ color: colorScheme.primary }}>
        Send another message
      </button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Your Name *</label>
          <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Priya Sharma" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = colorScheme.primary)}
            onBlur={e => (e.target.style.borderColor = colorScheme.primary + "25")} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Phone Number *</label>
          <input required value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = colorScheme.primary)}
            onBlur={e => (e.target.style.borderColor = colorScheme.primary + "25")} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Message *</label>
        <textarea required rows={5} value={form.message} onChange={e => set("message", e.target.value)}
          placeholder="Tell us what you need, any questions about the menu, events..."
          className="resize-none"
          style={{ ...inputStyle }}
          onFocus={e => (e.target.style.borderColor = colorScheme.primary)}
          onBlur={e => (e.target.style.borderColor = colorScheme.primary + "25")} />
      </div>
      <button type="submit" disabled={sending}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
        style={{ backgroundColor: colorScheme.primary }}>
        <Send className="w-4 h-4" />
        {sending ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  )
}

// ─── Restaurant contact page (tabbed) ─────────────────────────────────────────
function RestaurantContactPage({ business, colorScheme, fontClass }: { business: BusinessData; colorScheme: ColorScheme; fontClass: string }) {
  const [tab, setTab] = useState<"booking" | "inquiry">("booking")
  const socials = business.socials ?? {}

  return (
    <div className={cn("min-h-screen py-16", fontClass)} style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Get in Touch</h1>
          <p className="text-base max-w-sm mx-auto" style={{ color: colorScheme.muted }}>
            Book a table or send us a message — we&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Left — contact info */}
          <div className="md:col-span-2 space-y-4">
            {business.phone && (
              <a href={`tel:${business.phone}`}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 hover:scale-[1.02] transition-all"
                style={{ borderColor: colorScheme.primary + "25" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colorScheme.primary }}>
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: colorScheme.muted }}>Call us</p>
                  <p className="font-bold">{business.phone}</p>
                </div>
              </a>
            )}
            <div className="space-y-3">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:opacity-80 transition"
                  style={{ borderColor: colorScheme.primary + "20" }}>
                  <Instagram className="w-5 h-5" style={{ color: colorScheme.primary }} />
                  <span className="text-sm font-medium">Instagram</span>
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

          {/* Right — tabbed forms */}
          <div className="md:col-span-3">
            {/* Tab toggle */}
            <div className="flex rounded-xl overflow-hidden border mb-6" style={{ borderColor: colorScheme.primary + "30" }}>
              {([
                { key: "booking", label: "Book a Table", icon: CalendarDays },
                { key: "inquiry", label: "Send Enquiry", icon: MessageSquare },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button key={key} type="button" onClick={() => setTab(key)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all"
                  style={tab === key
                    ? { backgroundColor: colorScheme.primary, color: "#fff" }
                    : { backgroundColor: "transparent", color: colorScheme.muted }
                  }>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>

            {tab === "booking"
              ? <BookTableForm business={business} colorScheme={colorScheme} />
              : <InquiryForm business={business} colorScheme={colorScheme} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dispatcher ─────────────────────────────────────────────────────────────
export function ContactPage(props: ContactPageProps) {
  if (props.business.isGym === false) {
    return <RestaurantContactPage business={props.business} colorScheme={props.colorScheme} fontClass={props.fontClass} />
  }
  return <GymContactForm {...props} />
}

function GymContactForm({ business, colorScheme, fontClass, prefilledService }: ContactPageProps) {
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

  useEffect(() => {
    if (!prefilledService) return
    setForm(prev => ({
      ...prev,
      service: prefilledService.title,
      message: prefilledService.id === "cart"
        ? `I'd like to order:\n${prefilledService.price}`
        : prefilledService.id === "booking"
        ? prefilledService.price ?? ""
        : `I'd like to book: ${prefilledService.title}${prefilledService.price ? ` (${prefilledService.price})` : ""}`,
    }))
  }, [prefilledService?.id])

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
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
            <div className="space-y-3">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:opacity-80 transition" style={{ borderColor: colorScheme.primary + "20" }}>
                  <Instagram className="w-5 h-5" style={{ color: colorScheme.primary }} /><span className="text-sm font-medium">Instagram</span>
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:opacity-80 transition" style={{ borderColor: colorScheme.primary + "20" }}>
                  <Linkedin className="w-5 h-5" style={{ color: colorScheme.primary }} /><span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:opacity-80 transition" style={{ borderColor: colorScheme.primary + "20" }}>
                  <Facebook className="w-5 h-5" style={{ color: colorScheme.primary }} /><span className="text-sm font-medium">Facebook</span>
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:opacity-80 transition" style={{ borderColor: colorScheme.primary + "20" }}>
                  <Twitter className="w-5 h-5" style={{ color: colorScheme.primary }} /><span className="text-sm font-medium">Twitter / X</span>
                </a>
              )}
            </div>
          </div>

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
                    <input value={form.service} onChange={(e) => set("service", e.target.value)} placeholder="e.g. Personal Training"
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-colors"
                      style={{ borderColor: colorScheme.primary + "25", backgroundColor: colorScheme.background, color: colorScheme.text }}
                      onFocus={(e) => e.target.style.borderColor = colorScheme.primary}
                      onBlur={(e) => e.target.style.borderColor = colorScheme.primary + "25"} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: colorScheme.muted }}>Message *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => set("message", e.target.value)}
                    placeholder="Tell us what you need..."
                    className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-colors resize-none"
                    style={{ borderColor: colorScheme.primary + "25", backgroundColor: colorScheme.background, color: colorScheme.text }}
                    onFocus={(e) => e.target.style.borderColor = colorScheme.primary}
                    onBlur={(e) => e.target.style.borderColor = colorScheme.primary + "25"} />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                  style={{ backgroundColor: colorScheme.primary }}>
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
