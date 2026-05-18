"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  UtensilsCrossed, Loader2, ChevronLeft, MessageSquare,
  PhoneCall, CheckCheck, Inbox, CalendarCheck, Clock, CheckCircle,
  XCircle, Users, Plus, X, ExternalLink,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ACCENT = "#e63946"

// ─── Types ────────────────────────────────────────────────────────────────────

type LeadStatus = "new" | "contacted" | "converted"
type BookingStatus = "pending" | "confirmed" | "cancelled"

interface Lead {
  id: string; name: string; phone: string; email?: string | null
  message?: string | null; source: string; status: LeadStatus
  enquiryDate: string
}
interface Booking {
  id: string; name: string; phone: string
  guests: number; date: string; time: string
  notes: string; status: BookingStatus
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function LeadBadge({ status }: { status: LeadStatus }) {
  if (status === "new") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">New</span>
  if (status === "contacted") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Contacted</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCheck className="w-3 h-3" />Converted</span>
}
function BookingBadge({ status }: { status: BookingStatus }) {
  if (status === "confirmed") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Confirmed</span>
  if (status === "cancelled") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Cancelled</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="w-3 h-3" />Pending</span>
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
function timeAgo(d: string) {
  const diff = (Date.now() - new Date(d).getTime()) / 1000
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ─── Add Lead Modal ───────────────────────────────────────────────────────────

function AddLeadModal({ siteId, onAdd, onClose }: { siteId: string; onAdd: (l: Lead) => void; onClose: () => void }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/console/${siteId}/leads`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message, source: "Walk-in" }),
      })
      const data = await res.json()
      if (data.lead) { onAdd({ ...data.lead, status: "new" as LeadStatus }); onClose() }
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full sm:max-w-md bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl border border-border z-10 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-black">Add Lead</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Name *</label>
            <Input placeholder="Customer name" value={name} onChange={e => setName(e.target.value)} className="h-11" autoFocus />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Phone *</label>
            <Input type="tel" placeholder="10-digit mobile" value={phone} onChange={e => setPhone(e.target.value)} className="h-11" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Note (optional)</label>
            <Input placeholder="e.g. Interested in private dining" value={message} onChange={e => setMessage(e.target.value)} className="h-11" />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" className="flex-1 h-11" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 h-11 font-bold text-white" style={{ background: ACCENT }}
            disabled={!name.trim() || !phone.trim() || saving} onClick={handleSave}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Add Lead
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Console ──────────────────────────────────────────────────────────────────

type Tab = "leads" | "bookings"

function RestaurantConsole() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const params = useParams()
  const siteId = params.siteId as string

  const [siteName, setSiteName] = useState("")
  const [siteSlug, setSiteSlug] = useState("")
  const [leads, setLeads] = useState<Lead[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("leads")
  const [loading, setLoading] = useState(true)
  const [showAddLead, setShowAddLead] = useState(false)
  const [leadSearch, setLeadSearch] = useState("")
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (sessionStatus === "loading") return
    if (!session) { router.push("/food/sites"); return }
    if (hasLoaded.current) return
    hasLoaded.current = true

    const load = async () => {
      try {
        const [siteRes, leadsRes, bookingsRes] = await Promise.all([
          fetch(`/api/sites/${siteId}`),
          fetch(`/api/console/${siteId}/leads`),
          fetch(`/api/console/${siteId}/bookings`),
        ])
        if (!siteRes.ok) { router.push("/food/sites"); return }
        const siteData = await siteRes.json()
        setSiteName(siteData.businessName || siteData.businessData?.name || "Your Restaurant")
        setSiteSlug(siteData.slug || siteId)
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json()
          setLeads(leadsData.leads || [])
        }
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          setBookings(bookingsData.bookings || [])
        }
      } catch { router.push("/food/sites") }
      finally { setLoading(false) }
    }
    load()
  }, [session, sessionStatus, siteId, router])

  const handleMarkContacted = async (id: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: "contacted" as LeadStatus } : l))
    await fetch(`/api/console/${siteId}/leads/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "contacted" }),
    }).catch(() => {})
  }

  const handleMarkConverted = async (id: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: "converted" as LeadStatus } : l))
    await fetch(`/api/console/${siteId}/leads/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "converted" }),
    }).catch(() => {})
  }

  const handleBookingStatus = async (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    await fetch(`/api/console/${siteId}/bookings/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {})
  }

  const filteredLeads = leads.filter(l =>
    !leadSearch || l.name.toLowerCase().includes(leadSearch.toLowerCase()) || l.phone.includes(leadSearch)
  )

  const newLeads = leads.filter(l => l.status === "new").length
  const pendingBookings = bookings.filter(b => b.status === "pending").length

  if (sessionStatus === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
  }

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { key: "leads", label: "Leads", icon: Inbox, badge: newLeads || undefined },
    { key: "bookings", label: "Table Bookings", icon: CalendarCheck, badge: pendingBookings || undefined },
  ]

  return (
    <>
      {showAddLead && <AddLeadModal siteId={siteId} onAdd={l => setLeads(prev => [l, ...prev])} onClose={() => setShowAddLead(false)} />}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-border sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
            <Link href="/food/sites" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
              <ChevronLeft className="w-4 h-4" />Food Sites
            </Link>
            <span className="text-muted-foreground">/</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: ACCENT }}>
                <UtensilsCrossed className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm truncate">{siteName}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-600 font-semibold hidden sm:block">Live</span>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" asChild>
                <Link href={`/site/${siteSlug}`} target="_blank">
                  <ExternalLink className="w-3.5 h-3.5" />View Site
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6">
          {/* Page title */}
          <div className="mb-5">
            <h1 className="text-xl font-black">{siteName}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Restaurant console — leads &amp; table bookings</p>
          </div>

          {/* Console card */}
          <div className="rounded-2xl border border-border shadow-sm overflow-hidden bg-white">
            {/* Tabs */}
            <div className="border-b border-border bg-white overflow-x-auto">
              <div className="flex min-w-max">
                {tabs.map(({ key, label, icon: Icon, badge }) => (
                  <button key={key} onClick={() => setActiveTab(key)}
                    className={`relative flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                      activeTab === key ? "border-b-2 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-gray-50"
                    }`}
                    style={activeTab === key ? { borderColor: ACCENT, color: ACCENT } : {}}>
                    <Icon className="w-4 h-4" />{label}
                    {badge ? <span className="absolute top-2 right-2 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: ACCENT }}>{badge}</span> : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4">

              {/* ── LEADS TAB ── */}
              {activeTab === "leads" && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { label: "New",       value: leads.filter(l => l.status === "new").length,       bg: "bg-blue-50",  border: "border-blue-200",  color: "text-blue-700" },
                      { label: "Contacted", value: leads.filter(l => l.status === "contacted").length, bg: "bg-amber-50", border: "border-amber-200", color: "text-amber-700" },
                      { label: "Converted", value: leads.filter(l => l.status === "converted").length, bg: "bg-green-50", border: "border-green-200", color: "text-green-700" },
                    ].map(s => (
                      <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 sm:p-4`}>
                        <p className={`text-xs font-semibold ${s.color} mb-1`}>{s.label}</p>
                        <p className="text-2xl sm:text-3xl font-black">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Toolbar */}
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search by name or phone…" value={leadSearch}
                      onChange={e => setLeadSearch(e.target.value)} className="h-9 text-sm flex-1" />
                    <Button size="sm" className="h-9 text-white shrink-0" style={{ background: ACCENT }}
                      onClick={() => setShowAddLead(true)}>
                      <Plus className="w-4 h-4 mr-1" />Add Lead
                    </Button>
                  </div>

                  {/* Leads list */}
                  {filteredLeads.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">{leads.length === 0 ? "No leads yet — enquiries from your website appear here" : "No results"}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredLeads.map(lead => (
                        <motion.div key={lead.id} layout
                          className="border border-border rounded-xl p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0" style={{ background: ACCENT }}>
                              {lead.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <p className="font-bold text-sm">{lead.name}</p>
                                <LeadBadge status={lead.status} />
                                <span className="text-xs text-muted-foreground">{timeAgo(lead.enquiryDate)}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{lead.phone}{lead.email ? ` · ${lead.email}` : ""} · via {lead.source}</p>
                              {lead.message && <p className="text-xs text-foreground/70 mt-1 italic">&ldquo;{lead.message}&rdquo;</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            <a href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent(`Hi ${lead.name.split(" ")[0]}, thanks for your enquiry at ${siteName}!`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-colors">
                              <MessageSquare className="w-3.5 h-3.5" />WhatsApp
                            </a>
                            <a href={`tel:${lead.phone}`}
                              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
                              <PhoneCall className="w-3.5 h-3.5" />Call
                            </a>
                            {lead.status === "new" && (
                              <button onClick={() => handleMarkContacted(lead.id)}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors">
                                <CheckCheck className="w-3.5 h-3.5" />Contacted
                              </button>
                            )}
                            {lead.status === "contacted" && (
                              <button onClick={() => handleMarkConverted(lead.id)}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90" style={{ background: ACCENT }}>
                                <CheckCheck className="w-3.5 h-3.5" />Converted
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── BOOKINGS TAB ── */}
              {activeTab === "bookings" && (
                <>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { label: "Pending",   value: bookings.filter(b => b.status === "pending").length,   bg: "bg-amber-50", border: "border-amber-200", color: "text-amber-700" },
                      { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, bg: "bg-green-50", border: "border-green-200", color: "text-green-700" },
                      { label: "Total",     value: bookings.length,                                        bg: "bg-gray-50",  border: "border-gray-200",  color: "text-foreground" },
                    ].map(s => (
                      <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 sm:p-4`}>
                        <p className={`text-xs font-semibold ${s.color} mb-1`}>{s.label}</p>
                        <p className="text-2xl sm:text-3xl font-black">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">No bookings yet — they&apos;ll appear here when customers book from your website</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bookings.map(booking => (
                        <div key={booking.id} className="border border-border rounded-xl p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3">
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
                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            <a href={`https://wa.me/91${booking.phone}`} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-colors">
                              <MessageSquare className="w-3.5 h-3.5" />WhatsApp
                            </a>
                            <a href={`tel:${booking.phone}`}
                              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
                              <PhoneCall className="w-3.5 h-3.5" />Call
                            </a>
                            {booking.status === "pending" && (
                              <button onClick={() => handleBookingStatus(booking.id, "confirmed")}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                                style={{ background: ACCENT }}>
                                <CheckCircle className="w-3.5 h-3.5" />Confirm
                              </button>
                            )}
                            {booking.status !== "cancelled" && (
                              <button onClick={() => handleBookingStatus(booking.id, "cancelled")}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                                <XCircle className="w-3.5 h-3.5" />Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function RestaurantConsolePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
      <RestaurantConsole />
    </Suspense>
  )
}
