"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft, Loader2, Phone, Mail, Calendar, Dumbbell,
  CheckCircle, AlertCircle, Clock, IndianRupee, Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { daysUntil, formatDate, fmtINR } from "@/lib/gym-utils"

interface Member {
  id: string; name: string; email: string | null; phone: string
  membershipTitle: string; membershipPrice: string; durationMonths: number; pricePerMonth: number
  startDate: string; endDate: string; status: string
  assignedPlanId: string | null
  assignedDietPlanId: string | null
}

interface Payment {
  id: string; invoiceNumber: string; invoiceDate: string
  planTitle: string; totalAmount: number; type: string
}

interface WorkoutPlan {
  id: string; name: string; goal: string | null; sessions: any[]
}

interface DietPlan {
  id: string; name: string; goal: string | null; totalCalories: number
}

export default function MemberProfilePage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const params = useParams()
  const siteId = params.siteId as string
  const memberId = params.memberId as string

  const [member, setMember] = useState<Member | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedPlanId, setSelectedPlanId] = useState("")
  const [assigning, setAssigning] = useState(false)
  const [assignSuccess, setAssignSuccess] = useState(false)
  const [assignError, setAssignError] = useState("")

  const [selectedDietPlanId, setSelectedDietPlanId] = useState("")
  const [assigningDiet, setAssigningDiet] = useState(false)
  const [assignDietSuccess, setAssignDietSuccess] = useState(false)
  const [assignDietError, setAssignDietError] = useState("")

  useEffect(() => { if (authStatus === "unauthenticated") router.push("/") }, [authStatus])

  useEffect(() => {
    if (!session?.user?.id) return
    Promise.all([
      fetch(`/api/console/${siteId}/members/${memberId}`).then((r) => r.ok ? r.json() : Promise.reject()),
      fetch(`/api/console/${siteId}/workout-plans`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/console/${siteId}/diet-plans`).then((r) => r.ok ? r.json() : null),
    ])
      .then(([memberData, plansData, dietPlansData]) => {
        setMember(memberData.member)
        setPayments(memberData.payments || [])
        setPlans(plansData?.plans || [])
        setDietPlans(dietPlansData?.plans || [])
        if (memberData.member.assignedPlanId) setSelectedPlanId(memberData.member.assignedPlanId)
        if (memberData.member.assignedDietPlanId) setSelectedDietPlanId(memberData.member.assignedDietPlanId)
        setLoading(false)
      })
      .catch(() => router.push(`/console/${siteId}`))
  }, [session, siteId, memberId])

  const handleAssign = async () => {
    if (!selectedPlanId) return
    setAssigning(true)
    setAssignError("")
    const res = await fetch(`/api/console/${siteId}/members/${memberId}/assign-plan`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: selectedPlanId }),
    })
    const data = await res.json()
    setAssigning(false)
    if (res.ok) {
      setMember((m) => m ? { ...m, assignedPlanId: selectedPlanId } : m)
      setAssignSuccess(true)
      setTimeout(() => setAssignSuccess(false), 3000)
    } else {
      setAssignError(data.error || "Failed to assign plan")
    }
  }

  const handleAssignDiet = async () => {
    if (!selectedDietPlanId) return
    setAssigningDiet(true)
    setAssignDietError("")
    const res = await fetch(`/api/console/${siteId}/members/${memberId}/assign-diet-plan`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: selectedDietPlanId }),
    })
    const data = await res.json()
    setAssigningDiet(false)
    if (res.ok) {
      setMember((m) => m ? { ...m, assignedDietPlanId: selectedDietPlanId } : m)
      setAssignDietSuccess(true)
      setTimeout(() => setAssignDietSuccess(false), 3000)
    } else {
      setAssignDietError(data.error || "Failed to assign diet plan")
    }
  }

  if (authStatus === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }
  if (!member) return null

  const days = daysUntil(new Date(member.endDate))
  const isExpired = member.status === "expired" || days < 0
  const assignedPlan = plans.find((p) => p.id === member.assignedPlanId)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <Link href={`/console/${siteId}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ChevronLeft className="w-4 h-4" />Console
          </Link>
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

        {/* Stats */}
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

        {/* Assign Workout Plan */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Assigned Workout Plan</h2>
              {assignedPlan
                ? <p className="text-xs text-muted-foreground">Currently on: <span className="font-medium text-foreground">{assignedPlan.name}</span>{assignedPlan.goal ? ` · ${assignedPlan.goal}` : ""}</p>
                : <p className="text-xs text-muted-foreground">No plan assigned yet</p>
              }
            </div>
          </div>

          {plans.length === 0 ? (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-xl p-4">
              No workout plans created yet.{" "}
              <Link href={`/console/${siteId}`} className="text-primary hover:underline" onClick={() => {}}>
                Go to the Plans tab
              </Link>{" "}
              to create one first.
            </div>
          ) : (
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Select Plan</label>
                <select value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Choose a plan…</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}{p.goal ? ` · ${p.goal}` : ""} ({p.sessions.length} sessions)</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAssign} disabled={assigning || !selectedPlanId}>
                {assigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : assignSuccess ? <CheckCircle className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                {assignSuccess ? "Assigned!" : member.email ? "Assign & Email" : "Assign Plan"}
              </Button>
            </div>
          )}

          {assignError && <p className="text-sm text-red-500">{assignError}</p>}
          {assignSuccess && member.email && (
            <p className="text-sm text-green-600 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />Plan assigned and emailed to {member.email}
            </p>
          )}
          {assignSuccess && !member.email && (
            <p className="text-sm text-amber-600">Plan assigned. No email on file — member not notified.</p>
          )}
        </div>

        {/* Assign Diet Plan */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-base">🥗</span>
            </div>
            <div>
              <h2 className="font-semibold">Assigned Diet Plan</h2>
              {(() => { const p = dietPlans.find((p) => p.id === member.assignedDietPlanId); return p
                ? <p className="text-xs text-muted-foreground">Currently on: <span className="font-medium text-foreground">{p.name}</span>{p.goal ? ` · ${p.goal}` : ""}{p.totalCalories > 0 ? ` · ${p.totalCalories} kcal` : ""}</p>
                : <p className="text-xs text-muted-foreground">No diet plan assigned yet</p>
              })()}
            </div>
          </div>

          {dietPlans.length === 0 ? (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-xl p-4">
              No diet plans created yet.{" "}
              <Link href={`/console/${siteId}`} className="text-primary hover:underline">Go to the Plans tab</Link>{" "}to create one first.
            </div>
          ) : (
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Select Diet Plan</label>
                <select value={selectedDietPlanId} onChange={(e) => setSelectedDietPlanId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Choose a diet plan…</option>
                  {dietPlans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}{p.goal ? ` · ${p.goal}` : ""}{p.totalCalories > 0 ? ` (${p.totalCalories} kcal)` : ""}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAssignDiet} disabled={assigningDiet || !selectedDietPlanId}>
                {assigningDiet ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : assignDietSuccess ? <CheckCircle className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                {assignDietSuccess ? "Assigned!" : member.email ? "Assign & Email" : "Assign Plan"}
              </Button>
            </div>
          )}

          {assignDietError && <p className="text-sm text-red-500">{assignDietError}</p>}
          {assignDietSuccess && member.email && (
            <p className="text-sm text-green-600 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />Diet plan assigned and emailed to {member.email}
            </p>
          )}
          {assignDietSuccess && !member.email && (
            <p className="text-sm text-amber-600">Diet plan assigned. No email on file — member not notified.</p>
          )}
        </div>

        {/* Payment History */}
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
      </main>
    </div>
  )
}
