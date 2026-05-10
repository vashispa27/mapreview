"use client"

import { useState } from "react"
import {
  Users, Plus, RefreshCw, Trash2, ChevronLeft, X,
  Search, AlertCircle, CheckCircle, Clock, Dumbbell, Mail,
  Phone, Calendar, IndianRupee, FileText, Settings, Download,
  TrendingUp, Receipt, Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { daysUntil, formatDate, fmtINR, getCurrentFY } from "@/lib/gym-utils"
import Link from "next/link"

// ─── Types ─────────────────────────────────────────────────────────────────

interface Member {
  id: string; name: string; email: string | null; phone: string
  membershipTitle: string; membershipPrice: string
  durationMonths: number; pricePerMonth: number
  startDate: string; endDate: string; status: string
}

interface Payment {
  id: string; invoiceNumber: string; invoiceDate: string; financialYear: string
  memberName: string; memberPhone: string
  planTitle: string; durationMonths: number
  taxableAmount: number; cgst: number; sgst: number; igst: number; totalAmount: number
  isInterstate: boolean; type: string
}

interface WorkoutPlan { id: string; name: string; goal: string | null; notes: string | null; sessions: any[] }
interface DietPlan {
  id: string; name: string; goal: string | null; notes: string | null
  totalCalories: number; protein: number; carbs: number; fat: number; meals: any[]
}

// ─── Mock data ─────────────────────────────────────────────────────────────

function makeDate(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

const MOCK_MEMBERS: Member[] = [
  { id: "m1", name: "Rahul Sharma", email: "rahul@gmail.com", phone: "9876543210", membershipTitle: "3-Month Plan", membershipPrice: "₹1,500/mo", durationMonths: 3, pricePerMonth: 1500, startDate: makeDate(-68), endDate: makeDate(22), status: "active" },
  { id: "m2", name: "Priya Mehta", email: null, phone: "9123456789", membershipTitle: "6-Month Plan", membershipPrice: "₹1,200/mo", durationMonths: 6, pricePerMonth: 1200, startDate: makeDate(-130), endDate: makeDate(50), status: "active" },
  { id: "m3", name: "Amit Patel", email: "amit@gmail.com", phone: "9988776655", membershipTitle: "1-Month Plan", membershipPrice: "₹1,000/mo", durationMonths: 1, pricePerMonth: 1000, startDate: makeDate(-27), endDate: makeDate(3), status: "active" },
  { id: "m4", name: "Sunita Rao", email: null, phone: "9871234560", membershipTitle: "1-Month Plan", membershipPrice: "₹900/mo", durationMonths: 1, pricePerMonth: 900, startDate: makeDate(-25), endDate: makeDate(5), status: "active" },
  { id: "m5", name: "Vikram Singh", email: "vikram@gmail.com", phone: "9845671230", membershipTitle: "1-Month Plan", membershipPrice: "₹1,000/mo", durationMonths: 1, pricePerMonth: 1000, startDate: makeDate(-70), endDate: makeDate(-40), status: "expired" },
  { id: "m6", name: "Neha Gupta", email: "neha@gmail.com", phone: "9765432100", membershipTitle: "Annual Plan", membershipPrice: "₹800/mo", durationMonths: 12, pricePerMonth: 800, startDate: makeDate(-280), endDate: makeDate(85), status: "active" },
  { id: "m7", name: "Kiran Kumar", email: null, phone: "9654321087", membershipTitle: "3-Month Plan", membershipPrice: "₹1,200/mo", durationMonths: 3, pricePerMonth: 1200, startDate: makeDate(-120), endDate: makeDate(-30), status: "expired" },
  { id: "m8", name: "Deepak Joshi", email: "deepak@gmail.com", phone: "9543210876", membershipTitle: "1-Month Plan", membershipPrice: "₹1,000/mo", durationMonths: 1, pricePerMonth: 1000, startDate: makeDate(-20), endDate: makeDate(10), status: "active" },
]

const FY = getCurrentFY()

const MOCK_PAYMENTS: Payment[] = [
  { id: "p1", invoiceNumber: `GYM/${FY}/0001`, invoiceDate: makeDate(-68), financialYear: FY, memberName: "Rahul Sharma", memberPhone: "9876543210", planTitle: "3-Month Plan", durationMonths: 3, taxableAmount: 4500, cgst: 112.50, sgst: 112.50, igst: 0, totalAmount: 4725, isInterstate: false, type: "new" },
  { id: "p2", invoiceNumber: `GYM/${FY}/0002`, invoiceDate: makeDate(-130), financialYear: FY, memberName: "Priya Mehta", memberPhone: "9123456789", planTitle: "6-Month Plan", durationMonths: 6, taxableAmount: 7200, cgst: 180, sgst: 180, igst: 0, totalAmount: 7560, isInterstate: false, type: "new" },
  { id: "p3", invoiceNumber: `GYM/${FY}/0003`, invoiceDate: makeDate(-27), financialYear: FY, memberName: "Amit Patel", memberPhone: "9988776655", planTitle: "1-Month Plan", durationMonths: 1, taxableAmount: 1000, cgst: 25, sgst: 25, igst: 0, totalAmount: 1050, isInterstate: false, type: "new" },
  { id: "p4", invoiceNumber: `GYM/${FY}/0004`, invoiceDate: makeDate(-25), financialYear: FY, memberName: "Sunita Rao", memberPhone: "9871234560", planTitle: "1-Month Plan", durationMonths: 1, taxableAmount: 900, cgst: 22.50, sgst: 22.50, igst: 0, totalAmount: 945, isInterstate: false, type: "new" },
  { id: "p5", invoiceNumber: `GYM/${FY}/0005`, invoiceDate: makeDate(-70), financialYear: FY, memberName: "Vikram Singh", memberPhone: "9845671230", planTitle: "1-Month Plan", durationMonths: 1, taxableAmount: 1000, cgst: 25, sgst: 25, igst: 0, totalAmount: 1050, isInterstate: false, type: "new" },
  { id: "p6", invoiceNumber: `GYM/${FY}/0006`, invoiceDate: makeDate(-280), financialYear: FY, memberName: "Neha Gupta", memberPhone: "9765432100", planTitle: "Annual Plan", durationMonths: 12, taxableAmount: 9600, cgst: 240, sgst: 240, igst: 0, totalAmount: 10080, isInterstate: false, type: "new" },
  { id: "p7", invoiceNumber: `GYM/${FY}/0007`, invoiceDate: makeDate(-120), financialYear: FY, memberName: "Kiran Kumar", memberPhone: "9654321087", planTitle: "3-Month Plan", durationMonths: 3, taxableAmount: 3600, cgst: 90, sgst: 90, igst: 0, totalAmount: 3780, isInterstate: false, type: "new" },
  { id: "p8", invoiceNumber: `GYM/${FY}/0008`, invoiceDate: makeDate(-20), financialYear: FY, memberName: "Deepak Joshi", memberPhone: "9543210876", planTitle: "1-Month Plan", durationMonths: 1, taxableAmount: 1000, cgst: 25, sgst: 25, igst: 0, totalAmount: 1050, isInterstate: false, type: "new" },
]

const MOCK_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: "wp1", name: "Beginner Strength", goal: "Muscle Gain", notes: "Focus on form before increasing weight. Rest 48h between sessions.",
    sessions: [
      { id: "s1", name: "Chest & Triceps", type: "workout", exercises: [{ name: "Bench Press", sets: 3, reps: "10", weight: "40kg", rest: "90s" }, { name: "Tricep Dips", sets: 3, reps: "12", weight: "BW", rest: "60s" }] },
      { id: "s2", name: "Back & Biceps", type: "workout", exercises: [{ name: "Lat Pulldown", sets: 3, reps: "10", weight: "35kg", rest: "90s" }, { name: "Barbell Curl", sets: 3, reps: "12", weight: "15kg", rest: "60s" }] },
      { id: "s3", name: "Legs", type: "workout", exercises: [{ name: "Squats", sets: 4, reps: "10", weight: "50kg", rest: "120s" }, { name: "Leg Press", sets: 3, reps: "12", weight: "80kg", rest: "90s" }] },
    ],
  },
  {
    id: "wp2", name: "Weight Loss Cardio", goal: "Weight Loss", notes: "Combine with diet plan. Do cardio on off days.",
    sessions: [
      { id: "s4", name: "HIIT Cardio", type: "cardio", exercises: [{ name: "Treadmill Sprints", sets: 8, reps: "30s on, 30s off", weight: "", rest: "30s" }] },
      { id: "s5", name: "Full Body Circuit", type: "workout", exercises: [{ name: "Burpees", sets: 3, reps: "15", weight: "BW", rest: "45s" }, { name: "Mountain Climbers", sets: 3, reps: "20", weight: "BW", rest: "45s" }] },
    ],
  },
]

const MOCK_DIET_PLANS: DietPlan[] = [
  {
    id: "dp1", name: "Weight Loss Nutrition", goal: "Weight Loss", notes: "Avoid processed sugar and fried food. Drink 3L water daily.",
    totalCalories: 1800, protein: 140, carbs: 180, fat: 50,
    meals: [
      { name: "Breakfast", time: "7:00 AM", calories: 450, protein: 35, carbs: 50, fat: 10, foods: ["Oats 80g", "Banana", "Boiled eggs 2"] },
      { name: "Lunch", time: "1:00 PM", calories: 600, protein: 50, carbs: 70, fat: 15, foods: ["Rice 100g", "Chicken breast 150g", "Dal 1 bowl", "Salad"] },
      { name: "Dinner", time: "7:30 PM", calories: 550, protein: 45, carbs: 50, fat: 15, foods: ["Chapati 2", "Paneer curry 100g", "Vegetables"] },
      { name: "Post-Workout", time: "5:30 PM", calories: 200, protein: 10, carbs: 10, fat: 10, foods: ["Whey protein shake", "Banana"] },
    ],
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────

function statusBadge(member: Member) {
  const days = daysUntil(new Date(member.endDate))
  if (member.status === "expired" || days < 0)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><AlertCircle className="w-3 h-3" />Expired</span>
  if (days <= 7)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="w-3 h-3" />Expires in {days}d</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Active</span>
}

const durationOptions = [1, 2, 3, 6, 12]

// ─── Page ──────────────────────────────────────────────────────────────────

export default function DemoConsolePage() {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS)
  const [payments] = useState<Payment[]>(MOCK_PAYMENTS)
  const [activeTab, setActiveTab] = useState<"members" | "earnings" | "settings" | "plans">("members")

  // Members UI state
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expiring" | "expired">("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", durationMonths: "1", pricePerMonth: "", startDate: new Date().toISOString().slice(0, 10) })
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Plans state
  const [plans, setPlans] = useState<WorkoutPlan[]>(MOCK_WORKOUT_PLANS)
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null)
  const [planEditorOpen, setPlanEditorOpen] = useState(false)
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(MOCK_DIET_PLANS)
  const [editingDietPlan, setEditingDietPlan] = useState<DietPlan | null>(null)
  const [dietPlanEditorOpen, setDietPlanEditorOpen] = useState(false)

  // Settings (local only)
  const [settingsForm, setSettingsForm] = useState({ gstin: "27AABCU9603R1ZX", businessName: "Iron Arena Fitness", address: "Shop 12, MG Road, Pune", state: "Maharashtra", isComposition: false, invoicePrefix: "GYM" })

  const [selectedFY] = useState(getCurrentFY())

  // ─── Handlers (local state only) ─────────────────────────────────────────

  const handleAdd = () => {
    if (!form.name || !form.phone || !form.pricePerMonth) return
    const dur = parseInt(form.durationMonths)
    const ppm = parseInt(form.pricePerMonth)
    const start = new Date(form.startDate)
    const end = new Date(form.startDate)
    end.setMonth(end.getMonth() + dur)
    const title = dur === 12 ? "Annual Plan" : dur === 6 ? "6-Month Plan" : dur === 3 ? "3-Month Plan" : "1-Month Plan"
    const newMember: Member = {
      id: Math.random().toString(36).slice(2),
      name: form.name, email: form.email || null, phone: form.phone,
      membershipTitle: title, membershipPrice: `₹${ppm.toLocaleString("en-IN")}/mo`,
      durationMonths: dur, pricePerMonth: ppm,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      status: "active",
    }
    setMembers((prev) => [newMember, ...prev])
    setDrawerOpen(false)
    setForm({ name: "", email: "", phone: "", durationMonths: "1", pricePerMonth: "", startDate: new Date().toISOString().slice(0, 10) })
  }

  const handleRenew = (id: string) => {
    setMembers((prev) => prev.map((m) => {
      if (m.id !== id) return m
      const base = new Date(Math.max(Date.now(), new Date(m.endDate).getTime()))
      base.setMonth(base.getMonth() + m.durationMonths)
      return { ...m, endDate: base.toISOString().slice(0, 10), status: "active" }
    }))
  }

  const handleDelete = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    setDeleteConfirmId(null)
  }

  function emptyPlan(): WorkoutPlan { return { id: "", name: "", goal: null, notes: null, sessions: [] } }
  function emptyDietPlan(): DietPlan {
    return { id: "", name: "", goal: null, notes: null, totalCalories: 0, protein: 0, carbs: 0, fat: 0, meals: [
      { name: "Breakfast", time: "7:00 AM", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] },
      { name: "Lunch", time: "1:00 PM", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] },
      { name: "Dinner", time: "7:00 PM", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] },
    ]}
  }

  const savePlan = () => {
    if (!editingPlan?.name) return
    if (editingPlan.id) {
      setPlans((p) => p.map((x) => x.id === editingPlan.id ? editingPlan : x))
    } else {
      setPlans((p) => [...p, { ...editingPlan, id: Math.random().toString(36).slice(2) }])
    }
    setPlanEditorOpen(false)
  }

  const saveDietPlan = () => {
    if (!editingDietPlan?.name) return
    if (editingDietPlan.id) {
      setDietPlans((p) => p.map((x) => x.id === editingDietPlan.id ? editingDietPlan : x))
    } else {
      setDietPlans((p) => [...p, { ...editingDietPlan, id: Math.random().toString(36).slice(2) }])
    }
    setDietPlanEditorOpen(false)
  }

  // ─── Derived data ─────────────────────────────────────────────────────────

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

  const previewTotal = form.pricePerMonth ? parseInt(form.durationMonths) * parseInt(form.pricePerMonth) : null
  const previewEndDate = form.startDate
    ? (() => { const d = new Date(form.startDate); d.setMonth(d.getMonth() + parseInt(form.durationMonths)); return d })()
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Demo banner */}
      <div className="bg-amber-500 text-amber-950 px-4 py-2.5 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 shrink-0" />
          This is a demo preview — all data is fake. Sign up to manage your real gym.
        </p>
        <Link href="/gyms" className="shrink-0 bg-amber-950 text-amber-50 text-xs font-black px-3 py-1.5 rounded-lg hover:bg-amber-900 transition">
          Get Started Free →
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/gyms" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
              <ChevronLeft className="w-4 h-4" />Back to MapToSite
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Iron Arena Fitness</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">Demo Console</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-background overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-0 min-w-max">
            {([
              { key: "members", label: "Members", icon: Users },
              { key: "plans", label: "Workout Plans", icon: Dumbbell },
              { key: "earnings", label: "Earnings & Billing", icon: IndianRupee },
              { key: "settings", label: "GST Settings", icon: Settings },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}>
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

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone or email…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["all", "active", "expiring", "expired"] as const).map((f) => (
                  <button key={f} onClick={() => setFilterStatus(f)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition ${filterStatus === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {f === "expiring" ? "Expiring" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <Button onClick={() => setDrawerOpen(true)} size="sm">
                  <Plus className="w-4 h-4 mr-1.5" />Add Member
                </Button>
              </div>
            </div>

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
                            <div className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" />{member.phone}</div>
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
                                <button onClick={() => handleDelete(member.id)} className="px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition">Confirm</button>
                                <button onClick={() => setDeleteConfirmId(null)} className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition">Cancel</button>
                              </>
                            ) : (
                              <>
                                {(member.status === "expired" || daysUntil(new Date(member.endDate)) < 0) && (
                                  <button onClick={() => handleRenew(member.id)} title="Renew membership" className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition">
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                )}
                                <button onClick={() => setDeleteConfirmId(member.id)} title="Remove member" className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition">
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
          </>
        )}

        {/* ── EARNINGS TAB ── */}
        {activeTab === "earnings" && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Financial Year: <strong>FY {selectedFY}</strong></p>
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-1.5" />Export GSTR-1 CSV
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: "This Month", value: fmtINR(earningsStats.thisMonth), icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                { label: `FY ${selectedFY}`, value: fmtINR(earningsStats.thisFY), icon: TrendingUp, color: "text-primary", bg: "bg-primary/5" },
                { label: "All Time", value: fmtINR(earningsStats.allTime), icon: IndianRupee, color: "text-foreground", bg: "bg-muted/50" },
                { label: "Taxable (FY)", value: fmtINR(earningsStats.taxable), icon: FileText, color: "text-violet-600", bg: "bg-violet-50" },
                { label: "GST Collected", value: fmtINR(earningsStats.gstCollected), icon: Receipt, color: "text-green-600", bg: "bg-green-50" },
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

            <div>
              <h2 className="text-base font-semibold mb-3">Payment History — FY {selectedFY}</h2>
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
                          <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">{fmtINR(p.cgst + p.sgst + p.igst)}</td>
                          <td className="px-4 py-3 text-right font-bold">{fmtINR(p.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
              {[
                { label: "Business / Gym Name", key: "businessName", placeholder: "e.g. Iron Arena Fitness" },
                { label: "GSTIN", key: "gstin", placeholder: "e.g. 27AABCU9603R1ZX" },
                { label: "Business Address", key: "address", placeholder: "Full address as on GST certificate" },
                { label: "Invoice Prefix", key: "invoicePrefix", placeholder: "GYM" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">{label}</label>
                  <input value={(settingsForm as any)[key]} onChange={(e) => setSettingsForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">State</label>
                <select value={settingsForm.state} onChange={(e) => setSettingsForm((f) => ({ ...f, state: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
                  {["Andhra Pradesh","Bihar","Delhi","Gujarat","Haryana","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-1.5 text-muted-foreground">
              <p className="font-semibold text-foreground">GST Info for Gym Services</p>
              <p>SAC Code: <span className="font-mono font-semibold text-foreground">999723</span> — Physical well-being services</p>
              <p>Rate: <span className="font-semibold text-foreground">5% GST</span> (CGST 2.5% + SGST 2.5% intrastate)</p>
            </div>
            <Button className="w-full" onClick={() => alert("Settings saved! (Demo mode — not persisted)")}>Save Settings</Button>
          </div>
        )}

        {/* ── WORKOUT PLANS TAB ── */}
        {activeTab === "plans" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Workout Plans</h2>
                <p className="text-sm text-muted-foreground">Create plans once, assign to any member</p>
              </div>
              <Button size="sm" onClick={() => { setEditingPlan(emptyPlan()); setPlanEditorOpen(true) }}>
                <Plus className="w-4 h-4 mr-1.5" />New Plan
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      {plan.goal && <p className="text-xs text-muted-foreground mt-0.5">{plan.goal}</p>}
                    </div>
                    <span className="shrink-0 text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {plan.sessions.length} session{plan.sessions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {plan.notes && <p className="text-xs text-muted-foreground line-clamp-2">{plan.notes}</p>}
                  <div className="flex gap-2 mt-auto pt-1">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingPlan(plan); setPlanEditorOpen(true) }}>Edit</Button>
                    <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setPlans((p) => p.filter((x) => x.id !== plan.id))}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Diet Plans */}
            <div className="border-t border-border pt-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Diet Plans</h2>
                  <p className="text-sm text-muted-foreground">Create nutrition plans and assign to members</p>
                </div>
                <Button size="sm" onClick={() => { setEditingDietPlan(emptyDietPlan()); setDietPlanEditorOpen(true) }}>
                  <Plus className="w-4 h-4 mr-1.5" />New Diet Plan
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dietPlans.map((plan) => (
                  <div key={plan.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        {plan.goal && <p className="text-xs text-muted-foreground mt-0.5">{plan.goal}</p>}
                      </div>
                      {plan.totalCalories > 0 && (
                        <span className="shrink-0 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{plan.totalCalories} kcal</span>
                      )}
                    </div>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      {plan.protein > 0 && <span>P: {plan.protein}g</span>}
                      {plan.carbs > 0 && <span>C: {plan.carbs}g</span>}
                      {plan.fat > 0 && <span>F: {plan.fat}g</span>}
                    </div>
                    <div className="flex gap-2 mt-auto pt-1">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingDietPlan(plan); setDietPlanEditorOpen(true) }}>Edit</Button>
                      <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDietPlans((p) => p.filter((x) => x.id !== plan.id))}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── ADD MEMBER DRAWER ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Add New Member</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Full Name *", key: "name", placeholder: "e.g. Rahul Sharma", type: "text" },
                { label: "Phone *", key: "phone", placeholder: "+91 98765 43210", type: "tel" },
                { label: "Email (optional)", key: "email", placeholder: "rahul@example.com", type: "email" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">{label}</label>
                  <input value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder} type={type}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
                </div>
              ))}
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
                    <span className="font-bold">₹{previewTotal.toLocaleString("en-IN")}</span>
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
              <Button onClick={handleAdd} disabled={!form.name || !form.phone || !form.pricePerMonth} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />Add Member
              </Button>
              <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── WORKOUT PLAN EDITOR ── */}
      {planEditorOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPlanEditorOpen(false)} />
          <div className="relative w-full sm:max-w-2xl bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingPlan.id ? "Edit Plan" : "New Workout Plan"}</h2>
              <button onClick={() => setPlanEditorOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Plan Name *</label>
                <input value={editingPlan.name} onChange={(e) => setEditingPlan((p) => p ? { ...p, name: e.target.value } : p)}
                  placeholder="e.g. Beginner Strength"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Goal</label>
                <select value={editingPlan.goal || ""} onChange={(e) => setEditingPlan((p) => p ? { ...p, goal: e.target.value || null } : p)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select goal…</option>
                  {["Weight Loss","Muscle Gain","Endurance","General Fitness","Flexibility","Powerlifting"].map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Sessions</h3>
                <button onClick={() => setEditingPlan((p) => p ? { ...p, sessions: [...p.sessions, { id: Math.random().toString(36).slice(2), name: "", type: "workout", exercises: [], notes: "" }] } : p)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition">
                  <Plus className="w-3.5 h-3.5" />Add Session
                </button>
              </div>
              {editingPlan.sessions.map((session: any) => (
                <div key={session.id} className="bg-muted/30 border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                    <input value={session.name}
                      onChange={(e) => setEditingPlan((p) => p ? { ...p, sessions: p.sessions.map((s: any) => s.id === session.id ? { ...s, name: e.target.value } : s) } : p)}
                      placeholder="Session name (e.g. Chest Day)"
                      className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30" />
                    <button onClick={() => setEditingPlan((p) => p ? { ...p, sessions: p.sessions.filter((s: any) => s.id !== session.id) } : p)}
                      className="p-1 text-muted-foreground hover:text-red-500 transition rounded ml-auto">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3 space-y-2">
                    {session.exercises?.map((ex: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-[1fr_52px_60px_68px_28px] gap-1.5 items-center">
                        <input value={ex.name} placeholder="Exercise"
                          onChange={(e) => setEditingPlan((p) => { if (!p) return p; const sessions = p.sessions.map((s: any) => { if (s.id !== session.id) return s; const exs = [...s.exercises]; exs[idx] = { ...exs[idx], name: e.target.value }; return { ...s, exercises: exs } }); return { ...p, sessions } })}
                          className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 w-full" />
                        <input value={ex.sets} type="number" placeholder="Sets"
                          onChange={(e) => setEditingPlan((p) => { if (!p) return p; const sessions = p.sessions.map((s: any) => { if (s.id !== session.id) return s; const exs = [...s.exercises]; exs[idx] = { ...exs[idx], sets: parseInt(e.target.value)||0 }; return { ...s, exercises: exs } }); return { ...p, sessions } })}
                          className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 w-full" />
                        <input value={ex.reps} placeholder="Reps"
                          onChange={(e) => setEditingPlan((p) => { if (!p) return p; const sessions = p.sessions.map((s: any) => { if (s.id !== session.id) return s; const exs = [...s.exercises]; exs[idx] = { ...exs[idx], reps: e.target.value }; return { ...s, exercises: exs } }); return { ...p, sessions } })}
                          className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 w-full" />
                        <input value={ex.weight} placeholder="Weight"
                          onChange={(e) => setEditingPlan((p) => { if (!p) return p; const sessions = p.sessions.map((s: any) => { if (s.id !== session.id) return s; const exs = [...s.exercises]; exs[idx] = { ...exs[idx], weight: e.target.value }; return { ...s, exercises: exs } }); return { ...p, sessions } })}
                          className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 w-full" />
                        <button onClick={() => setEditingPlan((p) => { if (!p) return p; const sessions = p.sessions.map((s: any) => s.id === session.id ? { ...s, exercises: s.exercises.filter((_: any, i: number) => i !== idx) } : s); return { ...p, sessions } })}
                          className="p-1 text-muted-foreground hover:text-red-500 transition rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => setEditingPlan((p) => { if (!p) return p; const sessions = p.sessions.map((s: any) => s.id === session.id ? { ...s, exercises: [...(s.exercises||[]), { name: "", sets: 3, reps: "10", weight: "", rest: "60s" }] } : s); return { ...p, sessions } })}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition mt-1">
                      <Plus className="w-3.5 h-3.5" />Add Exercise
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="flex-1" disabled={!editingPlan.name} onClick={savePlan}>
                {editingPlan.id ? "Save Changes" : "Create Plan"}
              </Button>
              <Button variant="outline" onClick={() => setPlanEditorOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── DIET PLAN EDITOR ── */}
      {dietPlanEditorOpen && editingDietPlan && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDietPlanEditorOpen(false)} />
          <div className="relative w-full sm:max-w-2xl bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingDietPlan.id ? "Edit Diet Plan" : "New Diet Plan"}</h2>
              <button onClick={() => setDietPlanEditorOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Plan Name *</label>
                <input value={editingDietPlan.name} onChange={(e) => setEditingDietPlan((p) => p ? { ...p, name: e.target.value } : p)}
                  placeholder="e.g. Weight Loss Nutrition"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Goal</label>
                <select value={editingDietPlan.goal || ""} onChange={(e) => setEditingDietPlan((p) => p ? { ...p, goal: e.target.value || null } : p)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select goal…</option>
                  {["Weight Loss","Muscle Gain","Maintenance","Lean Bulk","Fat Loss + Muscle Gain"].map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[{ label: "Calories (kcal)", key: "totalCalories" }, { label: "Protein (g)", key: "protein" }, { label: "Carbs (g)", key: "carbs" }, { label: "Fat (g)", key: "fat" }].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                  <input value={(editingDietPlan as any)[key] || ""} type="number" min={0}
                    onChange={(e) => setEditingDietPlan((p) => p ? { ...p, [key]: parseInt(e.target.value) || 0 } : p)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="flex-1" disabled={!editingDietPlan.name} onClick={saveDietPlan}>
                {editingDietPlan.id ? "Save Changes" : "Create Diet Plan"}
              </Button>
              <Button variant="outline" onClick={() => setDietPlanEditorOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
