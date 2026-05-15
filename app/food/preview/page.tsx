"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin, Globe, Loader2, X, Bell, Zap,
  CalendarCheck, MessageSquare, CheckCheck, PhoneCall,
  Clock, CheckCircle, XCircle, Users, Inbox,
  ChevronRight, UtensilsCrossed,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { track } from "@/lib/analytics"
import Link from "next/link"

// ─── Types ───────────────────────────────────────────────────────────────────

type BookingStatus = "pending" | "confirmed" | "cancelled"
type LeadStatus = "new" | "contacted" | "converted"

interface TableBooking {
  id: string; name: string; phone: string
  guests: number; date: string; time: string
  notes: string; status: BookingStatus
}
interface RestaurantLead {
  id: string; name: string; phone: string
  enquiryDate: string; source: string; status: LeadStatus
  message?: string
}

// ─── Demo data ────────────────────────────────────────────────────────────────

function makeDate(offsetDays: number) {
  const d = new Date(); d.setDate(d.getDate() + offsetDays); return d.toISOString().slice(0, 10)
}
function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}
function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const INIT_BOOKINGS: TableBooking[] = [
  { id: "bk1", name: "Rahul Sharma",  phone: "9876543210", guests: 4, date: makeDate(1),  time: "7:30 PM", notes: "Anniversary dinner — please arrange flowers", status: "confirmed" },
  { id: "bk2", name: "Priya Mehta",   phone: "9123456789", guests: 2, date: makeDate(1),  time: "8:00 PM", notes: "", status: "pending" },
  { id: "bk3", name: "Amit Patel",    phone: "9988776655", guests: 6, date: makeDate(2),  time: "7:00 PM", notes: "Birthday celebration", status: "pending" },
  { id: "bk4", name: "Sunita Rao",    phone: "9871234560", guests: 3, date: makeDate(0),  time: "8:30 PM", notes: "", status: "confirmed" },
  { id: "bk5", name: "Vikram Singh",  phone: "9845671230", guests: 2, date: makeDate(-1), time: "7:00 PM", notes: "", status: "cancelled" },
]
const INIT_LEADS: RestaurantLead[] = [
  { id: "l1", name: "Arun Kumar",  phone: "9870123456", enquiryDate: makeDate(0),  source: "Website", status: "new",       message: "Do you have a private dining area for 20 people?" },
  { id: "l2", name: "Deepa Singh", phone: "9765432100", enquiryDate: makeDate(-1), source: "Website", status: "new",       message: "What are your veg options?" },
  { id: "l3", name: "Raj Verma",   phone: "9812345678", enquiryDate: makeDate(-2), source: "WhatsApp", status: "contacted", message: "Catering inquiry for corporate event" },
  { id: "l4", name: "Meena Shah",  phone: "9988001122", enquiryDate: makeDate(-4), source: "Website", status: "converted", message: "Booked for 8 guests on Saturday" },
]

// ─── Status badges ────────────────────────────────────────────────────────────

function BookingBadge({ status }: { status: BookingStatus }) {
  if (status === "confirmed") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap"><CheckCircle className="w-3 h-3" />Confirmed</span>
  if (status === "cancelled") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap"><XCircle className="w-3 h-3" />Cancelled</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 whitespace-nowrap"><Clock className="w-3 h-3" />Pending</span>
}
function LeadBadge({ status }: { status: LeadStatus }) {
  if (status === "new") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">New</span>
  if (status === "contacted") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Contacted</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCheck className="w-3 h-3" />Converted</span>
}

// ─── Main Preview ─────────────────────────────────────────────────────────────

type Tab = "bookings" | "leads"

const ACCENT = "#e63946"
const ACCENT_LIGHT = "#fff5f5"
const ACCENT_BORDER = "#fecaca"

function RestaurantPreview() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const params = useSearchParams()
  const restaurantName = params.get("name") || "Your Restaurant"
  const mapsUrl = params.get("url") || ""

  const [bookings, setBookings] = useState<TableBooking[]>(INIT_BOOKINGS)
  const [leads, setLeads] = useState<RestaurantLead[]>(INIT_LEADS)
  const [activeTab, setActiveTab] = useState<Tab>("bookings")
  const [tabClicks, setTabClicks] = useState(0)

  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [showLoginBanner, setShowLoginBanner] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const hasRedirected = useRef(false)
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return; hasTracked.current = true
    track("restaurant_console_viewed", { restaurantName, hasMapsUrl: !!mapsUrl })
  }, [restaurantName, mapsUrl])

  useEffect(() => {
    const t = setTimeout(() => { if (!bannerDismissed) { setShowLoginBanner(true) } }, 10000)
    return () => clearTimeout(t)
  }, [bannerDismissed])

  useEffect(() => {
    if (tabClicks >= 2 && !bannerDismissed) setShowLoginBanner(true)
  }, [tabClicks, bannerDismissed])

  useEffect(() => {
    if (session && !hasRedirected.current && sessionStatus === "authenticated") {
      hasRedirected.current = true
      track("restaurant_authenticated", { restaurantName })
      if (mapsUrl) {
        fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: mapsUrl }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.jobId) {
              localStorage.setItem("challenge_start_time", Date.now().toString())
              localStorage.setItem("challenge_site_id", data.jobId)
            }
            router.push("/my-sites?from=restaurants")
          })
          .catch(() => router.push("/my-sites?from=restaurants"))
      } else {
        fetch("/api/sites/create-template", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gymName: restaurantName }),
        })
          .then(() => router.push("/my-sites?from=restaurants"))
          .catch(() => router.push("/my-sites?from=restaurants"))
      }
    }
  }, [session, sessionStatus, restaurantName, mapsUrl, router])

  const handleTab = (tab: Tab) => { setActiveTab(tab); setTabClicks(c => c + 1); track("restaurant_tab_clicked", { tab }) }
  const handleConfirm = (id: string) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "confirmed" as BookingStatus } : b))
  const handleCancel = (id: string) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" as BookingStatus } : b))
  const handleMarkContacted = (id: string) => setLeads(prev => prev.map(l => l.id === id ? { ...l, status: "contacted" as LeadStatus } : l))
  const openLogin = (source: string) => { track("restaurant_signup_clicked", { source }); setLoginModalOpen(true) }

  const pending = bookings.filter(b => b.status === "pending").length
  const newLeads = leads.filter(l => l.status === "new").length

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { key: "bookings", label: "Table Bookings", icon: CalendarCheck, badge: pending || undefined },
    { key: "leads",    label: "Leads",          icon: Inbox,         badge: newLeads || undefined },
  ]

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} accent="red" />

      <div className="min-h-screen bg-gray-50 flex flex-col pb-28">

        {/* Free website banner */}
        <div className="text-white px-4 py-2.5" style={{ background: `linear-gradient(90deg, ${ACCENT}, #f4a261)` }}>
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Globe className="w-4 h-4 shrink-0" />
              <span>🎉 <span className="font-black">{restaurantName}</span>&apos;s free website is ready!</span>
            </div>
            <Link
              href={`/food/template?name=${encodeURIComponent(restaurantName)}${mapsUrl ? `&url=${encodeURIComponent(mapsUrl)}` : ""}`}
              onClick={() => track("restaurant_edit_website_clicked", { restaurantName })}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg px-3 py-1.5 text-xs font-black transition-colors shrink-0"
            >
              ✏️ Edit Your Website
            </Link>
          </div>
        </div>

        {/* Sticky nav */}
        <div className="bg-white border-b border-border px-4 h-12 flex items-center justify-between sticky top-0 z-30">
          <Link href="/food" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: ACCENT }}>
              <UtensilsCrossed className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm hidden sm:block">MapToSite <span style={{ color: ACCENT }}>Food</span></span>
          </Link>
          {sessionStatus !== "loading" && !session && (
            <Button size="sm" onClick={() => openLogin("nav")} className="h-8 text-xs font-bold px-3 text-white" style={{ background: ACCENT }}>
              Sign up free
            </Button>
          )}
        </div>

        {/* Console */}
        <div className="flex-1 px-3 sm:px-4 py-5">
          <div className="max-w-5xl mx-auto">
            <div className="mb-4">
              <h1 className="text-lg font-black">{restaurantName}</h1>
              <p className="text-xs text-muted-foreground">Your restaurant management console — table bookings &amp; leads</p>
            </div>

            <div className="rounded-2xl border border-border shadow-xl overflow-hidden bg-white">
              {/* Browser chrome */}
              <div className="bg-gray-100 px-3 py-2 border-b border-border flex items-center gap-2.5">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-2.5 py-0.5 text-xs text-muted-foreground font-mono hidden sm:block truncate border border-gray-200">
                  maptosite.app/console/{restaurantName.toLowerCase().replace(/\s+/g, "-")}
                </div>
                <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-auto sm:ml-0">Preview</span>
              </div>

              {/* Console header */}
              <div className="border-b border-border bg-white px-4 h-12 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: ACCENT }}>
                  <UtensilsCrossed className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm">{restaurantName}</span>
                <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full font-medium hidden sm:inline">Console</span>
                <div className="ml-auto flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-xs text-green-600 font-semibold hidden sm:block">Live</span></div>
              </div>

              {/* Tabs */}
              <div className="border-b border-border bg-white overflow-x-auto scrollbar-none">
                <div className="flex min-w-max">
                  {tabs.map(({ key, label, icon: Icon, badge }) => (
                    <button key={key} onClick={() => handleTab(key)}
                      className={`relative flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${activeTab === key ? "border-b-2 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-gray-50"}`}
                      style={activeTab === key ? { borderColor: ACCENT, color: ACCENT } : {}}>
                      <Icon className="w-4 h-4" />{label}
                      {badge ? <span className="absolute top-2 right-2 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: ACCENT }}>{badge}</span> : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="p-4 sm:p-5 space-y-4 bg-white">

                {/* ── BOOKINGS ── */}
                {activeTab === "bookings" && (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { label: "Today",     value: bookings.filter(b => b.date === makeDate(0)).length,  color: "text-foreground",  bg: "bg-gray-50",    border: "border-gray-200" },
                        { label: "Pending",   value: bookings.filter(b => b.status === "pending").length,  color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
                        { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200" },
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 sm:p-4`}>
                          <p className={`text-xs font-semibold ${s.color} mb-1`}>{s.label}</p>
                          <p className="text-2xl sm:text-3xl font-black">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Info strip */}
                    <div className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: ACCENT_LIGHT, border: `1px solid ${ACCENT_BORDER}` }}>
                      <Globe className="w-4 h-4 shrink-0 mt-0.5" style={{ color: ACCENT }} />
                      <p className="text-xs leading-relaxed" style={{ color: ACCENT }}>
                        <span className="font-bold">Table bookings come from your restaurant website automatically.</span> Every "Book Table" form submission appears here in real time.
                      </p>
                    </div>

                    {/* Bookings list */}
                    <div className="space-y-2">
                      {bookings.map(booking => (
                        <motion.div key={booking.id} layout
                          className="border border-border rounded-xl p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0" style={{ background: ACCENT }}>
                              {booking.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <p className="font-bold text-sm">{booking.name}</p>
                                <BookingBadge status={booking.status} />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {booking.phone} · <Users className="w-3 h-3 inline" /> {booking.guests} guests · {fmtDate(booking.date)} at {booking.time}
                              </p>
                              {booking.notes && <p className="text-xs text-foreground/70 mt-1 italic">&ldquo;{booking.notes}&rdquo;</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <a href={`https://wa.me/91${booking.phone}?text=${encodeURIComponent(`Hi ${booking.name.split(" ")[0]}, your table booking at ${restaurantName} is confirmed for ${fmtDate(booking.date)} at ${booking.time}!`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-colors">
                              <MessageSquare className="w-3.5 h-3.5" />WhatsApp
                            </a>
                            <a href={`tel:${booking.phone}`} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
                              <PhoneCall className="w-3.5 h-3.5" />Call
                            </a>
                            {booking.status === "pending" && (
                              <>
                                <button onClick={() => handleConfirm(booking.id)}
                                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90" style={{ background: ACCENT }}>
                                  <CheckCircle className="w-3.5 h-3.5" />Confirm
                                </button>
                                <button onClick={() => handleCancel(booking.id)}
                                  className="h-8 px-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors text-xs">
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Feature cards */}
                    <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
                      {[
                        { icon: Bell,          title: "Instant notifications",  desc: "Get a WhatsApp ping the moment a table is booked on your website" },
                        { icon: CheckCircle,   title: "Auto-confirmation",      desc: "Guest receives a WhatsApp confirmation as soon as you confirm" },
                      ].map(f => (
                        <div key={f.title} className="rounded-xl p-3.5 flex items-start gap-3" style={{ background: ACCENT_LIGHT, border: `1px solid ${ACCENT_BORDER}` }}>
                          <f.icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: ACCENT }} />
                          <div><p className="text-xs font-bold">{f.title}</p><p className="text-xs text-muted-foreground mt-0.5 leading-snug">{f.desc}</p></div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ── LEADS ── */}
                {activeTab === "leads" && (
                  <>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { label: "New",       value: leads.filter(l => l.status === "new").length,       color: "text-blue-700",  bg: "bg-blue-50",  border: "border-blue-200" },
                        { label: "Contacted", value: leads.filter(l => l.status === "contacted").length, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
                        { label: "Converted", value: leads.filter(l => l.status === "converted").length, color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 sm:p-4`}>
                          <p className={`text-xs font-semibold ${s.color} mb-1`}>{s.label}</p>
                          <p className="text-2xl sm:text-3xl font-black">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: ACCENT_LIGHT, border: `1px solid ${ACCENT_BORDER}` }}>
                      <Globe className="w-4 h-4 shrink-0 mt-0.5" style={{ color: ACCENT }} />
                      <p className="text-xs leading-relaxed" style={{ color: ACCENT }}>
                        <span className="font-bold">All enquiries from your website are logged here automatically.</span> Private dining, catering, events — every message captured, nothing lost in chat.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {leads.map(lead => (
                        <motion.div key={lead.id} layout
                          className="border border-border rounded-xl p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0" style={{ background: ACCENT }}>
                              {lead.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <p className="font-bold text-sm">{lead.name}</p><LeadBadge status={lead.status} />
                                <span className="text-xs text-muted-foreground">{timeAgo(lead.enquiryDate)}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{lead.phone} · via {lead.source}</p>
                              {lead.message && <p className="text-xs text-foreground/70 mt-1 italic">&ldquo;{lead.message}&rdquo;</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <a href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent(`Hi ${lead.name.split(" ")[0]}, thanks for your enquiry at ${restaurantName}!`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-colors">
                              <MessageSquare className="w-3.5 h-3.5" />Chat
                            </a>
                            <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
                              <PhoneCall className="w-3.5 h-3.5" />Call
                            </a>
                            {lead.status === "new" && (
                              <button onClick={() => handleMarkContacted(lead.id)}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors">
                                <CheckCheck className="w-3.5 h-3.5" />Done
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Login banner */}
        <AnimatePresence>
          {showLoginBanner && !bannerDismissed && !session && (
            <motion.div initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-2xl">
              <div className="max-w-2xl mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: ACCENT_LIGHT }}>
                      <span className="text-lg">🍽️</span>
                    </div>
                    <div>
                      <p className="font-black text-sm">Book a demo and get <span style={{ color: ACCENT }}>50% off any plan</span></p>
                      <p className="text-xs text-muted-foreground mt-0.5">Or sign up free — <span className="font-semibold text-foreground">{restaurantName}</span> goes live in 60 seconds</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button onClick={() => openLogin("sticky_banner")} className="h-10 font-bold text-sm flex-1 sm:flex-none text-white" style={{ background: ACCENT }}>
                      <Zap className="w-4 h-4 mr-1.5" />Get 50% Off Now
                    </Button>
                    <a href={`https://wa.me/917452008033?text=${encodeURIComponent(`Hi! I want to book a demo for ${restaurantName} on MapToSite and claim the 50% off offer.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={() => track("restaurant_wa_clicked")}
                      className="h-10 px-4 flex items-center gap-1.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors flex-1 sm:flex-none justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366] shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Book Demo
                    </a>
                  </div>
                </div>
              </div>
              <button onClick={() => { setBannerDismissed(true); track("restaurant_nudge_dismissed") }} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default function RestaurantPreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
      <RestaurantPreview />
    </Suspense>
  )
}
