"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft, Loader2, Phone, Mail, Calendar, Dumbbell,
  Users, Plus, Trash2, Save, Send, FileText, CheckCircle,
  AlertCircle, Clock, IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { daysUntil, formatDate, fmtINR } from "@/lib/gym-utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Exercise { name: string; sets: number; reps: string; weight: string; rest: string }
interface WorkoutSession { id: string; name: string; type: "workout" | "cardio"; exercises: Exercise[]; notes: string }
interface WorkoutPlan {
  goal: string; notes: string
  sessions: WorkoutSession[]
}
interface Meal { name: string; time: string; calories: number; protein: number; carbs: number; fat: number; foods: string[] }
interface DietPlan {
  goal: string; totalCalories: number; protein: number; carbs: number; fat: number; notes: string
  meals: Meal[]
}
interface Member {
  id: string; name: string; email: string | null; phone: string
  membershipTitle: string; membershipPrice: string; durationMonths: number; pricePerMonth: number
  startDate: string; endDate: string; status: string
  workoutPlan: WorkoutPlan | null; dietPlan: DietPlan | null
}
interface Payment {
  id: string; invoiceNumber: string; invoiceDate: string
  planTitle: string; totalAmount: number; type: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WORKOUT_GOALS = ["Weight Loss", "Muscle Gain", "Endurance", "General Fitness", "Flexibility", "Powerlifting"]
const DIET_GOALS = ["Weight Loss", "Muscle Gain", "Maintenance", "Lean Bulk", "Fat Loss + Muscle Gain"]

function makeDefaultWorkout(): WorkoutPlan {
  return { goal: "", notes: "", sessions: [] }
}

function newSession(): WorkoutSession {
  return { id: Math.random().toString(36).slice(2), name: "", type: "workout", exercises: [], notes: "" }
}

function makeDefaultDiet(): DietPlan {
  return {
    goal: "", totalCalories: 0, protein: 0, carbs: 0, fat: 0, notes: "",
    meals: [
      { name: "Breakfast", time: "7:00 AM", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] },
      { name: "Lunch", time: "1:00 PM", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] },
      { name: "Dinner", time: "7:00 PM", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] },
    ],
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MacroBar({ label, grams, kcalPer, color }: { label: string; grams: number; kcalPer: number; color: string }) {
  return (
    <div className={`flex-1 rounded-xl p-4 border`} style={{ borderColor: `${color}30`, background: `${color}08` }}>
      <div className="text-2xl font-bold" style={{ color }}>{grams}<span className="text-sm font-normal ml-1">g</span></div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      <div className="text-xs font-medium mt-1" style={{ color }}>{Math.round(grams * kcalPer)} kcal</div>
    </div>
  )
}

function inputCls() {
  return "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MemberProfilePage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const params = useParams()
  const siteId = params.siteId as string
  const memberId = params.memberId as string

  const [member, setMember] = useState<Member | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "workout" | "diet">("overview")

  const [workout, setWorkout] = useState<WorkoutPlan>(makeDefaultWorkout())
  const [diet, setDiet] = useState<DietPlan>(makeDefaultDiet())
  const [savingWorkout, setSavingWorkout] = useState(false)
  const [savingDiet, setSavingDiet] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [sendConfig, setSendConfig] = useState({ includeWorkout: true, includeDiet: true })

  useEffect(() => { if (authStatus === "unauthenticated") router.push("/") }, [authStatus])

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/console/${siteId}/members/${memberId}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => {
        setMember(d.member)
        setPayments(d.payments || [])
        if (d.member.workoutPlan) setWorkout(d.member.workoutPlan)
        if (d.member.dietPlan) setDiet(d.member.dietPlan)
        setLoading(false)
      })
      .catch(() => router.push(`/console/${siteId}`))
  }, [session, siteId, memberId])

  // ─── Workout handlers ──────────────────────────────────────────────────────

  const addSession = () =>
    setWorkout((w) => ({ ...w, sessions: [...w.sessions, newSession()] }))

  const removeSession = (id: string) =>
    setWorkout((w) => ({ ...w, sessions: w.sessions.filter((s) => s.id !== id) }))

  const updateSession = (id: string, patch: Partial<WorkoutSession>) =>
    setWorkout((w) => ({ ...w, sessions: w.sessions.map((s) => s.id === id ? { ...s, ...patch } : s) }))

  const addExercise = (sessionId: string) =>
    updateSession(sessionId, {
      exercises: [...(workout.sessions.find((s) => s.id === sessionId)?.exercises || []),
        { name: "", sets: 3, reps: "10", weight: "", rest: "60s" }],
    })

  const updateExercise = (sessionId: string, idx: number, patch: Partial<Exercise>) => {
    const session = workout.sessions.find((s) => s.id === sessionId)
    if (!session) return
    const exs = [...session.exercises]
    exs[idx] = { ...exs[idx], ...patch }
    updateSession(sessionId, { exercises: exs })
  }

  const removeExercise = (sessionId: string, idx: number) => {
    const session = workout.sessions.find((s) => s.id === sessionId)
    if (!session) return
    updateSession(sessionId, { exercises: session.exercises.filter((_, i) => i !== idx) })
  }

  const handleSaveWorkout = async () => {
    setSavingWorkout(true)
    await fetch(`/api/console/${siteId}/members/${memberId}/plans`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workoutPlan: workout }),
    })
    setSavingWorkout(false)
  }

  // ─── Diet handlers ─────────────────────────────────────────────────────────

  const updateMeal = (idx: number, patch: Partial<Meal>) =>
    setDiet((d) => { const meals = [...d.meals]; meals[idx] = { ...meals[idx], ...patch }; return { ...d, meals } })

  const addMeal = () =>
    setDiet((d) => ({ ...d, meals: [...d.meals, { name: "Snack", time: "", calories: 0, protein: 0, carbs: 0, fat: 0, foods: [] }] }))

  const removeMeal = (idx: number) =>
    setDiet((d) => ({ ...d, meals: d.meals.filter((_, i) => i !== idx) }))

  const handleSaveDiet = async () => {
    setSavingDiet(true)
    await fetch(`/api/console/${siteId}/members/${memberId}/plans`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dietPlan: diet }),
    })
    setSavingDiet(false)
  }

  // ─── Send plan ─────────────────────────────────────────────────────────────

  const handleSendPlan = async () => {
    setSending(true)
    await fetch(`/api/console/${siteId}/members/${memberId}/send-plan`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendConfig),
    })
    setSending(false)
    setSendSuccess(true)
    setTimeout(() => setSendSuccess(false), 3000)
  }

  // ─── Print ─────────────────────────────────────────────────────────────────

  const handlePrint = () => {
    const workoutHtml = workout.sessions.length ? `
      <h2>💪 Workout Plan</h2>
      ${workout.goal ? `<p><strong>Goal:</strong> ${workout.goal}</p>` : ""}
      ${workout.sessions.map((s) => `
        <h3 style="margin:20px 0 8px;font-size:15px">${s.name || "Unnamed Workout"} <span style="font-size:12px;color:#666;text-transform:capitalize;font-weight:normal">(${s.type})</span></h3>
        ${s.exercises.length ? `
          <table border="1" cellpadding="7" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:13px">
            <tr style="background:#f3f4f6"><th>Exercise</th><th>Sets</th><th>Reps</th><th>Weight</th><th>Rest</th></tr>
            ${s.exercises.map((e) => `<tr><td>${e.name}</td><td>${e.sets}</td><td>${e.reps}</td><td>${e.weight || "—"}</td><td>${e.rest}</td></tr>`).join("")}
          </table>` : "<p style='color:#999;font-style:italic'>No exercises.</p>"}
        ${s.notes ? `<p style="font-size:12px;color:#666;font-style:italic">${s.notes}</p>` : ""}
      `).join("")}
      ${workout.notes ? `<p><em>Note: ${workout.notes}</em></p>` : ""}
    ` : ""
    const dietHtml = `
      <h2>🥗 Diet Plan</h2>
      ${diet.goal ? `<p><strong>Goal:</strong> ${diet.goal}</p>` : ""}
      <table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr style="background:#f3f4f6"><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr>
        <tr><td>${diet.totalCalories} kcal</td><td>${diet.protein}g</td><td>${diet.carbs}g</td><td>${diet.fat}g</td></tr>
      </table>
      ${diet.meals.map((m) => `
        <div style="margin-bottom:12px;padding:10px;border:1px solid #e5e7eb;border-radius:6px">
          <strong>${m.name}</strong>${m.time ? ` · ${m.time}` : ""}
          ${m.calories ? ` · ${m.calories} kcal · P:${m.protein}g C:${m.carbs}g F:${m.fat}g` : ""}
          ${m.foods?.filter(Boolean).length ? `<ul style="margin:6px 0 0;padding-left:18px">${m.foods.filter(Boolean).map((f) => `<li>${f}</li>`).join("")}</ul>` : ""}
        </div>
      `).join("")}
      ${diet.notes ? `<p><em>Note: ${diet.notes}</em></p>` : ""}
    `
    const html = `<!DOCTYPE html><html><head><title>Plan — ${member?.name}</title>
      <style>body{font-family:Arial,sans-serif;padding:32px;color:#111;font-size:14px}h2{margin-top:32px}@media print{body{padding:16px}}</style>
    </head><body>
      <h1>${member?.name} — Personalised Plan</h1>
      <p>${member?.membershipTitle} · ${member?.phone}</p>
      ${workoutHtml}${dietHtml}
      <script>window.onload=()=>window.print()</script>
    </body></html>`
    const w = window.open("", "_blank")
    if (w) { w.document.write(html); w.document.close() }
  }

  if (authStatus === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }
  if (!member) return null

  const days = daysUntil(new Date(member.endDate))
  const isExpired = member.status === "expired" || days < 0
  const hasPlans = member.workoutPlan || member.dietPlan

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/console/${siteId}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ChevronLeft className="w-4 h-4" />Console
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <FileText className="w-4 h-4 mr-1.5" />Print PDF
            </Button>
            {member.email && (
              <Button size="sm" onClick={handleSendPlan} disabled={sending || !hasPlans}>
                {sending ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : sendSuccess ? <CheckCircle className="w-4 h-4 mr-1.5" /> : <Send className="w-4 h-4 mr-1.5" />}
                {sendSuccess ? "Sent!" : "Send to Member"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Profile card */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-xl font-bold">{member.name}</h1>
              {isExpired
                ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><AlertCircle className="w-3 h-3" />Expired</span>
                : days <= 7
                ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="w-3 h-3" />Expires in {days}d</span>
                : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Active</span>
              }
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{member.phone}</span>
              {member.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{member.email}</span>}
              <span className="flex items-center gap-1.5"><Dumbbell className="w-3.5 h-3.5" />{member.membershipTitle}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(new Date(member.startDate))} → {formatDate(new Date(member.endDate))}</span>
              <span className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" />₹{member.pricePerMonth.toLocaleString("en-IN")}/mo</span>
            </div>
          </div>
        </div>

        {/* Send config (show only if no email) */}
        {!member.email && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            No email on file — save an email in the Members tab to send plans directly.
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-0">
            {([
              { key: "overview", label: "Overview", icon: Users },
              { key: "workout", label: "Workout Plan", icon: Dumbbell },
              { key: "diet", label: "Diet Plan", icon: FileText },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${activeTab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Days Remaining", value: isExpired ? "Expired" : String(days), color: isExpired ? "text-red-600" : days <= 7 ? "text-amber-600" : "text-green-600" },
                { label: "Duration", value: `${member.durationMonths} month${member.durationMonths > 1 ? "s" : ""}`, color: "text-foreground" },
                { label: "Price / Month", value: `₹${member.pricePerMonth.toLocaleString("en-IN")}`, color: "text-foreground" },
                { label: "Total Paid", value: `₹${(member.durationMonths * member.pricePerMonth).toLocaleString("en-IN")}`, color: "text-primary" },
              ].map((s) => (
                <div key={s.label} className="bg-muted/50 rounded-xl p-4 border border-border/50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {payments.length > 0 && (
              <div>
                <h2 className="text-base font-semibold mb-3">Payment History</h2>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invoice</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Date</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, i) => (
                        <tr key={p.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                          <td className="px-4 py-3">
                            <p className="font-mono text-xs font-semibold">{p.invoiceNumber}</p>
                            <span className={`text-xs capitalize px-1.5 py-0.5 rounded ${p.type === "renewal" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{p.type}</span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{formatDate(new Date(p.invoiceDate))}</td>
                          <td className="px-4 py-3">{p.planTitle}</td>
                          <td className="px-4 py-3 text-right font-bold">{fmtINR(p.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── WORKOUT PLAN ── */}
        {activeTab === "workout" && (
          <div className="space-y-5">
            {/* Goal + notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Goal</label>
                <select value={workout.goal} onChange={(e) => setWorkout((w) => ({ ...w, goal: e.target.value }))} className={inputCls()}>
                  <option value="">Select a goal…</option>
                  {WORKOUT_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">General Notes</label>
                <input value={workout.notes} onChange={(e) => setWorkout((w) => ({ ...w, notes: e.target.value }))}
                  placeholder="e.g. Focus on progressive overload" className={inputCls()} />
              </div>
            </div>

            {/* Sessions */}
            {workout.sessions.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                <Dumbbell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-semibold text-muted-foreground text-sm">No workouts added yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add sessions like "Chest Day", "Back Day", "Leg Day"</p>
                <button onClick={addSession}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
                  <Plus className="w-4 h-4" />Add Workout
                </button>
              </div>
            )}

            <div className="space-y-4">
              {workout.sessions.map((session) => (
                <div key={session.id} className="bg-card border border-border rounded-xl overflow-hidden">
                  {/* Session header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 border-b border-border flex-wrap">
                    <input
                      value={session.name}
                      onChange={(e) => updateSession(session.id, { name: e.target.value })}
                      placeholder="e.g. Chest Day, Push Day, Leg Day…"
                      className="flex-1 min-w-[160px] px-3 py-1.5 rounded-lg border border-border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="flex gap-1">
                      {(["workout", "cardio"] as const).map((t) => (
                        <button key={t} onClick={() => updateSession(session.id, { type: t })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${session.type === t
                            ? t === "cardio" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                            : "text-muted-foreground hover:bg-muted"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <input value={session.notes} onChange={(e) => updateSession(session.id, { notes: e.target.value })}
                      placeholder="Session notes…"
                      className="text-xs px-2 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-1 focus:ring-primary/30 w-44" />
                    <button onClick={() => removeSession(session.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition rounded-lg hover:bg-red-50 ml-auto shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Exercise table */}
                  <div className="p-4">
                    {session.exercises.length > 0 && (
                      <div className="mb-2 grid grid-cols-[1fr_64px_72px_80px_80px_32px] gap-2 px-1">
                        {["Exercise", "Sets", "Reps", "Weight", "Rest Time", ""].map((h) => (
                          <span key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</span>
                        ))}
                      </div>
                    )}
                    <div className="space-y-2">
                      {session.exercises.map((ex, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_64px_72px_80px_80px_32px] gap-2 items-center">
                          <input value={ex.name} onChange={(e) => updateExercise(session.id, idx, { name: e.target.value })}
                            placeholder="e.g. Bench Press" autoComplete="off"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                          <input value={ex.sets} type="number" min={1}
                            onChange={(e) => updateExercise(session.id, idx, { sets: parseInt(e.target.value) || 0 })}
                            className="w-full px-2 py-2 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30" />
                          <input value={ex.reps} onChange={(e) => updateExercise(session.id, idx, { reps: e.target.value })}
                            placeholder="8-12" autoComplete="off"
                            className="w-full px-2 py-2 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30" />
                          <input value={ex.weight} onChange={(e) => updateExercise(session.id, idx, { weight: e.target.value })}
                            placeholder="60 kg" autoComplete="off"
                            className="w-full px-2 py-2 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30" />
                          <input value={ex.rest} onChange={(e) => updateExercise(session.id, idx, { rest: e.target.value })}
                            placeholder="60s" autoComplete="off"
                            className="w-full px-2 py-2 rounded-lg border border-border bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/30" />
                          <button onClick={() => removeExercise(session.id, idx)} className="p-1 text-muted-foreground hover:text-red-500 transition rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addExercise(session.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition mt-3">
                      <Plus className="w-3.5 h-3.5" />Add Exercise
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {workout.sessions.length > 0 && (
              <button onClick={addSession}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition">
                <Plus className="w-4 h-4" />Add Another Workout
              </button>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSaveWorkout} disabled={savingWorkout}>
                {savingWorkout ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Workout Plan
              </Button>
              {member.email && (
                <Button variant="outline" onClick={() => { setSendConfig({ includeWorkout: true, includeDiet: false }); handleSendPlan() }} disabled={sending}>
                  <Send className="w-4 h-4 mr-2" />Send to {member.name.split(" ")[0]}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ── DIET PLAN ── */}
        {activeTab === "diet" && (
          <div className="space-y-5">
            {/* Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Goal</label>
                <select value={diet.goal} onChange={(e) => setDiet((d) => ({ ...d, goal: e.target.value }))} className={inputCls()}>
                  <option value="">Select a goal…</option>
                  {DIET_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Notes</label>
                <input value={diet.notes} onChange={(e) => setDiet((d) => ({ ...d, notes: e.target.value }))}
                  placeholder="e.g. Avoid processed sugar" className={inputCls()} />
              </div>
            </div>

            {/* Macros */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Daily Targets</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Calories (kcal)", key: "totalCalories" },
                  { label: "Protein (g)", key: "protein" },
                  { label: "Carbs (g)", key: "carbs" },
                  { label: "Fat (g)", key: "fat" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                    <input value={(diet as any)[key] || ""} type="number" min={0}
                      onChange={(e) => setDiet((d) => ({ ...d, [key]: parseInt(e.target.value) || 0 }))}
                      className={inputCls()} />
                  </div>
                ))}
              </div>
              {(diet.protein || diet.carbs || diet.fat) ? (
                <div className="flex gap-3">
                  <MacroBar label="Protein" grams={diet.protein} kcalPer={4} color="#2563eb" />
                  <MacroBar label="Carbs" grams={diet.carbs} kcalPer={4} color="#d97706" />
                  <MacroBar label="Fat" grams={diet.fat} kcalPer={9} color="#dc2626" />
                  <div className="flex-1 rounded-xl p-4 border border-border/50 bg-muted/30">
                    <div className="text-2xl font-bold text-foreground">
                      {Math.round(diet.protein * 4 + diet.carbs * 4 + diet.fat * 9)}
                      <span className="text-sm font-normal ml-1">kcal</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">Calculated</div>
                    {diet.totalCalories > 0 && (
                      <div className={`text-xs font-medium mt-1 ${Math.abs(diet.totalCalories - (diet.protein * 4 + diet.carbs * 4 + diet.fat * 9)) < 50 ? "text-green-600" : "text-amber-600"}`}>
                        Target: {diet.totalCalories} kcal
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Meals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Meal Plan</h3>
                <button onClick={addMeal} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition">
                  <Plus className="w-3.5 h-3.5" />Add Meal
                </button>
              </div>
              <div className="space-y-3">
                {diet.meals.map((meal, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <input value={meal.name} onChange={(e) => updateMeal(idx, { name: e.target.value })}
                        placeholder="Meal name" className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30" />
                      <input value={meal.time} onChange={(e) => updateMeal(idx, { time: e.target.value })}
                        placeholder="Time (e.g. 7:00 AM)" className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                      <button onClick={() => removeMeal(idx)} className="p-1 text-muted-foreground hover:text-red-500 transition rounded shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Per-meal macros */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Calories", key: "calories" },
                        { label: "Protein (g)", key: "protein" },
                        { label: "Carbs (g)", key: "carbs" },
                        { label: "Fat (g)", key: "fat" },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                          <input value={(meal as any)[key] || ""} type="number" min={0}
                            onChange={(e) => updateMeal(idx, { [key]: parseInt(e.target.value) || 0 } as any)}
                            className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                      ))}
                    </div>
                    {/* Foods */}
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Foods (one per line)</label>
                      <textarea
                        value={meal.foods.join("\n")}
                        onChange={(e) => updateMeal(idx, { foods: e.target.value.split("\n") })}
                        placeholder={"Oats 100g\nBanana\nMilk 200ml"}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSaveDiet} disabled={savingDiet}>
                {savingDiet ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Diet Plan
              </Button>
              {member.email && (
                <Button variant="outline" onClick={() => { setSendConfig({ includeWorkout: false, includeDiet: true }); handleSendPlan() }} disabled={sending}>
                  <Send className="w-4 h-4 mr-2" />Send to {member.name.split(" ")[0]}
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
