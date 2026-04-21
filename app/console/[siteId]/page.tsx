"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  Users, Plus, RefreshCw, Trash2, ChevronLeft, Loader2,
  Search, AlertCircle, CheckCircle, Clock, Dumbbell, Mail,
  Phone, Calendar, IndianRupee, FileText, Settings, Download,
  TrendingUp, Receipt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { daysUntil, formatDate, fmtINR, getCurrentFY } from "@/lib/gym-utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: string; name: string; email: string | null; phone: string
  membershipPlanId: string; membershipTitle: string; membershipPrice: string
  durationMonths: number; pricePerMonth: number
  startDate: string; endDate: string; status: string
}

interface GymPayment {
  id: string; invoiceNumber: string; invoiceDate: string; financialYear: string
  memberName: string; memberPhone: string; memberEmail: string | null
  planTitle: string; durationMonths: number
  taxableAmount: number; cgst: number; sgst: number; igst: number; totalAmount: number
  isInterstate: boolean; type: string
}

interface GymSettings {
  gstin: string | null; businessName: string | null; address: string | null
  state: string | null; isComposition: boolean; invoicePrefix: string
  invoiceCounter: number; currentFY: string | null
}

interface SiteInfo {
  id: string; businessName: string | null
  businessData: { name?: string; isGym?: boolean } | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu",
  "Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusBadge(member: Member) {
  const days = daysUntil(new Date(member.endDate))
  if (member.status === "expired" || days < 0)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><AlertCircle className="w-3 h-3" />Expired</span>
  if (days <= 7)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="w-3 h-3" />Expires in {days}d</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Active</span>
}

function printInvoice(payment: GymPayment, settings: GymSettings | null, gymName: string) {
  const gstLabel = settings?.gstin ? `GSTIN: ${settings.gstin}` : "GSTIN: Not configured"
  const address = settings?.address || ""
  const state = settings?.state || ""
  const html = `<!DOCTYPE html><html><head><title>Invoice ${payment.invoiceNumber}</title>
  <style>
    body{font-family:Arial,sans-serif;margin:0;padding:32px;color:#111;font-size:14px}
    h1{font-size:22px;font-weight:700;margin:0 0 4px}
    .subtitle{color:#666;margin-bottom:24px}
    table{width:100%;border-collapse:collapse;margin-top:16px}
    th{background:#f3f4f6;text-align:left;padding:10px 12px;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#555}
    td{padding:10px 12px;border-bottom:1px solid #e5e7eb}
    .totals td{font-weight:600}
    .grand td{font-size:16px;font-weight:700;background:#f0fdf4}
    .two-col{display:flex;justify-content:space-between;gap:32px;margin-bottom:24px}
    .box{flex:1}
    .label{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
    .value{font-weight:600}
    .footer{margin-top:32px;font-size:12px;color:#999;text-align:center;border-top:1px solid #e5e7eb;padding-top:16px}
    @media print{body{padding:16px}}
  </style></head><body>
  <h1>Tax Invoice</h1>
  <p class="subtitle">SAC Code: 999723 — Fitness / Gym Services</p>
  <div class="two-col">
    <div class="box">
      <div class="label">From</div>
      <div class="value">${gymName}</div>
      ${address ? `<div>${address}</div>` : ""}
      ${state ? `<div>${state}</div>` : ""}
      <div>${gstLabel}</div>
    </div>
    <div class="box" style="text-align:right">
      <div class="label">Invoice</div>
      <div class="value">${payment.invoiceNumber}</div>
      <div>${new Date(payment.invoiceDate).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</div>
      <div>FY ${payment.financialYear}</div>
    </div>
  </div>
  <div class="two-col">
    <div class="box">
      <div class="label">Bill To</div>
      <div class="value">${payment.memberName}</div>
      <div>${payment.memberPhone}</div>
      ${payment.memberEmail ? `<div>${payment.memberEmail}</div>` : ""}
    </div>
    <div class="box" style="text-align:right">
      <div class="label">Plan</div>
      <div class="value">${payment.planTitle}</div>
      <div>${payment.durationMonths} month${payment.durationMonths > 1 ? "s" : ""} membership</div>
      <div style="text-transform:capitalize;color:#888">${payment.type}</div>
    </div>
  </div>
  <table>
    <tr><th>Description</th><th>SAC</th><th>Amount</th></tr>
    <tr><td>${payment.planTitle} — ${payment.durationMonths} Month Membership</td><td>999723</td><td>₹${payment.taxableAmount.toLocaleString("en-IN", {minimumFractionDigits:2})}</td></tr>
  </table>
  <table style="margin-top:0">
    <tr class="totals"><td>Taxable Amount</td><td></td><td>₹${payment.taxableAmount.toLocaleString("en-IN",{minimumFractionDigits:2})}</td></tr>
    ${payment.isInterstate
      ? `<tr class="totals"><td>IGST @ 5%</td><td></td><td>₹${payment.igst.toLocaleString("en-IN",{minimumFractionDigits:2})}</td></tr>`
      : `<tr class="totals"><td>CGST @ 2.5%</td><td></td><td>₹${payment.cgst.toLocaleString("en-IN",{minimumFractionDigits:2})}</td></tr>
         <tr class="totals"><td>SGST @ 2.5%</td><td></td><td>₹${payment.sgst.toLocaleString("en-IN",{minimumFractionDigits:2})}</td></tr>`
    }
    <tr class="grand"><td colspan="2">Total Amount</td><td>₹${payment.totalAmount.toLocaleString("en-IN",{minimumFractionDigits:2})}</td></tr>
  </table>
  <p class="footer">This is a computer-generated invoice. No signature required.<br>GST @ 5% applied under SAC 999723 — Physical well-being services.</p>
  <script>window.onload=()=>{window.print()}</script>
  </body></html>`
  const w = window.open("", "_blank")
  if (w) { w.document.write(html); w.document.close() }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GymConsolePage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const params = useParams()
  const siteId = params.siteId as string

  const [site, setSite] = useState<SiteInfo | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [payments, setPayments] = useState<GymPayment[]>([])
  const [settings, setSettings] = useState<GymSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"members" | "earnings" | "settings">("members")

  // Members state
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expiring" | "expired">("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", durationMonths: "1", pricePerMonth: "", startDate: new Date().toISOString().slice(0, 10) })
  const [submitting, setSubmitting] = useState(false)
  const [renewingId, setRenewingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Settings state
  const [settingsForm, setSettingsForm] = useState({ gstin: "", businessName: "", address: "", state: "", isComposition: false, invoicePrefix: "INV" })
  const [savingSettings, setSavingSettings] = useState(false)

  // Earnings state
  const [selectedFY, setSelectedFY] = useState(getCurrentFY())

  useEffect(() => { if (authStatus === "unauthenticated") router.push("/") }, [authStatus])

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/sites/${siteId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.businessData?.isGym) { router.push("/my-sites"); return }
        setSite(data)
      })
      .catch(() => router.push("/my-sites"))
  }, [session, siteId])

  const fetchMembers = () =>
    fetch(`/api/console/${siteId}/members`)
      .then((r) => r.json())
      .then((d) => { setMembers(d.members || []); setLoading(false) })
      .catch(() => setLoading(false))

  const fetchPayments = () =>
    fetch(`/api/console/${siteId}/payments`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setPayments(d?.payments || []))
      .catch(() => {})

  const fetchSettings = () =>
    fetch(`/api/console/${siteId}/settings`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.settings) {
          setSettings(d.settings)
          setSettingsForm({
            gstin: d.settings.gstin || "",
            businessName: d.settings.businessName || "",
            address: d.settings.address || "",
            state: d.settings.state || "",
            isComposition: d.settings.isComposition || false,
            invoicePrefix: d.settings.invoicePrefix || "INV",
          })
        }
      })
      .catch(() => {})

  useEffect(() => {
    if (site) { fetchMembers(); fetchPayments(); fetchSettings() }
  }, [site])

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const durationOptions = [1, 2, 3, 6, 12]
  const previewTotal = form.pricePerMonth ? parseInt(form.durationMonths) * parseInt(form.pricePerMonth) : null
  const previewEndDate = form.startDate
    ? (() => { const d = new Date(form.startDate); d.setMonth(d.getMonth() + parseInt(form.durationMonths)); return d })()
    : null

  const handleAdd = async () => {
    if (!form.name || !form.phone || !form.pricePerMonth) return
    setSubmitting(true)
    const res = await fetch(`/api/console/${siteId}/members`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email || null, phone: form.phone, durationMonths: form.durationMonths, pricePerMonth: form.pricePerMonth, startDate: form.startDate }),
    })
    setSubmitting(false)
    if (res.ok) {
      setDrawerOpen(false)
      setForm({ name: "", email: "", phone: "", durationMonths: "1", pricePerMonth: "", startDate: new Date().toISOString().slice(0, 10) })
      fetchMembers(); fetchPayments()
    }
  }

  const handleRenew = async (memberId: string) => {
    setRenewingId(memberId)
    await fetch(`/api/console/${siteId}/members/${memberId}`, { method: "PATCH" })
    setRenewingId(null)
    fetchMembers(); fetchPayments()
  }

  const handleDelete = async (memberId: string) => {
    setDeletingId(memberId)
    await fetch(`/api/console/${siteId}/members/${memberId}`, { method: "DELETE" })
    setDeletingId(null); setDeleteConfirmId(null)
    fetchMembers()
  }

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    const res = await fetch(`/api/console/${siteId}/settings`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settingsForm),
    })
    setSavingSettings(false)
    if (res.ok) { const d = await res.json(); setSettings(d.settings) }
  }

  const handleExportCSV = () => {
    window.open(`/api/console/${siteId}/payments?export=csv&fy=${selectedFY}`, "_blank")
  }

  // ─── Derived data ────────────────────────────────────────────────────────────

  const filtered = members.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search) || m.email?.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    const days = daysUntil(new Date(m.endDate))
    if (filterStatus === "active") return m.status === "active" && days > 7
    if (filterStatus === "expiring") return m.status === "active" && days >= 0 && days <= 7
    if (filterStatus === "expired") return m.status === "expired" || days < 0
    return true
  })

  const memberStats = {
    total: members.length,
    active: members.filter((m) => m.status === "active" && daysUntil(new Date(m.endDate)) > 7).length,
    expiring: members.filter((m) => m.status === "active" && daysUntil(new Date(m.endDate)) >= 0 && daysUntil(new Date(m.endDate)) <= 7).length,
    expired: members.filter((m) => m.status === "expired" || daysUntil(new Date(m.endDate)) < 0).length,
  }

  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const fyPayments = payments.filter((p) => p.financialYear === selectedFY)
  const monthPayments = payments.filter((p) => p.invoiceDate.slice(0, 7) === thisMonth)

  const earningsStats = {
    allTime: payments.reduce((s, p) => s + p.totalAmount, 0),
    thisFY: fyPayments.reduce((s, p) => s + p.totalAmount, 0),
    thisMonth: monthPayments.reduce((s, p) => s + p.totalAmount, 0),
    gstCollected: fyPayments.reduce((s, p) => s + p.cgst + p.sgst + p.igst, 0),
    taxable: fyPayments.reduce((s, p) => s + p.taxableAmount, 0),
  }

  // Unique FYs from payments for filter dropdown
  const availableFYs = [...new Set(payments.map((p) => p.financialYear))].sort().reverse()
  if (!availableFYs.includes(getCurrentFY())) availableFYs.unshift(getCurrentFY())

  const gymName = settings?.businessName || (site?.businessData?.name) || site?.businessName || "Gym"

  if (authStatus === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/my-sites" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
              <ChevronLeft className="w-4 h-4" />My Sites
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">{gymName}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">Console</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-0">
            {([
              { key: "members", label: "Members", icon: Users },
              { key: "earnings", label: "Earnings & Billing", icon: IndianRupee },
              { key: "settings", label: "GST Settings", icon: Settings },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition ${
                  activeTab === key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* ── MEMBERS TAB ── */}
        {activeTab === "members" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Members", value: memberStats.total, icon: Users, color: "text-foreground", bg: "bg-muted/50" },
                { label: "Active", value: memberStats.active, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
                { label: "Expiring Soon", value: memberStats.expiring, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Expired", value: memberStats.expired, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-border/50`}>
                  <div className={`flex items-center gap-2 mb-2 ${s.color}`}>
                    <s.icon className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">{s.label}</span>
                  </div>
                  <p className="text-3xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone or email…"
                  autoComplete="off"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
              </div>
              <div className="flex gap-2">
                {(["all", "active", "expiring", "expired"] as const).map((f) => (
                  <button key={f} onClick={() => setFilterStatus(f)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition ${filterStatus === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {f === "all" ? "All" : f === "expiring" ? "Expiring" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Members table */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
                <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="font-semibold text-muted-foreground">{members.length === 0 ? "No members yet" : "No members match your filter"}</p>
                {members.length === 0 && (
                  <Button onClick={() => setDrawerOpen(true)} className="mt-4" size="sm">
                    <Plus className="w-4 h-4 mr-1.5" />Add your first member
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Member</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Contact</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Plan</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Expires</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((member, i) => (
                        <tr key={member.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" /><span>{member.phone}</span></div>
                              {member.email && <div className="flex items-center gap-1 text-muted-foreground"><Mail className="w-3 h-3" /><span className="truncate max-w-[160px]">{member.email}</span></div>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{member.membershipTitle}</p>
                            <p className="text-xs text-muted-foreground">{member.membershipPrice}</p>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />{formatDate(new Date(member.endDate))}
                            </div>
                          </td>
                          <td className="px-4 py-3">{statusBadge(member)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              {deleteConfirmId === member.id ? (
                                <>
                                  <button onClick={() => handleDelete(member.id)} disabled={!!deletingId}
                                    className="px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition flex items-center gap-1">
                                    {deletingId === member.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}Confirm
                                  </button>
                                  <button onClick={() => setDeleteConfirmId(null)} className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition">Cancel</button>
                                </>
                              ) : (
                                <>
                                  <Link href={`/console/${siteId}/member/${member.id}`}
                                    className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition whitespace-nowrap">
                                    View Profile
                                  </Link>
                                  {(member.status === "expired" || daysUntil(new Date(member.endDate)) < 0) && (
                                    <button onClick={() => handleRenew(member.id)} disabled={!!renewingId} title="Renew membership"
                                      className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition">
                                      {renewingId === member.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                    </button>
                                  )}
                                  <button onClick={() => setDeleteConfirmId(member.id)} title="Remove member"
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── EARNINGS TAB ── */}
        {activeTab === "earnings" && (
          <>
            {/* FY selector + export */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Financial Year:</span>
                <select value={selectedFY} onChange={(e) => setSelectedFY(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30">
                  {availableFYs.map((fy) => <option key={fy} value={fy}>FY {fy}</option>)}
                </select>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-1.5" />Export GSTR-1 CSV
              </Button>
            </div>

            {/* Warning if no GSTIN */}
            {!settings?.gstin && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>GSTIN not configured. <button onClick={() => setActiveTab("settings")} className="underline font-semibold">Set up GST Settings</button> to generate compliant invoices.</span>
              </div>
            )}

            {/* Earnings stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: "This Month", value: fmtINR(earningsStats.thisMonth), icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                { label: `FY ${selectedFY}`, value: fmtINR(earningsStats.thisFY), icon: TrendingUp, color: "text-primary", bg: "bg-primary/5" },
                { label: "All Time", value: fmtINR(earningsStats.allTime), icon: IndianRupee, color: "text-foreground", bg: "bg-muted/50" },
                { label: `FY ${selectedFY} Taxable`, value: fmtINR(earningsStats.taxable), icon: FileText, color: "text-violet-600", bg: "bg-violet-50" },
                { label: `GST Collected (FY)`, value: fmtINR(earningsStats.gstCollected), icon: Receipt, color: "text-green-600", bg: "bg-green-50" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-border/50`}>
                  <div className={`flex items-center gap-2 mb-2 ${s.color}`}>
                    <s.icon className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider leading-tight">{s.label}</span>
                  </div>
                  <p className="text-lg font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Payment history */}
            <div>
              <h2 className="text-base font-semibold mb-3">Payment History — FY {selectedFY}</h2>
              {fyPayments.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                  <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="font-semibold text-muted-foreground">No payments recorded for FY {selectedFY}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Invoice</th>
                          <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                          <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Member</th>
                          <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Plan</th>
                          <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Taxable</th>
                          <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">GST</th>
                          <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Total</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {fyPayments.map((p, i) => (
                          <tr key={p.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                            <td className="px-4 py-3">
                              <p className="font-mono text-xs font-semibold">{p.invoiceNumber}</p>
                              <span className={`text-xs capitalize px-1.5 py-0.5 rounded ${p.type === "renewal" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{p.type}</span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{formatDate(new Date(p.invoiceDate))}</td>
                            <td className="px-4 py-3 font-medium">{p.memberName}</td>
                            <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.planTitle}</td>
                            <td className="px-4 py-3 text-right">{fmtINR(p.taxableAmount)}</td>
                            <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                              {p.isInterstate ? `IGST ${fmtINR(p.igst)}` : `${fmtINR(p.cgst + p.sgst)}`}
                            </td>
                            <td className="px-4 py-3 text-right font-bold">{fmtINR(p.totalAmount)}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => printInvoice(p, settings, gymName)} title="Print invoice"
                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition">
                                <FileText className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold">GST & Invoice Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">Used on all GST invoices generated from this console.</p>
            </div>

            <div className="space-y-4 bg-card border border-border rounded-xl p-5">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Business / Gym Name</label>
                <input value={settingsForm.businessName} onChange={(e) => setSettingsForm((f) => ({ ...f, businessName: e.target.value }))}
                  placeholder="e.g. Iron Arena Fitness"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">GSTIN</label>
                <input value={settingsForm.gstin} onChange={(e) => setSettingsForm((f) => ({ ...f, gstin: e.target.value.toUpperCase() }))}
                  placeholder="e.g. 27AABCU9603R1ZX" maxLength={15}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm font-mono outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
                <p className="text-xs text-muted-foreground mt-1">15-character GST Identification Number</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Business Address</label>
                <textarea value={settingsForm.address} onChange={(e) => setSettingsForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Full address as on GST certificate" rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">State</label>
                <select value={settingsForm.state} onChange={(e) => setSettingsForm((f) => ({ ...f, state: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
                  <option value="">Select state…</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Invoice Prefix</label>
                <input value={settingsForm.invoicePrefix} onChange={(e) => setSettingsForm((f) => ({ ...f, invoicePrefix: e.target.value.toUpperCase().slice(0, 6) }))}
                  placeholder="INV" maxLength={6}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm font-mono outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
                <p className="text-xs text-muted-foreground mt-1">Invoice numbers will look like: {settingsForm.invoicePrefix || "INV"}/{getCurrentFY()}/0001</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <input type="checkbox" id="composition" checked={settingsForm.isComposition}
                  onChange={(e) => setSettingsForm((f) => ({ ...f, isComposition: e.target.checked }))}
                  className="w-4 h-4 accent-primary" />
                <label htmlFor="composition" className="text-sm">
                  <span className="font-medium">Composition Scheme</span>
                  <span className="text-muted-foreground ml-1">(turnover ₹20L–₹1.5Cr, flat rate, no ITC)</span>
                </label>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-1.5 text-muted-foreground">
              <p className="font-semibold text-foreground">GST Info for Gym Services</p>
              <p>SAC Code: <span className="font-mono font-semibold text-foreground">999723</span> — Physical well-being services</p>
              <p>Rate: <span className="font-semibold text-foreground">5% GST</span> (CGST 2.5% + SGST 2.5% intrastate)</p>
              <p>Registration required above ₹20 lakh annual turnover</p>
            </div>

            <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full">
              {savingSettings ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Settings
            </Button>
          </div>
        )}
      </main>

      {/* Add Member Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Add New Member</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Full Name *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Rahul Sharma"
                  autoComplete="new-password" name="member-name"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Phone *</label>
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" type="tel"
                  autoComplete="new-password" name="member-phone"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Email <span className="normal-case font-normal text-muted-foreground">(optional)</span></label>
                <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="rahul@example.com" type="email"
                  autoComplete="new-password" name="member-email"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Duration *</label>
                  <select value={form.durationMonths} onChange={(e) => setForm((f) => ({ ...f, durationMonths: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
                    {durationOptions.map((m) => <option key={m} value={String(m)}>{m === 12 ? "1 Year" : `${m} Month${m > 1 ? "s" : ""}`}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Price / Month (₹) *</label>
                  <input value={form.pricePerMonth} onChange={(e) => setForm((f) => ({ ...f, pricePerMonth: e.target.value.replace(/\D/g, "") }))}
                    placeholder="e.g. 1000" type="text" inputMode="numeric"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Start Date *</label>
                <input value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} type="date"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
              </div>
              {form.pricePerMonth && previewTotal !== null && previewEndDate && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total (excl. GST)</span>
                    <span className="font-bold text-foreground">₹{previewTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GST @ 5%</span>
                    <span className="font-semibold text-muted-foreground">₹{(previewTotal * 0.05).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-primary/10 pt-1.5">
                    <span className="font-semibold">Total incl. GST</span>
                    <span className="font-bold text-primary">₹{(previewTotal * 1.05).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Renewal date</span>
                    <span className="font-bold text-primary">{formatDate(previewEndDate)}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAdd} disabled={submitting || !form.name || !form.phone || !form.pricePerMonth} className="flex-1">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}Add Member
              </Button>
              <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
