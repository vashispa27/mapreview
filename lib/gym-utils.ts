export function getPlanDurationDays(planTitle: string): number {
  const t = planTitle.toLowerCase()
  if (t.includes("annual") || t.includes("year")) return 365
  if (t.includes("half") || t.includes("6 month") || t.includes("6-month")) return 180
  if (t.includes("quarter") || t.includes("3 month") || t.includes("3-month")) return 90
  return 30
}

export function calcEndDate(startDate: Date, planTitle: string): Date {
  const end = new Date(startDate)
  end.setDate(end.getDate() + getPlanDurationDays(planTitle))
  return end
}

export function calcEndDateByMonths(startDate: Date, months: number): Date {
  const end = new Date(startDate)
  end.setMonth(end.getMonth() + months)
  return end
}

export function formatMonthLabel(months: number): string {
  if (months === 12) return "1 Year"
  if (months === 6) return "6 Months"
  return `${months} Month${months > 1 ? "s" : ""}`
}

export function getCurrentFY(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 1–12
  if (month >= 4) return `${year}-${String(year + 1).slice(2)}`
  return `${year - 1}-${String(year).slice(2)}`
}

export function calculateGST(taxableAmount: number, isInterstate: boolean) {
  const half = parseFloat((taxableAmount * 0.025).toFixed(2))
  const full = parseFloat((taxableAmount * 0.05).toFixed(2))
  if (isInterstate) return { cgst: 0, sgst: 0, igst: full }
  return { cgst: half, sgst: half, igst: 0 }
}

export function fmtINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function getMemberStatus(endDate: Date): "active" | "expired" {
  return new Date() <= endDate ? "active" : "expired"
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function daysUntil(d: Date): number {
  return Math.ceil((d.getTime() - Date.now()) / 86_400_000)
}
