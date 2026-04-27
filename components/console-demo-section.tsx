"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, FileText, Receipt, Play, Globe } from "lucide-react"

const demos = [
  {
    id: "website",
    icon: Globe,
    label: "Website & Online Store",
    title: "A free gym website — your photos, reviews & products, live in 60 seconds",
    description: "Paste your Google Maps link. We pull your real photos, reviews, trainers, and location — and build a professional gym website automatically. Sell supplements or gear directly with WhatsApp checkout.",
    gif: "/website-demo.gif",
    video: "/ecommerce.mp4",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    activeBg: "bg-primary",
  },
  {
    id: "members",
    icon: Users,
    label: "Private Gym Dashboard",
    title: "Track every member, expiry, and payment — in one simple place",
    description: "Add a new member in seconds. See who's active, who's expiring this week, and who's late on payments. Renew with one click. No messy registers, no lost data.",
    gif: "/console-members.gif",
    image: "/members.png",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    activeBg: "bg-blue-600",
  },
  {
    id: "workout",
    icon: FileText,
    label: "Workout & Diet Plans",
    title: "Build plans once, assign to any member, email instantly",
    description: "Create a \"Beginner Strength\" workout with sessions, exercises, sets, and reps. Build a diet plan with simple meal guides. Pick a member — plan sent to their inbox automatically.",
    gif: "/console-workout.gif",
    image: "/workouts.png",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    activeBg: "bg-green-600",
  },
  {
    id: "billing",
    icon: Receipt,
    label: "Professional Bills",
    title: "Beautiful bills — print or email in one click",
    description: "Every membership creates a professional bill automatically. View all payments, filter by month, and keep your accounts clean without any math.",
    gif: "/console-billing.gif",
    image: "/earnings.png",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    activeBg: "bg-orange-600",
  },
]

function VideoPlayer({ src }: { src: string }) {
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border shadow-xl bg-black">
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function GifPlaceholder({ src, label }: { src: string; label: string }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div className="w-full aspect-video bg-muted/60 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
          <Play className="w-7 h-7 opacity-40" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-sm">GIF preview coming soon</p>
          <p className="text-xs mt-1 opacity-60">Drop <span className="font-mono">{src}</span> into <span className="font-mono">/public</span></p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border shadow-xl bg-muted/30">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={label}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </div>
  )
}

export function ConsoleDemoSection() {
  const [active, setActive] = useState("members")
  const demo = demos.find((d) => d.id === active)!

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-wide uppercase mb-3 block">See it in action</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Your gym console — here's what it looks like
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A private management dashboard, just for you. Members can't see this — it's your back office.
          </p>
        </motion.div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {demos.map((d) => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                active === d.id
                  ? `${d.activeBg} text-white border-transparent shadow-md`
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <d.icon className="w-4 h-4" />
              {d.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${demo.bg} ${demo.color} border ${demo.border}`}>
                <demo.icon className="w-4 h-4" />
                {demo.label}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold leading-snug">{demo.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{demo.description}</p>

              <ul className="space-y-2 pt-2">
                {active === "website" && [
                  "Professional design using your real gym photos",
                  "Google reviews displayed front and centre",
                  "Membership plans, trainer profiles, and location map",
                  "Sell supplements & gear — simple WhatsApp checkout",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-black">✓</span>
                    {item}
                  </li>
                ))}
                {active === "members" && [
                  "Add members with name and phone number",
                  "Set duration (1, 3, 6, 12 months) and price",
                  "See active, expiring, and late members at a glance",
                  "One-click renewal with automatic receipt",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-[10px] font-black">✓</span>
                    {item}
                  </li>
                ))}
                {active === "workout" && [
                  "Create sessions like: Chest Day, Back Day, Leg Day",
                  "Add simple exercises with sets and reps",
                  "Build diet plans with easy-to-follow meal guides",
                  "Assign to any member — emailed to them instantly",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-[10px] font-black">✓</span>
                    {item}
                  </li>
                ))}
                {active === "billing" && [
                  "Automatic bill numbers for your accounts",
                  "Professional design with your gym logo",
                  "See total earnings by month or year",
                  "Easy to print or send via WhatsApp",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 text-[10px] font-black">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* Right: GIF / Video */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              {"video" in demo && demo.video ? (
                <VideoPlayer src={demo.video as string} />
              ) : "image" in demo && demo.image ? (
                <div className="relative w-full rounded-2xl overflow-hidden border border-border shadow-xl bg-muted/30">
                  <img src={demo.image as string} alt={demo.label} className="w-full h-full object-contain" />
                </div>
              ) : (
                <GifPlaceholder src={demo.gif} label={demo.label} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
