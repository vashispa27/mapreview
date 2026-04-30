"use client"

import { Star, Globe, Phone, Navigation, Bookmark, CheckCircle2, Zap, Users, Calendar, Megaphone, BarChart2, TrendingUp, ArrowRight } from "lucide-react"

// ─── Mini sparkline ───────────────────────────────────────────────────────────

function Sparkline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 28" className="w-full h-7" fill="none" preserveAspectRatio="none">
      <polyline
        points="0,22 14,16 28,20 42,10 56,14 70,6 80,9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

// ─── Google Maps mockup ───────────────────────────────────────────────────────

function GoogleMapsMockup() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
      {/* Search bar */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400 shrink-0" />
          <span className="text-xs text-gray-600 flex-1 font-medium">Iron Forge Gym</span>
          <span className="text-gray-400 text-xs">✕</span>
        </div>
      </div>
      {/* Gym photo */}
      <div className="mx-3 mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 h-28 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="grid grid-cols-4 gap-1 w-full h-full p-2">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="bg-white/30 rounded-sm" />
            ))}
          </div>
        </div>
        <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
          <span className="text-red-500 text-sm">📍</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <span className="text-white text-[10px] font-bold">Iron Forge Gym — Koramangala</span>
        </div>
      </div>
      {/* Listing info */}
      <div className="px-3 pb-3">
        <p className="text-sm font-black text-gray-900">Iron Forge Gym</p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-xs font-bold text-gray-800">4.8</span>
          <div className="flex gap-0.5">
            {[1,2,3,4].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
            <Star className="w-3 h-3 fill-amber-200 text-amber-300" />
          </div>
          <span className="text-[11px] text-gray-400">(212)</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5">Gym in Koramangala, Bangalore</p>
        <p className="text-[11px] text-green-600 font-semibold">Open · Closes 11 PM</p>
        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-1 mt-3">
          {[
            { Icon: Phone, label: "Call" },
            { Icon: Navigation, label: "Directions" },
            { Icon: Bookmark, label: "Save" },
            { Icon: Globe, label: "Website" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Website mockup ───────────────────────────────────────────────────────────

function WebsiteMockup() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
      {/* Dark gym website header */}
      <div className="bg-gray-950">
        {/* Nav */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center text-[9px] font-black text-white">⚡</div>
            <span className="text-[10px] font-black text-white uppercase tracking-wider">Iron Forge Gym</span>
          </div>
          <div className="flex gap-0.5">
            {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-3.5 bg-white/30 rounded-full" />)}
          </div>
        </div>
        {/* Hero area */}
        <div className="px-3 pt-4 pb-5 relative min-h-[100px]">
          {/* Fake gym photo background */}
          <div className="absolute inset-0 opacity-25 bg-gradient-to-br from-gray-600 via-gray-800 to-black" />
          <div className="relative z-10 flex gap-3 items-center">
            <div>
              <p className="text-lg font-black text-white leading-tight">Stronger</p>
              <p className="text-lg font-black text-amber-400 leading-tight">Every Day</p>
              <p className="text-[10px] text-white/60 mt-1 leading-snug">Premium Equipment.<br />Expert Trainers. Real Results.</p>
              <button className="mt-2.5 bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg">
                Join Now
              </button>
            </div>
            {/* Silhouette placeholder */}
            <div className="ml-auto w-14 h-20 bg-gradient-to-b from-gray-500/30 to-transparent rounded-lg flex items-end justify-center opacity-60">
              <div className="w-8 h-16 bg-gray-400/40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      {/* Nav tabs */}
      <div className="grid grid-cols-5 border-t border-gray-100 bg-white">
        {["About Us", "Programs", "Trainers", "Gallery", "Contact"].map((tab) => (
          <div key={tab} className="flex flex-col items-center gap-1 py-2 px-1">
            <div className="w-4 h-4 bg-gray-200 rounded-sm" />
            <span className="text-[8px] text-gray-500 text-center leading-tight">{tab}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── WhatsApp mockup ──────────────────────────────────────────────────────────

function WhatsAppMockup() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
      {/* WhatsApp header */}
      <div className="bg-[#075e54] px-3 py-2.5 flex items-center gap-2">
        <div className="w-5 h-5 text-white text-xs flex items-center">←</div>
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-white">⚡</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white leading-none">Iron Forge Gym</p>
          <p className="text-[9px] text-green-300 flex items-center gap-0.5 mt-0.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Online
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <span className="text-sm">⋮</span>
        </div>
      </div>
      {/* Chat area */}
      <div className="bg-[#e5ddd5] px-3 py-3 space-y-2.5 min-h-[120px]">
        <div className="text-[9px] text-gray-500 text-center bg-white/60 rounded-full px-2 py-0.5 w-fit mx-auto">
          Customer Gen
        </div>
        {/* User bubble */}
        <div className="flex items-end gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gray-400 shrink-0 flex items-center justify-center text-[8px] text-white font-bold">C</div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm max-w-[75%]">
            <p className="text-[11px] text-gray-800">Hi, I&apos;d like a free trial.</p>
            <p className="text-[9px] text-gray-400 text-right mt-0.5">10:30 AM</p>
          </div>
        </div>
        {/* Gym reply bubble */}
        <div className="flex justify-end">
          <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-sm px-3 py-2 shadow-sm max-w-[80%]">
            <p className="text-[11px] text-gray-800 font-semibold">Iron Forge Gym</p>
            <p className="text-[11px] text-gray-700">Welcome! 🙌<br />Our team will contact you shortly.</p>
            <p className="text-[9px] text-gray-400 text-right mt-0.5">10:30 AM ✓✓</p>
          </div>
        </div>
      </div>
      {/* WhatsApp FAB hint */}
      <div className="bg-[#e5ddd5] px-3 pb-2 flex justify-end">
        <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center shadow-md">
          <span className="text-white text-sm">💬</span>
        </div>
      </div>
    </div>
  )
}

// ─── Bottom panels ────────────────────────────────────────────────────────────

function AllInOnePanel() {
  const features = [
    { emoji: "🌐", label: "Professional\nWebsite" },
    { emoji: "👥", label: "Manage Members\n& Enquiries" },
    { emoji: "📅", label: "Bookings &\nAppointments" },
    { emoji: "📣", label: "Run Offers &\nCampaigns" },
    { emoji: "📊", label: "Track Growth\n& Insights" },
  ]
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm h-full">
      <p className="text-[11px] text-gray-400 text-center mb-4 flex items-center gap-2 justify-center">
        <span className="flex-1 h-px bg-gray-200" />
        All in One Place
        <span className="flex-1 h-px bg-gray-200" />
      </p>
      <div className="grid grid-cols-5 gap-2">
        {features.map(({ emoji, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
              {emoji}
            </div>
            <p className="text-[10px] text-gray-600 leading-tight whitespace-pre-line">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResultsPanel() {
  const stats = [
    { label: "Visitors", value: "1,284", color: "#6b7280", textColor: "text-gray-900", sparkColor: "#22c55e" },
    { label: "Enquiries", value: "182", color: "#3b82f6", textColor: "text-blue-600", sparkColor: "#3b82f6" },
    { label: "Walk-ins", value: "63", badge: "+14%", color: "#22c55e", textColor: "text-gray-900", sparkColor: "#22c55e" },
  ]
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <p className="text-sm font-black text-gray-900">Results That Grow Your Business</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, badge, textColor, sparkColor }) => (
          <div key={label}>
            <p className="text-[11px] text-gray-400 font-medium">{label}</p>
            <div className="flex items-baseline gap-1.5">
              <p className={`text-2xl font-black ${textColor}`}>{value}</p>
              {badge && <span className="text-[10px] font-black text-green-600">{badge}</span>}
            </div>
            <Sparkline color={sparkColor} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function GymHeroVisual() {
  const steps = [
    {
      n: "1",
      color: "bg-blue-600",
      label: "Your Google Maps",
      badge: { text: "We take your Google Maps URL", bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600" },
      mockup: <GoogleMapsMockup />,
    },
    {
      n: "2",
      color: "bg-green-600",
      label: "We Create Everything Automatically",
      badge: { text: "We turn it into a website, management system & more", bg: "bg-green-50", border: "border-green-200", icon: "text-green-600" },
      mockup: <WebsiteMockup />,
    },
    {
      n: "3",
      color: "bg-purple-600",
      label: "You Get More Customers",
      badge: { text: "Enquiries come to you on WhatsApp. You convert!", bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600" },
      mockup: <WhatsAppMockup />,
    },
  ]

  return (
    <div className="w-full">
      {/* Title */}
      <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 text-center mb-6 leading-tight">
        From Google Maps to More Customers{" "}
        <span className="text-green-600">in 60 Seconds!</span>
      </h3>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3 mb-4">
        {steps.map(({ n, color, label, badge, mockup }, i) => (
          <div key={n} className="relative flex flex-col gap-3">
            {/* Arrow between columns (desktop only) */}
            {i > 0 && (
              <div className="hidden md:flex absolute -left-4 top-1/3 -translate-y-1/2 z-10 items-center">
                <ArrowRight className={`w-6 h-6 ${i === 1 ? "text-blue-400" : "text-green-400"}`} />
              </div>
            )}
            {/* Arrow between rows (mobile only) */}
            {i > 0 && (
              <div className="md:hidden flex justify-center -mt-1 mb-1">
                <div className="flex flex-col items-center gap-0.5">
                  <div className={`w-0.5 h-5 ${i === 1 ? "bg-blue-300" : "bg-green-300"}`} />
                  <ArrowRight className={`w-4 h-4 rotate-90 ${i === 1 ? "text-blue-400" : "text-green-400"}`} />
                </div>
              </div>
            )}

            {/* Step label */}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white text-sm font-black shrink-0`}>
                {n}
              </div>
              <p className="text-sm font-black text-gray-900 leading-snug">{label}</p>
            </div>

            {/* Mockup */}
            {mockup}

            {/* Badge */}
            <div className={`flex items-start gap-2 ${badge.bg} border ${badge.border} rounded-xl px-3 py-2.5`}>
              <CheckCircle2 className={`w-4 h-4 ${badge.icon} shrink-0 mt-0.5`} />
              <p className="text-xs font-semibold text-gray-700 leading-snug">{badge.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AllInOnePanel />
        <ResultsPanel />
      </div>
    </div>
  )
}
