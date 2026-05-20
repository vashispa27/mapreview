"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin, Users, IndianRupee, Dumbbell, CheckCircle, Clock, AlertCircle,
  Phone, Calendar, TrendingUp, Receipt, Search, Plus, Zap, Globe,
  Loader2, X, Lock, Bell, MessageCircle, UserPlus, ChevronRight,
  Star, Mail, PhoneCall, CheckCheck, Inbox, Trash2, FileText,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoginModal } from "@/components/login-modal"
import { daysUntil, formatDate, fmtINR, getCurrentFY } from "@/lib/gym-utils"
import { track } from "@/lib/analytics"

// ─── Types ───────────────────────────────────────────────────────────────────

type MemberStatus = "active" | "expired"
type LeadStatus = "new" | "contacted" | "converted"

interface Member {
  id: string; name: string; phone: string
  membershipTitle: string; membershipPrice: string
  pricePerMonth: number; durationMonths: number
  startDate: string; endDate: string; status: MemberStatus
}
interface Lead {
  id: string; name: string; phone: string
  enquiryDate: string; source: string; status: LeadStatus
  message?: string
}
interface Exercise { name: string; sets: number; reps: string; weight: string; rest: string }
interface WorkoutSession { id: string; name: string; type: "workout" | "cardio"; exercises: Exercise[]; notes: string }
interface WorkoutPlan { id: string; name: string; goal: string | null; notes: string | null; sessions: WorkoutSession[] }
interface Meal { name: string; time: string; calories: number; protein: number; carbs: number; fat: number; foods: string[] }
interface DietPlan { id: string; name: string; goal: string | null; notes: string | null; totalCalories: number; protein: number; carbs: number; fat: number; meals: Meal[] }

// ─── Demo data ────────────────────────────────────────────────────────────────

const FY = getCurrentFY()
function makeDate(offsetDays: number) {
  const d = new Date(); d.setDate(d.getDate() + offsetDays); return d.toISOString().slice(0, 10)
}

const INIT_MEMBERS: Member[] = [
  { id: "m1", name: "Rahul Sharma",  phone: "9876543210", membershipTitle: "3-Month Plan", membershipPrice: "₹1,500/mo", pricePerMonth: 1500, durationMonths: 3, startDate: makeDate(-68),  endDate: makeDate(22),  status: "active" },
  { id: "m2", name: "Priya Mehta",   phone: "9123456789", membershipTitle: "6-Month Plan", membershipPrice: "₹1,200/mo", pricePerMonth: 1200, durationMonths: 6, startDate: makeDate(-130), endDate: makeDate(50),  status: "active" },
  { id: "m3", name: "Amit Patel",    phone: "9988776655", membershipTitle: "1-Month Plan", membershipPrice: "₹1,000/mo", pricePerMonth: 1000, durationMonths: 1, startDate: makeDate(-27),  endDate: makeDate(3),   status: "active" },
  { id: "m4", name: "Sunita Rao",    phone: "9871234560", membershipTitle: "1-Month Plan", membershipPrice: "₹900/mo",  pricePerMonth: 900,  durationMonths: 1, startDate: makeDate(-25),  endDate: makeDate(5),   status: "active" },
  { id: "m5", name: "Vikram Singh",  phone: "9845671230", membershipTitle: "1-Month Plan", membershipPrice: "₹1,000/mo", pricePerMonth: 1000, durationMonths: 1, startDate: makeDate(-70),  endDate: makeDate(-40), status: "expired" },
]
const INIT_LEADS: Lead[] = [
  { id: "l1", name: "Arun Kumar",  phone: "9870123456", enquiryDate: makeDate(0),  source: "Website", status: "new",       message: "Interested in 3-month plan" },
  { id: "l2", name: "Deepa Singh", phone: "9765432100", enquiryDate: makeDate(-1), source: "Website", status: "new",       message: "Looking for personal training" },
  { id: "l3", name: "Raj Verma",   phone: "9812345678", enquiryDate: makeDate(-3), source: "WhatsApp", status: "contacted", message: "Asked about batch timings" },
  { id: "l4", name: "Meena Shah",  phone: "9988001122", enquiryDate: makeDate(-5), source: "Website", status: "converted", message: "Joined 1-month plan" },
]
const INIT_PLANS: WorkoutPlan[] = [
  { id: "wp1", name: "Beginner Strength", goal: "Muscle Gain", notes: "Focus on form. Rest 60s between sets.", sessions: [
    { id: "s1", name: "Chest & Triceps", type: "workout", notes: "", exercises: [
      { name: "Bench Press", sets: 3, reps: "10", weight: "40kg", rest: "60s" },
      { name: "Push-ups", sets: 3, reps: "15", weight: "BW", rest: "45s" },
      { name: "Tricep Dips", sets: 3, reps: "12", weight: "BW", rest: "45s" },
    ]},
    { id: "s2", name: "Back & Biceps", type: "workout", notes: "", exercises: [
      { name: "Pull-ups", sets: 3, reps: "8", weight: "BW", rest: "60s" },
      { name: "Dumbbell Rows", sets: 3, reps: "10", weight: "15kg", rest: "60s" },
      { name: "Bicep Curls", sets: 3, reps: "12", weight: "10kg", rest: "45s" },
    ]},
    { id: "s3", name: "Cardio", type: "cardio", notes: "", exercises: [
      { name: "Treadmill Run", sets: 1, reps: "30 min", weight: "-", rest: "-" },
    ]},
  ]},
  { id: "wp2", name: "Weight Loss Cardio", goal: "Weight Loss", notes: "5 days/week, keep heart rate at 130-150bpm.", sessions: [
    { id: "s4", name: "HIIT Session", type: "cardio", notes: "", exercises: [
      { name: "Burpees", sets: 4, reps: "15", weight: "BW", rest: "30s" },
      { name: "Jump Rope", sets: 4, reps: "2 min", weight: "-", rest: "30s" },
      { name: "Mountain Climbers", sets: 4, reps: "20", weight: "BW", rest: "30s" },
    ]},
  ]},
]
const INIT_DIET_PLANS: DietPlan[] = [
  { id: "dp1", name: "Lean Muscle Diet", goal: "Muscle Gain", notes: "High protein, moderate carbs. Drink 3L water.", totalCalories: 2800, protein: 160, carbs: 300, fat: 80, meals: [
    { name: "Breakfast", time: "7:00 AM", calories: 600, protein: 40, carbs: 60, fat: 15, foods: ["Oats 100g", "Banana", "Boiled eggs ×3", "Milk 200ml"] },
    { name: "Lunch", time: "1:00 PM", calories: 900, protein: 55, carbs: 110, fat: 25, foods: ["Brown rice 150g", "Chicken breast 200g", "Dal 1 bowl", "Salad"] },
    { name: "Pre-workout", time: "5:30 PM", calories: 400, protein: 25, carbs: 60, fat: 8, foods: ["Banana", "Protein shake"] },
    { name: "Dinner", time: "9:00 PM", calories: 700, protein: 45, carbs: 70, fat: 20, foods: ["Roti ×3", "Paneer sabzi", "Curd 1 bowl"] },
  ]},
]

const DEMO_PAYMENTS = [
  { id: "p1", invoiceNumber: `GYM/${FY}/0001`, invoiceDate: makeDate(-68),  memberName: "Rahul Sharma", planTitle: "3-Month Plan", cgst: 112.5, sgst: 112.5, totalAmount: 4725 },
  { id: "p2", invoiceNumber: `GYM/${FY}/0002`, invoiceDate: makeDate(-130), memberName: "Priya Mehta",  planTitle: "6-Month Plan", cgst: 180,   sgst: 180,   totalAmount: 7560 },
  { id: "p3", invoiceNumber: `GYM/${FY}/0003`, invoiceDate: makeDate(-27),  memberName: "Amit Patel",   planTitle: "1-Month Plan", cgst: 25,    sgst: 25,    totalAmount: 1050 },
  { id: "p4", invoiceNumber: `GYM/${FY}/0004`, invoiceDate: makeDate(-25),  memberName: "Sunita Rao",   planTitle: "1-Month Plan", cgst: 22.5,  sgst: 22.5,  totalAmount: 945 },
  { id: "p5", invoiceNumber: `GYM/${FY}/0005`, invoiceDate: makeDate(-70),  memberName: "Vikram Singh", planTitle: "1-Month Plan", cgst: 25,    sgst: 25,    totalAmount: 1050 },
]
const MEMBERSHIP_PLANS = [
  { title: "1-Month Plan", price: "₹1,000/mo", pricePerMonth: 1000, durationMonths: 1 },
  { title: "3-Month Plan", price: "₹1,500/mo", pricePerMonth: 1500, durationMonths: 3 },
  { title: "6-Month Plan", price: "₹1,200/mo", pricePerMonth: 1200, durationMonths: 6 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ member }: { member: Member }) {
  const days = daysUntil(new Date(member.endDate))
  if (member.status === "expired" || days < 0)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap"><AlertCircle className="w-3 h-3" />Expired</span>
  if (days <= 7)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 whitespace-nowrap"><Clock className="w-3 h-3" />{days}d left</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap"><CheckCircle className="w-3 h-3" />Active</span>
}
function LeadBadge({ status }: { status: LeadStatus }) {
  if (status === "new") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">New</span>
  if (status === "contacted") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Contacted</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCheck className="w-3 h-3" />Joined</span>
}
function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
function newSession(): WorkoutSession {
  return { id: Math.random().toString(36).slice(2), name: "", type: "workout", exercises: [], notes: "" }
}
function emptyWorkoutPlan(): WorkoutPlan { return { id: "", name: "", goal: null, notes: null, sessions: [] } }
function emptyDietPlan(): DietPlan {
  return { id: "", name: "", goal: null, notes: null, totalCalories: 0, protein: 0, carbs: 0, fat: 0, meals: [
    { name: "Breakfast", time: "7:00 AM", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] },
    { name: "Lunch",     time: "1:00 PM", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] },
    { name: "Dinner",    time: "7:00 PM", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] },
  ]}
}

// ─── Add Member Modal ─────────────────────────────────────────────────────────

function AddMemberModal({ open, onClose, onAdd, gymName, mapsUrl }: { open: boolean; onClose: () => void; onAdd: (m: Member) => void; gymName: string; mapsUrl: string }) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [planIdx, setPlanIdx] = useState(0)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [submitting, setSubmitting] = useState(false)
  const phoneSaved = useRef(false)
  const reset = () => { setName(""); setPhone(""); setPlanIdx(0); setStartDate(new Date().toISOString().slice(0, 10)); phoneSaved.current = false }

  useEffect(() => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length < 10 || phoneSaved.current) return
    phoneSaved.current = true
    fetch("/api/onboarding/lead", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gymName, mapsUrl: mapsUrl || null, step: "phone_entered", phone: digits }),
    }).catch(() => {})
  }, [phone, gymName, mapsUrl])
  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) return
    setSubmitting(true)
    const plan = MEMBERSHIP_PLANS[planIdx]
    const end = new Date(startDate); end.setMonth(end.getMonth() + plan.durationMonths)
    setTimeout(() => {
      onAdd({ id: `m${Date.now()}`, name: name.trim(), phone: phone.trim(), membershipTitle: plan.title, membershipPrice: plan.price,
        pricePerMonth: plan.pricePerMonth, durationMonths: plan.durationMonths,
        startDate, endDate: end.toISOString().slice(0, 10), status: "active" })
      setSubmitting(false); reset(); onClose()
    }, 500)
  }
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="relative w-full sm:max-w-md bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl border border-border overflow-hidden z-10">
        <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
          <div><h2 className="text-lg font-black">Add New Member</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Auto-reminder will be sent before expiry</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Full Name</label>
            <Input placeholder="e.g. Rohit Sharma" value={name} onChange={e => setName(e.target.value)} className="h-11" autoFocus />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Phone Number</label>
            <Input type="tel" placeholder="10-digit mobile" value={phone} onChange={e => setPhone(e.target.value)} className="h-11" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Membership Plan</label>
            <div className="grid grid-cols-3 gap-2">
              {MEMBERSHIP_PLANS.map((p, i) => (
                <button key={p.title} onClick={() => setPlanIdx(i)}
                  className={`rounded-xl border p-3 text-left transition-all ${planIdx === i ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-muted-foreground"}`}>
                  <p className="text-xs font-bold leading-tight">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.price}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Start Date</label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-11" />
          </div>
          <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-xl px-3.5 py-3">
            <Bell className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-green-800 leading-relaxed">
              <span className="font-bold">Auto-reminders enabled</span> — WhatsApp &amp; email sent 7d and 1d before expiry.
            </p>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 h-11">Cancel</Button>
          <Button onClick={handleAdd} disabled={!name.trim() || !phone.trim() || submitting} className="flex-1 h-11 font-bold">
            {submitting ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <UserPlus className="mr-2 w-4 h-4" />}Add Member
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Workout Plan Editor ──────────────────────────────────────────────────────

function WorkoutPlanEditor({ plan, onSave, onClose }: { plan: WorkoutPlan; onSave: (p: WorkoutPlan) => void; onClose: () => void }) {
  const [editing, setEditing] = useState<WorkoutPlan>({ ...plan, sessions: plan.sessions.map(s => ({ ...s, exercises: [...s.exercises] })) })
  const [saving, setSaving] = useState(false)

  const upd = (fn: (p: WorkoutPlan) => WorkoutPlan) => setEditing(fn)
  const updSession = (id: string, fn: (s: WorkoutSession) => WorkoutSession) =>
    upd(p => ({ ...p, sessions: p.sessions.map(s => s.id === id ? fn(s) : s) }))
  const updExercise = (sid: string, idx: number, fn: (e: Exercise) => Exercise) =>
    updSession(sid, s => ({ ...s, exercises: s.exercises.map((e, i) => i === idx ? fn(e) : e) }))

  const handleSave = () => {
    if (!editing.name.trim()) return
    setSaving(true)
    setTimeout(() => { onSave({ ...editing, id: editing.id || `wp${Date.now()}` }); setSaving(false); onClose() }, 400)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border p-6 space-y-5 max-h-[90vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{plan.id ? "Edit Plan" : "New Workout Plan"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>

        {/* Name / Goal / Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Plan Name *</label>
            <input value={editing.name} onChange={e => upd(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Beginner Strength, Weight Loss 12W"
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Goal</label>
            <select value={editing.goal || ""} onChange={e => upd(p => ({ ...p, goal: e.target.value || null }))}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select goal…</option>
              {["Weight Loss","Muscle Gain","Endurance","General Fitness","Flexibility","Powerlifting"].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Notes</label>
            <input value={editing.notes || ""} onChange={e => upd(p => ({ ...p, notes: e.target.value || null }))}
              placeholder="e.g. Focus on progressive overload, rest 48h between sessions"
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        {/* Sessions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Workout Sessions</h3>
            <button onClick={() => upd(p => ({ ...p, sessions: [...p.sessions, newSession()] }))}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80">
              <Plus className="w-3.5 h-3.5" />Add Session
            </button>
          </div>
          {editing.sessions.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground">
              No sessions yet — click &ldquo;Add Session&rdquo; to create a &ldquo;Chest Day&rdquo;, &ldquo;Full Body&rdquo;, etc.
            </div>
          )}
          {editing.sessions.map(session => (
            <div key={session.id} className="bg-muted/30 border border-border rounded-xl overflow-hidden">
              {/* Session header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border flex-wrap">
                <input value={session.name}
                  onChange={e => updSession(session.id, s => ({ ...s, name: e.target.value }))}
                  placeholder="Session name (e.g. Chest Day, Full Body)"
                  className="flex-1 min-w-[140px] px-2.5 py-1.5 rounded-lg border border-border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30" />
                <div className="flex gap-1">
                  {(["workout","cardio"] as const).map(t => (
                    <button key={t} onClick={() => updSession(session.id, s => ({ ...s, type: t }))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                        session.type === t
                          ? t === "cardio" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                          : "text-muted-foreground hover:bg-muted"
                      }`}>{t}</button>
                  ))}
                </div>
                <button onClick={() => upd(p => ({ ...p, sessions: p.sessions.filter(s => s.id !== session.id) }))}
                  className="p-1 text-muted-foreground hover:text-red-500 ml-auto">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {/* Exercises */}
              <div className="p-3 space-y-2">
                {session.exercises.length > 0 && (
                  <div className="grid grid-cols-[1fr_50px_58px_66px_60px_26px] gap-1.5 px-1">
                    {["Exercise","Sets","Reps","Weight","Rest",""].map(h => (
                      <span key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</span>
                    ))}
                  </div>
                )}
                {session.exercises.map((ex, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_50px_58px_66px_60px_26px] gap-1.5 items-center">
                    <input value={ex.name} placeholder="Bench Press" autoComplete="off"
                      onChange={e => updExercise(session.id, idx, ex => ({ ...ex, name: e.target.value }))}
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 w-full" />
                    <input value={ex.sets} type="number" min={1}
                      onChange={e => updExercise(session.id, idx, ex => ({ ...ex, sets: parseInt(e.target.value) || 0 }))}
                      className="px-1.5 py-1.5 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 w-full" />
                    <input value={ex.reps} placeholder="10"
                      onChange={e => updExercise(session.id, idx, ex => ({ ...ex, reps: e.target.value }))}
                      className="px-1.5 py-1.5 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 w-full" />
                    <input value={ex.weight} placeholder="60kg"
                      onChange={e => updExercise(session.id, idx, ex => ({ ...ex, weight: e.target.value }))}
                      className="px-1.5 py-1.5 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 w-full" />
                    <input value={ex.rest} placeholder="60s"
                      onChange={e => updExercise(session.id, idx, ex => ({ ...ex, rest: e.target.value }))}
                      className="px-1.5 py-1.5 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 w-full" />
                    <button onClick={() => updSession(session.id, s => ({ ...s, exercises: s.exercises.filter((_, i) => i !== idx) }))}
                      className="p-1 text-muted-foreground hover:text-red-500 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => updSession(session.id, s => ({ ...s, exercises: [...s.exercises, { name: "", sets: 3, reps: "10", weight: "", rest: "60s" }] }))}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 mt-1">
                  <Plus className="w-3.5 h-3.5" />Add Exercise
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button className="flex-1" disabled={saving || !editing.name.trim()} onClick={handleSave}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {plan.id ? "Save Changes" : "Create Plan"}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Diet Plan Editor ─────────────────────────────────────────────────────────

function DietPlanEditor({ plan, onSave, onClose }: { plan: DietPlan; onSave: (p: DietPlan) => void; onClose: () => void }) {
  const [editing, setEditing] = useState<DietPlan>({ ...plan, meals: plan.meals.map(m => ({ ...m, foods: [...m.foods] })) })
  const [saving, setSaving] = useState(false)

  const upd = (fn: (p: DietPlan) => DietPlan) => setEditing(fn)
  const updMeal = (idx: number, fn: (m: Meal) => Meal) =>
    upd(p => ({ ...p, meals: p.meals.map((m, i) => i === idx ? fn(m) : m) }))

  const handleSave = () => {
    if (!editing.name.trim()) return
    setSaving(true)
    setTimeout(() => { onSave({ ...editing, id: editing.id || `dp${Date.now()}` }); setSaving(false); onClose() }, 400)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border p-6 space-y-5 max-h-[90vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{plan.id ? "Edit Diet Plan" : "New Diet Plan"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Plan Name *</label>
            <input value={editing.name} onChange={e => upd(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Weight Loss Nutrition, Lean Bulk Diet"
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Goal</label>
            <select value={editing.goal || ""} onChange={e => upd(p => ({ ...p, goal: e.target.value || null }))}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select goal…</option>
              {["Weight Loss","Muscle Gain","Maintenance","Lean Bulk","Fat Loss + Muscle Gain"].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Notes</label>
            <input value={editing.notes || ""} onChange={e => upd(p => ({ ...p, notes: e.target.value || null }))}
              placeholder="e.g. Avoid processed sugar, drink 3L water"
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        {/* Daily targets */}
        <div>
          <h3 className="text-sm font-bold mb-3">Daily Targets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[{ label: "Calories (kcal)", key: "totalCalories" }, { label: "Protein (g)", key: "protein" }, { label: "Carbs (g)", key: "carbs" }, { label: "Fat (g)", key: "fat" }].map(({ label, key }) => (
              <div key={key}>
                <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                <input value={(editing as any)[key] || ""} type="number" min={0}
                  onChange={e => upd(p => ({ ...p, [key]: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            ))}
          </div>
        </div>

        {/* Meals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Meals</h3>
            <button onClick={() => upd(p => ({ ...p, meals: [...p.meals, { name: "Snack", time: "", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] }] }))}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80">
              <Plus className="w-3.5 h-3.5" />Add Meal
            </button>
          </div>
          <div className="space-y-3">
            {editing.meals.map((meal, idx) => (
              <div key={idx} className="bg-muted/30 border border-border rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input value={meal.name} onChange={e => updMeal(idx, m => ({ ...m, name: e.target.value }))}
                    placeholder="Meal name" className="flex-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={meal.time} onChange={e => updMeal(idx, m => ({ ...m, time: e.target.value }))}
                    placeholder="7:00 AM" className="w-24 px-2.5 py-1.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  <button onClick={() => upd(p => ({ ...p, meals: p.meals.filter((_, i) => i !== idx) }))}
                    className="p-1 text-muted-foreground hover:text-red-500 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[{ label: "Calories", key: "calories" }, { label: "Protein (g)", key: "protein" }, { label: "Carbs (g)", key: "carbs" }, { label: "Fat (g)", key: "fat" }].map(({ label, key }) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                      <input value={(meal as any)[key] || ""} type="number" min={0}
                        onChange={e => updMeal(idx, m => ({ ...m, [key]: parseInt(e.target.value) || 0 }))}
                        className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Foods (one per line)</label>
                  <textarea value={meal.foods.join("\n")} rows={2}
                    onChange={e => updMeal(idx, m => ({ ...m, foods: e.target.value.split("\n") }))}
                    placeholder={"Oats 100g\nBanana\nMilk 200ml"}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button className="flex-1" disabled={saving || !editing.name.trim()} onClick={handleSave}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {plan.id ? "Save Changes" : "Create Diet Plan"}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Preview ─────────────────────────────────────────────────────────────

type Tab = "members" | "leads" | "billing" | "plans"

function OnboardPreview() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const params = useSearchParams()
  const gymName = params.get("name") || "Your Gym"
  const mapsUrl = params.get("url") || ""

  // Console state
  const [members, setMembers] = useState<Member[]>(INIT_MEMBERS)
  const [leads, setLeads] = useState<Lead[]>(INIT_LEADS)
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(INIT_PLANS)
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(INIT_DIET_PLANS)
  const [activeTab, setActiveTab] = useState<Tab>("members")
  const [memberSearch, setMemberSearch] = useState("")
  const [showAddMember, setShowAddMember] = useState(false)
  const [justAddedId, setJustAddedId] = useState<string | null>(null)
  const [tabClicks, setTabClicks] = useState(0)

  // Plan editors
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null)
  const [editingDietPlan, setEditingDietPlan] = useState<DietPlan | null>(null)

  // Login gate
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [showLoginBanner, setShowLoginBanner] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const hasRedirected = useRef(false)
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return; hasTracked.current = true
    track("onboard_console_viewed", { gymName, hasMapsUrl: !!mapsUrl })
    fetch("/api/onboarding/lead", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gymName, mapsUrl: mapsUrl || null, step: "preview_viewed" }) }).catch(() => {})
  }, [gymName, mapsUrl])

  useEffect(() => {
    const t = setTimeout(() => { if (!bannerDismissed) { setShowLoginBanner(true); track("onboard_signup_nudge_shown", { trigger: "timer" }) } }, 10000)
    return () => clearTimeout(t)
  }, [bannerDismissed])

  useEffect(() => { if (tabClicks >= 3 && !bannerDismissed) { setShowLoginBanner(true); track("onboard_signup_nudge_shown", { trigger: "tab_clicks" }) } }, [tabClicks, bannerDismissed])

  useEffect(() => {
    if (session && !hasRedirected.current && sessionStatus === "authenticated") {
      hasRedirected.current = true
      track("onboard_authenticated", { gymName })

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
            router.push("/gym/sites")
          })
          .catch(() => router.push("/gym/sites"))
      } else {
        fetch("/api/sites/create-template", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gymName }),
        })
          .then(() => router.push("/gym/sites"))
          .catch(() => router.push("/gym/sites"))
      }
    }
  }, [session, sessionStatus, gymName, mapsUrl, router])

  const handleTab = (tab: Tab) => { setActiveTab(tab); setTabClicks(c => c + 1); track("onboard_tab_clicked", { tab }) }
  const handleAddMember = (m: Member) => { setMembers(prev => [m, ...prev]); setJustAddedId(m.id); setTimeout(() => setJustAddedId(null), 3000); track("onboard_member_added") }
  const handleMarkContacted = (id: string) => setLeads(prev => prev.map(l => l.id === id ? { ...l, status: "contacted" as LeadStatus } : l))
  const openLogin = (source: string) => { track("onboard_signup_clicked", { source }); setLoginModalOpen(true) }

  // Derived
  const filteredMembers = memberSearch
    ? members.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.phone.includes(memberSearch))
    : members
  const active = members.filter(m => m.status === "active" && daysUntil(new Date(m.endDate)) > 7)
  const expiring = members.filter(m => m.status === "active" && daysUntil(new Date(m.endDate)) >= 0 && daysUntil(new Date(m.endDate)) <= 7)
  const expired = members.filter(m => m.status === "expired" || daysUntil(new Date(m.endDate)) < 0)
  const totalRevenue = DEMO_PAYMENTS.reduce((s, p) => s + p.totalAmount, 0)
  const totalGST = DEMO_PAYMENTS.reduce((s, p) => s + p.cgst + p.sgst, 0)
  const thisMonthRevenue = DEMO_PAYMENTS.slice(-2).reduce((s, p) => s + p.totalAmount, 0)
  const newLeads = leads.filter(l => l.status === "new").length

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { key: "members", label: "Members",  icon: Users,         badge: expiring.length || undefined },
    { key: "leads",   label: "Leads",    icon: Inbox,         badge: newLeads || undefined },
    { key: "billing", label: "Billing",  icon: IndianRupee },
    { key: "plans",   label: "Plans",    icon: Dumbbell },
  ]

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      {showAddMember && <AddMemberModal open onClose={() => setShowAddMember(false)} onAdd={handleAddMember} gymName={gymName} mapsUrl={mapsUrl} />}
      {editingPlan && <WorkoutPlanEditor plan={editingPlan} onSave={p => { setWorkoutPlans(prev => prev.some(x => x.id === p.id) ? prev.map(x => x.id === p.id ? p : x) : [...prev, p]); setEditingPlan(null) }} onClose={() => setEditingPlan(null)} />}
      {editingDietPlan && <DietPlanEditor plan={editingDietPlan} onSave={p => { setDietPlans(prev => prev.some(x => x.id === p.id) ? prev.map(x => x.id === p.id ? p : x) : [...prev, p]); setEditingDietPlan(null) }} onClose={() => setEditingDietPlan(null)} />}

      <div className="min-h-screen bg-gray-50 flex flex-col pb-28">

        {/* Free website banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2.5">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Globe className="w-4 h-4 shrink-0" />
              <span>🎉 <span className="font-black">{gymName}</span>&apos;s free website is ready!</span>
            </div>
            <Link href={`/gyms/template?name=${encodeURIComponent(gymName)}&theme=retro${mapsUrl ? `&url=${encodeURIComponent(mapsUrl)}` : ""}`}
              onClick={() => track("onboard_edit_website_clicked", { gymName })}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg px-3 py-1.5 text-xs font-black transition-colors shrink-0">
              ✏️ Edit Your Website
            </Link>
          </div>
        </div>

        {/* Sticky nav */}
        <div className="bg-white border-b border-border px-4 h-12 flex items-center justify-between sticky top-0 z-30">
          <Link href="/gyms" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center"><MapPin className="w-3.5 h-3.5 text-primary-foreground" /></div>
            <span className="font-bold text-sm hidden sm:block">MapToSite <span className="text-primary">Fitness</span></span>
          </Link>
          {sessionStatus !== "loading" && !session && (
            <Button size="sm" onClick={() => openLogin("nav")} className="h-8 text-xs font-bold px-3">Sign up free</Button>
          )}
        </div>

        {/* Console */}
        <div className="flex-1 px-3 sm:px-4 py-5">
          <div className="max-w-5xl mx-auto">
            <div className="mb-4">
              <h1 className="text-lg font-black">{gymName}</h1>
              <p className="text-xs text-muted-foreground">Your gym management console — members, leads, billing and plans</p>
            </div>

            <div className="rounded-2xl border border-border shadow-xl overflow-hidden bg-white">
              {/* Browser chrome */}
              <div className="bg-gray-100 px-3 py-2 border-b border-border flex items-center gap-2.5">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-2.5 py-0.5 text-xs text-muted-foreground font-mono hidden sm:block truncate border border-gray-200">
                  maptosite.app/console/{gymName.toLowerCase().replace(/\s+/g, "-")}
                </div>
                <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-auto sm:ml-0">Preview</span>
              </div>

              {/* Console header */}
              <div className="border-b border-border bg-white px-4 h-12 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0"><Dumbbell className="w-4 h-4 text-primary-foreground" /></div>
                <span className="font-bold text-sm">{gymName}</span>
                <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full font-medium hidden sm:inline">Console</span>
                <div className="ml-auto flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-xs text-green-600 font-semibold hidden sm:block">Live</span></div>
              </div>

              {/* Tabs */}
              <div className="border-b border-border bg-white overflow-x-auto scrollbar-none">
                <div className="flex min-w-max">
                  {tabs.map(({ key, label, icon: Icon, badge }) => (
                    <button key={key} onClick={() => handleTab(key)}
                      className={`relative flex items-center gap-1.5 px-4 sm:px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${activeTab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-gray-50"}`}>
                      <Icon className="w-4 h-4" />{label}
                      {badge ? <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{badge}</span> : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="p-4 sm:p-5 space-y-4 bg-white">

                {/* ── MEMBERS ── */}
                {activeTab === "members" && (
                  <>
                    {expiring.length > 0 && (
                      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                        <Bell className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-amber-900">🔔 Auto-reminders scheduled for {expiring.length} expiring member{expiring.length > 1 ? "s" : ""}</p>
                          <p className="text-xs text-amber-700 mt-0.5">{expiring.map(m => `${m.name} (${daysUntil(new Date(m.endDate))}d)`).join(" · ")} — WhatsApp &amp; email auto-sent</p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { label: "Total", value: members.length, icon: Users, color: "text-foreground", bg: "bg-gray-50", border: "border-gray-200" },
                        { label: "Active", value: active.length, icon: CheckCircle, color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
                        { label: "Expiring", value: expiring.length, icon: Clock, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
                        { label: "Expired", value: expired.length, icon: AlertCircle, color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 sm:p-4`}>
                          <div className={`flex items-center gap-1.5 mb-1 ${s.color}`}><s.icon className="w-3.5 h-3.5 shrink-0" /><span className="text-xs font-semibold">{s.label}</span></div>
                          <p className="text-2xl sm:text-3xl font-black">{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search by name or phone…" value={memberSearch} onChange={e => setMemberSearch(e.target.value)} className="pl-9 h-10 text-sm" />
                      </div>
                      <Button onClick={() => setShowAddMember(true)} className="h-10 px-3 sm:px-4 font-bold shrink-0">
                        <Plus className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Add Member</span>
                      </Button>
                    </div>
                    {/* Mobile cards */}
                    <div className="sm:hidden space-y-2">
                      <AnimatePresence>
                        {filteredMembers.map(m => (
                          <motion.div key={m.id}
                            initial={m.id === justAddedId ? { opacity: 0, scale: 0.97 } : false}
                            animate={{ opacity: 1, scale: 1 }}
                            className="border border-border rounded-xl p-3.5 flex items-start gap-3 bg-white">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0">{m.name.charAt(0)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5"><p className="font-bold text-sm truncate">{m.name}</p><StatusBadge member={m} /></div>
                              <p className="text-xs text-muted-foreground">{m.phone} · {m.membershipTitle}</p>
                              <p className="text-xs text-muted-foreground">Expires {formatDate(new Date(m.endDate))}</p>
                            </div>
                            <a href={`https://wa.me/91${m.phone}?text=${encodeURIComponent(`Hi ${m.name.split(" ")[0]}, your membership at ${gymName} expires soon!`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center shrink-0 hover:bg-[#25D366]/20 transition-colors">
                              <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            </a>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    {/* Desktop table */}
                    <div className="hidden sm:block rounded-xl border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-border bg-gray-50">
                          {["Member","Plan","Expires","Status",""].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {filteredMembers.map((m, i) => (
                            <tr key={m.id} className={`border-b border-border last:border-0 ${m.id === justAddedId ? "bg-green-50" : i % 2 === 1 ? "bg-gray-50/50" : ""}`}>
                              <td className="px-4 py-3"><div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">{m.name.charAt(0)}</div>
                                <div><p className="font-semibold">{m.name}</p><p className="text-xs text-muted-foreground">{m.phone}</p></div>
                              </div></td>
                              <td className="px-4 py-3"><p className="font-medium text-sm">{m.membershipTitle}</p><p className="text-xs text-muted-foreground">{m.membershipPrice}</p></td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(new Date(m.endDate))}</td>
                              <td className="px-4 py-3"><StatusBadge member={m} /></td>
                              <td className="px-4 py-3"><a href={`https://wa.me/91${m.phone}?text=${encodeURIComponent(`Hi ${m.name.split(" ")[0]}, your membership at ${gymName} expires soon!`)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-colors">
                                <MessageCircle className="w-3.5 h-3.5" />WhatsApp
                              </a></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-2.5 pt-1">
                      {[
                        { icon: Bell, title: "Auto-reminders", desc: "WhatsApp + email 7d & 1d before expiry", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                        { icon: Mail, title: "Email reports", desc: "Monthly summary sent to your inbox", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                        { icon: TrendingUp, title: "Renewal tracking", desc: "See exactly who is about to lapse", color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
                      ].map(f => (
                        <div key={f.title} className={`${f.bg} border ${f.border} rounded-xl p-3.5 flex items-start gap-3`}>
                          <f.icon className={`w-4 h-4 ${f.color} shrink-0 mt-0.5`} />
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
                        { label: "New", value: leads.filter(l => l.status === "new").length, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
                        { label: "Contacted", value: leads.filter(l => l.status === "contacted").length, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
                        { label: "Converted", value: leads.filter(l => l.status === "converted").length, color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 sm:p-4`}>
                          <p className={`text-xs font-semibold ${s.color} mb-1`}>{s.label}</p>
                          <p className="text-2xl sm:text-3xl font-black">{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                      <Globe className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground leading-relaxed"><span className="font-bold">Leads come from your gym website automatically.</span> Every WhatsApp click and form submission is captured here — nothing to do manually.</p>
                    </div>
                    <div className="space-y-2">
                      {leads.map(lead => (
                        <motion.div key={lead.id} layout className="border border-border rounded-xl p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0">{lead.name.charAt(0)}</div>
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
                            <a href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent(`Hi ${lead.name.split(" ")[0]}, thanks for your enquiry at ${gymName}!`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-colors">
                              <MessageCircle className="w-3.5 h-3.5" />Chat
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

                {/* ── BILLING ── */}
                {activeTab === "billing" && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { label: "This Month", value: fmtINR(thisMonthRevenue), icon: Calendar, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
                        { label: `FY ${FY}`, value: fmtINR(totalRevenue), icon: TrendingUp, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
                        { label: "GST Collected", value: fmtINR(totalGST), icon: Receipt, color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 sm:p-4`}>
                          <div className={`flex items-center gap-1.5 mb-1.5 ${s.color}`}><s.icon className="w-3.5 h-3.5 shrink-0" /><span className="text-xs font-semibold">{s.label}</span></div>
                          <p className="text-xl sm:text-2xl font-black">{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {[
                        { icon: Receipt, title: "GST invoices auto-generated", desc: "Every payment creates a CGST + SGST invoice" },
                        { icon: Mail, title: "Invoice sent by email", desc: "Members receive their invoice automatically" },
                      ].map(f => (
                        <div key={f.title} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                          <f.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div><p className="text-xs font-bold">{f.title}</p><p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p></div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead><tr className="border-b border-border bg-gray-50">
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Invoice</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Member</th>
                            <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Plan</th>
                            <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Total</th>
                          </tr></thead>
                          <tbody>
                            {DEMO_PAYMENTS.map((p, i) => (
                              <tr key={p.id} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-gray-50/50" : ""}`}>
                                <td className="px-4 py-3"><p className="font-mono text-xs font-bold">{p.invoiceNumber}</p><span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">paid</span></td>
                                <td className="px-4 py-3 font-medium text-sm">{p.memberName}</td>
                                <td className="px-4 py-3 text-muted-foreground text-sm hidden sm:table-cell">{p.planTitle}</td>
                                <td className="px-4 py-3 text-right font-bold">{fmtINR(p.totalAmount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* ── PLANS ── */}
                {activeTab === "plans" && (
                  <div className="space-y-6">

                    {/* Personal training callout */}
                    <div className="flex items-start gap-3 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3.5">
                      <Star className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-purple-800 leading-relaxed"><span className="font-bold">Personal training reminders:</span> Assign a workout plan to any member. They receive session reminders automatically.</p>
                    </div>

                    {/* Workout Plans */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div><h2 className="text-sm font-black">Workout Plans</h2><p className="text-xs text-muted-foreground">Create sessions with exercises, sets, reps &amp; rest</p></div>
                        <Button size="sm" onClick={() => setEditingPlan(emptyWorkoutPlan())} className="h-9 px-3 font-bold text-sm">
                          <Plus className="w-4 h-4 mr-1.5" />New Plan
                        </Button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {workoutPlans.map(plan => (
                          <motion.div key={plan.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-primary/30 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between gap-2">
                              <div><h3 className="font-bold text-sm">{plan.name}</h3>{plan.goal && <p className="text-xs text-muted-foreground mt-0.5">{plan.goal}</p>}</div>
                              <span className="shrink-0 text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{plan.sessions.length} session{plan.sessions.length !== 1 ? "s" : ""}</span>
                            </div>
                            {plan.notes && <p className="text-xs text-muted-foreground line-clamp-2">{plan.notes}</p>}
                            {/* Session preview */}
                            <div className="space-y-1">
                              {plan.sessions.slice(0, 2).map(s => (
                                <div key={s.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Dumbbell className="w-3 h-3 shrink-0" />
                                  <span className="font-medium text-foreground">{s.name}</span>
                                  <span>·</span>
                                  <span>{s.exercises.length} exercise{s.exercises.length !== 1 ? "s" : ""}</span>
                                </div>
                              ))}
                              {plan.sessions.length > 2 && <p className="text-xs text-muted-foreground ml-5">+{plan.sessions.length - 2} more sessions</p>}
                            </div>
                            <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                              <button onClick={() => setEditingPlan(plan)} className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors">
                                <ChevronRight className="w-3.5 h-3.5" />Edit Plan
                              </button>
                              <button onClick={() => setWorkoutPlans(prev => prev.filter(p => p.id !== plan.id))}
                                className="h-8 px-2.5 rounded-lg border border-border text-red-500 hover:bg-red-50 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                        {workoutPlans.length === 0 && (
                          <div className="sm:col-span-2 rounded-xl border-2 border-dashed border-border p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setEditingPlan(emptyWorkoutPlan())}>
                            <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="font-medium text-sm">Create your first workout plan</p><p className="text-xs text-muted-foreground mt-1">Add sessions, exercises, sets &amp; reps</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Diet Plans */}
                    <div className="border-t border-border pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div><h2 className="text-sm font-black">Diet Plans</h2><p className="text-xs text-muted-foreground">Meals, macros and nutrition targets</p></div>
                        <Button size="sm" onClick={() => setEditingDietPlan(emptyDietPlan())} className="h-9 px-3 font-bold text-sm">
                          <Plus className="w-4 h-4 mr-1.5" />New Diet Plan
                        </Button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {dietPlans.map(plan => (
                          <motion.div key={plan.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-primary/30 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between gap-2">
                              <div><h3 className="font-bold text-sm">{plan.name}</h3>{plan.goal && <p className="text-xs text-muted-foreground mt-0.5">{plan.goal}</p>}</div>
                              {plan.totalCalories > 0 && <span className="shrink-0 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{plan.totalCalories} kcal</span>}
                            </div>
                            {(plan.protein > 0 || plan.carbs > 0 || plan.fat > 0) && (
                              <div className="flex gap-3 text-xs text-muted-foreground">
                                {plan.protein > 0 && <span className="font-semibold text-foreground">P: {plan.protein}g</span>}
                                {plan.carbs > 0 && <span className="font-semibold text-foreground">C: {plan.carbs}g</span>}
                                {plan.fat > 0 && <span className="font-semibold text-foreground">F: {plan.fat}g</span>}
                              </div>
                            )}
                            <div className="space-y-1">
                              {plan.meals.slice(0, 3).map((m, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                  <span className="font-medium text-foreground">{m.name}</span>
                                  <span className="text-muted-foreground">{m.time}{m.calories > 0 ? ` · ${m.calories} kcal` : ""}</span>
                                </div>
                              ))}
                              {plan.meals.length > 3 && <p className="text-xs text-muted-foreground">+{plan.meals.length - 3} more meals</p>}
                            </div>
                            <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                              <button onClick={() => setEditingDietPlan(plan)} className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors">
                                <FileText className="w-3.5 h-3.5" />Edit Plan
                              </button>
                              <button onClick={() => setDietPlans(prev => prev.filter(p => p.id !== plan.id))}
                                className="h-8 px-2.5 rounded-lg border border-border text-red-500 hover:bg-red-50 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                        {dietPlans.length === 0 && (
                          <div className="sm:col-span-2 rounded-xl border-2 border-dashed border-border p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setEditingDietPlan(emptyDietPlan())}>
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="font-medium text-sm">Create your first diet plan</p><p className="text-xs text-muted-foreground mt-1">Set meals, macros and nutrition targets</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 shrink-0">
                      <span className="text-lg">🛡️</span>
                    </div>
                    <div>
                      <p className="font-black text-sm">Book a demo now and get a <span className="text-amber-600">50% off discount coupon</span></p>
                      <p className="text-xs text-muted-foreground mt-0.5">Or sign up free — <span className="font-semibold text-foreground">{gymName}</span> goes live in 60 seconds</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button onClick={() => openLogin("sticky_banner")} className="h-10 font-bold text-sm flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white"><Zap className="w-4 h-4 mr-1.5" />Get 50% Off Now</Button>
                  </div>
                </div>
              </div>
              <button onClick={() => { setBannerDismissed(true); track("onboard_signup_nudge_dismissed") }} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default function OnboardPreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
      <OnboardPreview />
    </Suspense>
  )
}
