"use client"

import { useEffect, useRef, useState } from "react"
import { motion, type Variants, useInView } from "framer-motion"
import {
  Star, Globe, Navigation, Bookmark, Phone,
  MessageCircle, Users, Calendar, Bell, Megaphone,
  TrendingUp, CheckCircle2, Zap, ArrowRight,
} from "lucide-react"

// ─── Count-up number ──────────────────────────────────────────────────────────

function CountUp({ to, duration = 1400, delay = 0 }: { to: number; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inViewRef = useRef<HTMLDivElement>(null)
  const inView = useInView(inViewRef, { once: true })

  useEffect(() => {
    if (!inView) return
    const timeout = setTimeout(() => {
      const start = Date.now()
      const step = () => {
        const elapsed = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        if (ref.current) ref.current.textContent = Math.round(to * ease).toLocaleString()
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, delay)
    return () => clearTimeout(timeout)
  }, [inView, to, duration, delay])

  return <div ref={inViewRef} className="inline"><span ref={ref}>0</span></div>
}

// ─── Mini sparkline ───────────────────────────────────────────────────────────

function Sparkline({ color, delay = 0 }: { color: string; delay?: number }) {
  const path = "M0,20 C10,18 15,10 25,12 C35,14 40,6 50,8 C60,10 65,4 75,6 C85,8 90,2 100,4"
  return (
    <svg viewBox="0 0 100 24" className="w-full h-6" fill="none">
      <motion.path
        d={path}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
      />
    </svg>
  )
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
}

const arrowVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0 },
  show: (delay: number) => ({
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.35, delay, ease: "easeOut" },
  }),
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GymHeroVisual() {
  const [tick, setTick] = useState(0)

  // Pulse the WhatsApp notification badge periodically
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="w-full flex flex-col-reverse lg:flex-row gap-6 items-start">
      {/* ── Left column: stacked mockups ── */}
      <div className="w-full lg:w-[55%] shrink-0 flex flex-col gap-0">

        {/* Card 1 — Google Maps listing */}
        <motion.div
          variants={cardVariants}
          custom={0.2}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
        >
          {/* Browser bar */}
          <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded border border-gray-200 px-2 py-0.5 text-[9px] text-gray-400 font-mono truncate">
              https://maps.google.com/.../iron-forge-gym
            </div>
          </div>
          {/* Content */}
          <div className="p-3 flex gap-3">
            {/* Gym photo */}
            <div className="w-20 h-16 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shrink-0 overflow-hidden flex items-end p-1.5">
              <div className="grid grid-cols-3 gap-0.5 w-full opacity-60">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-1.5 bg-gray-400 rounded-xs" />
                ))}
              </div>
            </div>
            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black text-gray-900 leading-tight">Iron Forge Gym</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="text-[9px] font-bold text-gray-700">4.8</span>
                {[1,2,3,4].map(i => <Star key={i} className="w-2 h-2 fill-amber-400 text-amber-400" />)}
                <Star className="w-2 h-2 fill-amber-200 text-amber-400" />
                <span className="text-[8px] text-gray-400">(212 reviews)</span>
              </div>
              <p className="text-[8px] text-gray-500 mt-0.5">Gym in Koramangala, Bangalore</p>
              <p className="text-[8px] text-green-600 font-semibold">Open · Closes 11 PM</p>
              <div className="flex gap-2.5 mt-1.5">
                {[{ Icon: Globe, label: "Website" }, { Icon: Navigation, label: "Directions" }, { Icon: Bookmark, label: "Save" }, { Icon: Phone, label: "Call" }].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-0.5">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                      <Icon className="w-2.5 h-2.5 text-blue-600" />
                    </div>
                    <span className="text-[7px] text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Arrow 1 */}
        <motion.div variants={arrowVariants} custom={0.65} initial="hidden" animate="show" className="flex justify-center origin-top py-1">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-5 bg-gradient-to-b from-gray-300 to-blue-400" />
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-400" />
          </div>
        </motion.div>

        {/* Card 2 — MapToSite website */}
        <motion.div
          variants={cardVariants}
          custom={0.7}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
        >
          {/* Browser bar */}
          <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded border border-gray-200 px-2 py-0.5 text-[9px] text-gray-400 font-mono truncate">
              https://ironforge.maptosite.in
            </div>
            <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">
              <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
              <span className="text-[8px] font-bold text-green-700">Live</span>
            </div>
          </div>
          {/* Dark gym hero */}
          <div className="bg-gray-900 px-3 py-3 relative overflow-hidden">
            {/* Fake image overlay */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-gray-600 to-gray-900" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 bg-amber-500 rounded flex items-center justify-center text-[7px] font-black text-white">⚡</div>
                <span className="text-[9px] font-black text-white uppercase tracking-wider">Iron Forge Gym</span>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(3)].map((_,i) => <div key={i} className="w-0.5 h-3 bg-white/40 rounded-full" />)}
                </div>
              </div>
              <p className="text-sm font-black text-white leading-tight">Stronger</p>
              <p className="text-sm font-black text-amber-400 leading-tight">Every Day</p>
              <p className="text-[8px] text-white/60 mt-1">Premium Equipment. Expert Trainers. Real Results.</p>
              <button className="mt-2 bg-amber-500 text-white text-[8px] font-black px-2.5 py-1 rounded-md">
                Become a Member
              </button>
            </div>
          </div>
          {/* Status badges */}
          <div className="px-3 py-2 flex gap-1.5 flex-wrap">
            {["Website Created", "SEO Optimized", "Mobile Friendly", "Fast Loading"].map(label => (
              <div key={label} className="flex items-center gap-1 text-[7px] font-bold text-green-700">
                <CheckCircle2 className="w-2.5 h-2.5 text-green-500 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Arrow 2 */}
        <motion.div variants={arrowVariants} custom={1.15} initial="hidden" animate="show" className="flex justify-center origin-top py-1">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-5 bg-gradient-to-b from-gray-300 to-green-400" />
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-green-400" />
          </div>
        </motion.div>

        {/* Card 3 — Dashboard */}
        <motion.div
          variants={cardVariants}
          custom={1.2}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
        >
          <div className="flex gap-2 p-2.5">
            {/* WhatsApp enquiry panel */}
            <div className="w-[42%] shrink-0 border border-gray-100 rounded-xl overflow-hidden">
              <div className="bg-green-500 px-2 py-1.5 flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3 text-white" />
                <span className="text-[8px] font-bold text-white">New Enquiry</span>
                <motion.span
                  key={tick}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="ml-auto w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center text-[7px] font-black text-green-600"
                >
                  1
                </motion.span>
              </div>
              <div className="p-2 bg-gray-50">
                <div className="flex items-start gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0 flex items-center justify-center text-[7px] font-black text-white">R</div>
                  <div className="min-w-0">
                    <div className="flex justify-between">
                      <p className="text-[8px] font-bold text-gray-900">Ravi S.</p>
                      <p className="text-[7px] text-gray-400">10:30 AM</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg rounded-tl-sm px-1.5 py-1 mt-0.5">
                      <p className="text-[8px] text-gray-700">&ldquo;Hi, I&apos;d like a free trial.&rdquo;</p>
                    </div>
                    <p className="text-[7px] text-gray-400 mt-0.5">via Website (ironforge.maptosite.in)</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-700 text-[7px] font-black px-1.5 py-0.5 rounded-full w-fit">
                  New Lead
                </div>
              </div>
            </div>

            {/* Dashboard panel */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[8px] font-bold text-gray-700">Dashboard Overview</p>
                <div className="flex items-center gap-0.5 bg-gray-100 rounded px-1 py-0.5">
                  <span className="text-[7px] text-gray-500">This Week</span>
                  <TrendingUp className="w-2 h-2 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                {[
                  { label: "Visitors", value: 1284, color: "text-gray-800", sparkColor: "#6b7280", delay: 1.4 },
                  { label: "Enquiries", value: 182, color: "text-blue-600", sparkColor: "#3b82f6", delay: 1.5 },
                  { label: "Walk-ins", value: 63, color: "text-green-600", sparkColor: "#22c55e", delay: 1.6, badge: "+14%" },
                ].map(({ label, value, color, sparkColor, delay, badge }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-1.5">
                    <p className="text-[7px] text-gray-400 font-medium">{label}</p>
                    <p className={`text-[11px] font-black ${color}`}>
                      <CountUp to={value} delay={delay * 1000} />
                    </p>
                    {badge && (
                      <span className="text-[6px] font-black text-green-600 bg-green-50 px-1 rounded-full">{badge}</span>
                    )}
                    <Sparkline color={sparkColor} delay={delay} />
                  </div>
                ))}
              </div>
              {/* Feature icons */}
              <div className="grid grid-cols-5 gap-1">
                {[
                  { Icon: MessageCircle, label: "Enquiries", color: "text-purple-500", bg: "bg-purple-50" },
                  { Icon: Users, label: "Members", color: "text-blue-500", bg: "bg-blue-50" },
                  { Icon: Calendar, label: "Bookings", color: "text-orange-500", bg: "bg-orange-50" },
                  { Icon: Bell, label: "Alerts", color: "text-green-500", bg: "bg-green-50" },
                  { Icon: Megaphone, label: "Campaigns", color: "text-red-500", bg: "bg-red-50" },
                ].map(({ Icon, label, color, bg }) => (
                  <div key={label} className="flex flex-col items-center gap-0.5">
                    <div className={`w-5 h-5 rounded-md ${bg} flex items-center justify-center`}>
                      <Icon className={`w-2.5 h-2.5 ${color}`} />
                    </div>
                    <p className="text-[6px] text-gray-500 text-center leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom flow bar */}
        <motion.div
          variants={cardVariants}
          custom={1.7}
          initial="hidden"
          animate="show"
          className="mt-2 bg-white rounded-2xl border border-gray-200 shadow p-3"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">🚀</span>
            <div>
              <p className="text-[9px] font-black text-gray-900">From Google Maps to Growth Engine</p>
              <p className="text-[8px] font-bold text-green-600">More Visibility. More Enquiries. More Members.</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1 flex-wrap sm:flex-nowrap">
            {[
              { label: "Google Maps URL", emoji: "🗺️" },
              { label: "Website", emoji: "🌐" },
              { label: "Management", emoji: "👥" },
              { label: "Leads & Growth", emoji: "📈" },
            ].map(({ label, emoji }, i) => (
              <div key={label} className="flex items-center gap-1">
                <div className="flex flex-col items-center">
                  <span className="text-base leading-none">{emoji}</span>
                  <p className="text-[9px] text-gray-500 mt-0.5 text-center leading-tight">{label}</p>
                </div>
                {i < 3 && <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right column: numbered steps ── */}
      <div className="w-full lg:flex-1 flex flex-col gap-0">
        {[
          {
            n: "1",
            title: "Your Google Maps Listing",
            desc: "We take your existing Google Maps URL as input.",
            note: "No logins. No hassle.",
            color: "bg-blue-600",
            delay: 0.35,
            arrowDelay: 0.75,
          },
          {
            n: "2",
            title: "We Build Everything Automatically",
            desc: "We instantly convert your Google Maps data into:",
            bullets: ["A fast, SEO-friendly website", "A management system", "A lead capture system"],
            badge: "Live in under 60 seconds!",
            color: "bg-green-600",
            delay: 0.85,
            arrowDelay: 1.25,
          },
          {
            n: "3",
            title: "Capture Leads & Grow Your Business",
            desc: "All enquiries come to your dashboard and WhatsApp. Manage members, follow-ups, campaigns & more.",
            note: "Everything in one place.",
            color: "bg-green-600",
            delay: 1.35,
          },
        ].map(({ n, title, desc, note, bullets, badge, color, delay, arrowDelay }) => (
          <div key={n} className="flex flex-col">
            <motion.div
              variants={cardVariants}
              custom={delay}
              initial="hidden"
              animate="show"
              className="flex gap-4"
            >
              <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-base font-black shrink-0 mt-0.5 shadow-md`}>
                {n}
              </div>
              <div className="min-w-0">
                <p className="text-base font-black text-gray-900 leading-snug mb-1.5">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                {bullets && (
                  <div className="mt-2.5 space-y-1.5">
                    {bullets.map(b => (
                      <div key={b} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 font-medium">{b}</p>
                      </div>
                    ))}
                  </div>
                )}
                {badge && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
                    <Zap className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-bold text-green-700">{badge}</span>
                  </div>
                )}
                {note && <p className="text-sm text-gray-400 mt-2 font-medium italic">{note}</p>}
              </div>
            </motion.div>

            {arrowDelay && (
              <motion.div
                variants={arrowVariants}
                custom={arrowDelay}
                initial="hidden"
                animate="show"
                className="flex ml-[18px] origin-top py-2"
              >
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-gray-200 to-green-300" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-green-300" />
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
