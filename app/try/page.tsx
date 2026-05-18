"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2, Lock, Star, MapPin, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"

// ─── Fake site visual ─────────────────────────────────────────────────────────

function FakeSitePreview({ gymName }: { gymName: string }) {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="h-16 border-b border-gray-200 flex items-center px-6 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
            <span className="text-white text-xs font-black">G</span>
          </div>
          <span className="font-black text-gray-900 text-lg">{gymName}</span>
        </div>
        <div className="ml-auto hidden md:flex gap-6 text-sm text-gray-500 font-medium">
          <span>Home</span><span>Plans</span><span>Gallery</span><span>Contact</span>
        </div>
        <div className="ml-6 bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg">Join Now</div>
      </nav>

      {/* Hero */}
      <div className="h-[380px] bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 flex items-center px-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/example-tigerfitness.jpg')", backgroundSize: "cover" }} />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            ⭐ 4.8 · 230+ Google Reviews
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">{gymName}</h1>
          <p className="text-green-100 text-lg mb-6">Your #1 Fitness Destination in the city</p>
          <div className="flex gap-3">
            <div className="bg-white text-green-700 px-6 py-2.5 rounded-xl font-black text-sm cursor-pointer">💬 WhatsApp Us</div>
            <div className="border-2 border-white/50 text-white px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer">View Plans</div>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="grid grid-cols-3 gap-px bg-gray-200 border-b border-gray-200">
        {[
          { icon: MapPin, label: "Andheri West, Mumbai" },
          { icon: Clock, label: "6 AM – 10 PM Daily" },
          { icon: Phone, label: "+91 98765 43210" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="bg-white flex items-center justify-center gap-2 py-3 text-sm text-gray-600 font-medium">
            <Icon className="w-4 h-4 text-green-600" />{label}
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="px-8 py-10 bg-gray-50">
        <div className="h-6 w-48 bg-gray-300 rounded-lg mx-auto mb-8" />
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {["Member Portal", "Online Payments", "Class Schedule", "Personal Training", "Diet Plans", "WhatsApp Support"].map(f => (
            <div key={f} className="border border-gray-100 rounded-2xl p-5 bg-white">
              <div className="w-10 h-10 bg-green-100 rounded-xl mb-3" />
              <div className="h-3 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-200 rounded w-full mb-1.5" />
              <div className="h-2 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="px-8 py-10">
        <div className="h-5 w-40 bg-gray-200 rounded mx-auto mb-6" />
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <div className="h-2 bg-gray-200 rounded w-full mb-1.5" />
              <div className="h-2 bg-gray-200 rounded w-4/5 mb-1.5" />
              <div className="h-2 bg-gray-200 rounded w-3/5 mb-4" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-200 rounded-full" />
                <div className="h-2.5 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function TryPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const gymUrl = searchParams.get("url") || ""
  const gymName = decodeURIComponent(searchParams.get("name") || "Your Gym")

  const [stage, setStage] = useState<"processing" | "preview">("processing")
  const [loginOpen, setLoginOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const hasGenerated = useRef(false)

  // Processing → preview after 1.2s
  useEffect(() => {
    const timer = setTimeout(() => setStage("preview"), 1200)
    return () => clearTimeout(timer)
  }, [])

  // After login: if URL present → generate → /my-sites; else → /gyms
  useEffect(() => {
    if (status !== "authenticated" || !session) return
    if (hasGenerated.current) return
    hasGenerated.current = true

    if (!gymUrl) {
      router.push("/gyms")
      return
    }

    setIsGenerating(true)
    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: gymUrl }),
    })
      .then(() => router.push("/gym/sites"))
      .catch(() => router.push("/gym/sites"))
  }, [session, status, gymUrl, router])

  // Generating state after login
  if (isGenerating || (session && gymUrl && hasGenerated.current)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
            <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl">🏋️</span>
          </div>
          <p className="text-xl font-black text-gray-900">Building {gymName}...</p>
          <p className="text-sm text-muted-foreground mt-2">Pulling photos, reviews &amp; hours from Google Maps</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />

      <AnimatePresence mode="wait">
        {stage === "processing" ? (
          <motion.div
            key="processing"
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center bg-white"
          >
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl">🏋️</span>
              </div>
              <p className="text-xl font-black text-gray-900">Generating your website...</p>
              <p className="text-sm text-muted-foreground mt-2">Pulling photos, reviews &amp; hours from Google Maps</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>This usually takes less than a second</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">

            {/* Blurred site behind */}
            <div
              className="pointer-events-none select-none overflow-hidden"
              style={{ filter: "blur(6px)", maxHeight: "100vh", userSelect: "none" }}
              aria-hidden
            >
              <FakeSitePreview gymName={gymName} />
            </div>

            {/* Overlay */}
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 max-w-sm w-full text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-1">Your website is ready!</h2>
                <p className="text-gray-400 text-sm mb-1">We built a site for</p>
                <p className="font-black text-xl text-green-600 mb-6">{gymName}</p>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5 flex items-start gap-2.5 text-left">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-semibold leading-snug">
                    Sign in to get your <span className="underline">website</span> + <span className="underline">management console</span> — members, payments &amp; leads — free to start
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full h-12 font-black text-base bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setLoginOpen(true)}
                >
                  🔓 Claim My Website — Free
                </Button>

                <p className="text-xs text-gray-400 mt-3">No credit card required</p>
              </motion.div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function TryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <TryPageInner />
    </Suspense>
  )
}
