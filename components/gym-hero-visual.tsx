"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Globe, Users, CreditCard, MessageCircle, ShieldCheck, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { track } from "@/lib/analytics"

const FEATURES = [
  { icon: Globe,         title: "Your website",      sub: "Live & branded instantly" },
  { icon: Users,         title: "Member management", sub: "Add, track & renew" },
  { icon: CreditCard,    title: "Payments",          sub: "Auto reminders + GST filing" },
  { icon: MessageCircle, title: "Lead capture",      sub: "Enquiries to WhatsApp" },
]

export function GymHeroVisual() {
  const router = useRouter()
  const [gymName, setGymName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasTyped, setHasTyped] = useState(false)

  const handleSetup = async () => {
    const name = gymName.trim()
    if (!name) return
    track("gym_name_submitted", { name })
    setIsLoading(true)
    try {
      await fetch("/api/onboarding/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gymName: name, step: "hero" }),
      })
    } catch { /* non-blocking */ }
    router.push(`/onboard?name=${encodeURIComponent(name)}`)
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-6 flex flex-col gap-5">

      {/* Gym name input */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-gray-700">Enter your gym name to get started</label>
        <Input
          type="text"
          placeholder="e.g. Iron Arena Fitness"
          value={gymName}
          onChange={(e) => {
            setGymName(e.target.value)
            if (!hasTyped && e.target.value.length > 0) {
              setHasTyped(true)
              track("gym_name_typing_started")
            }
          }}
          onKeyDown={(e) => { if (e.key === "Enter") handleSetup() }}
          className="h-12 text-base"
          id="gym-name-input"
        />
        <Button
          onClick={handleSetup}
          disabled={!gymName.trim() || isLoading}
          className="h-12 font-bold text-base w-full"
        >
          {isLoading
            ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Setting up…</>
            : <>Setup My Gym <ArrowRight className="ml-2 w-4 h-4" /></>}
        </Button>
        <p className="text-center text-xs text-gray-400">Free to start · No credit card · Live in 60 seconds</p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">we handle everything else</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* 2×2 feature grid */}
      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-gray-900 leading-tight">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee */}
      <div className="flex items-start gap-3 rounded-2xl bg-green-50 border border-green-200 px-4 py-3.5">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <p className="text-sm font-bold text-green-700 leading-snug">
          Not live in 60 seconds? You get 50% off. No questions asked.
        </p>
      </div>

    </div>
  )
}
