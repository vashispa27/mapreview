"use client"

import { Globe, Users, CreditCard, MessageCircle, ShieldCheck, ArrowDown } from "lucide-react"
import { GymSearchBlock } from "@/components/gym-search-block"

const FEATURES = [
  { icon: Globe,         title: "Your website",      sub: "Live & branded instantly" },
  { icon: Users,         title: "Member management", sub: "Add, track & renew" },
  { icon: CreditCard,    title: "Payments",          sub: "Auto reminders + GST filing" },
  { icon: MessageCircle, title: "Lead capture",      sub: "Enquiries to WhatsApp" },
]

export function GymHeroVisual() {
  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-6 flex flex-col gap-5">

      {/* Search + Paste — full functionality from GymSearchBlock */}
      <GymSearchBlock />

      {/* Arrow + label */}
      <div className="flex flex-col items-center gap-1.5">
        <ArrowDown className="w-5 h-5 text-green-500" strokeWidth={2.5} />
        <span className="text-sm font-semibold text-gray-500">we create everything automatically</span>
      </div>

      {/* 2×2 feature grid */}
      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map(({ icon: Icon, title, sub }) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3.5"
          >
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

      {/* 50% off guarantee */}
      <div className="flex items-start gap-3 rounded-2xl bg-green-50 border border-green-200 px-4 py-3.5">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <p className="text-sm font-bold text-green-700 leading-snug">
          Not live in 60 seconds? You get 50% off. No questions asked.
        </p>
      </div>

    </div>
  )
}
