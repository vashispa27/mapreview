"use client"

import { Globe, Tag, CalendarCheck, MessageCircle, ShieldCheck, ArrowDown } from "lucide-react"
import { GymSearchBlock } from "@/components/gym-search-block"

const FEATURES = [
  { icon: Globe,         title: "Your website",     sub: "Live from Google Maps in 60s" },
  { icon: Tag,           title: "Offers & promos",  sub: "Send deals to your customers" },
  { icon: CalendarCheck, title: "Table bookings",   sub: "Accept reservations instantly" },
  { icon: MessageCircle, title: "Lead capture",     sub: "Every enquiry tracked" },
]

export function RestaurantHeroVisual() {
  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-6 flex flex-col gap-5">

      <GymSearchBlock
        placeholder="Search your restaurant name..."
        entityLabel="restaurant"
      />

      <div className="flex flex-col items-center gap-1.5">
        <ArrowDown className="w-5 h-5 text-red-500" strokeWidth={2.5} />
        <span className="text-sm font-semibold text-gray-500">we create everything automatically</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-gray-900 leading-tight">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3.5">
        <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-sm font-bold text-red-700 leading-snug">
          Not live in 60 seconds? You get 50% off. No questions asked.
        </p>
      </div>

    </div>
  )
}
