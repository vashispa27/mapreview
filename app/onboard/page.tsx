"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Search, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { track } from "@/lib/analytics"

interface SearchResult {
  id: string; name: string; address: string; url: string
}

function OnboardStep1() {
  const router = useRouter()
  const params = useSearchParams()
  const { data: session } = useSession()
  const initialName = params.get("name") || ""

  const [gymName, setGymName] = useState(initialName)
  const [mapsQuery, setMapsQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [apiError, setApiError] = useState("")

  const mapsRef = useRef<HTMLDivElement>(null)
  const clientCache = useRef(new Map<string, SearchResult[]>())

  useEffect(() => {
    track("onboard_gym_entry_viewed", { prefilled: !!initialName })
  }, [initialName])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mapsRef.current && !mapsRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Maps search on field 2
  useEffect(() => {
    if (mapsQuery.length < 3) { setResults([]); setShowDropdown(false); return }
    const key = mapsQuery.toLowerCase()
    if (clientCache.current.has(key)) {
      setResults(clientCache.current.get(key)!)
      setShowDropdown(true)
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/maps/search?q=${encodeURIComponent(mapsQuery)}`)
        const data = await res.json()
        if (res.ok && data.results) {
          clientCache.current.set(key, data.results)
          setResults(data.results)
          setShowDropdown(data.results.length > 0)
        }
      } catch { /* silently fail */ } finally { setIsSearching(false) }
    }, 350)
    return () => clearTimeout(timer)
  }, [mapsQuery])

  const go = (path: string) => { setIsNavigating(true); router.push(path) }

  const handleSelectPlace = async (place: SearchResult) => {
    setSelectedPlace(place)
    setGymName(place.name)
    setMapsQuery(place.name)
    setShowDropdown(false)
    setApiError("")
    track("onboard_maps_place_selected", { placeName: place.name })
    try {
      await fetch("/api/onboarding/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gymName: place.name, mapsUrl: place.url, step: "maps_selected" }),
      })
    } catch { /* non-blocking */ }
    // Always stay on page so user can confirm with Continue button

  }

  const handleContinue = async () => {
    const name = gymName.trim()
    if (!name) return
    setApiError("")
    const step = selectedPlace ? "maps_selected" : "maps_skipped"
    track("onboard_continued", { gymName: name, usedMaps: step === "maps_selected" })
    try {
      await fetch("/api/onboarding/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gymName: name, mapsUrl: selectedPlace?.url || null, step }),
      })
    } catch { /* non-blocking */ }

    if (session) {
      setIsNavigating(true)
      try {
        if (selectedPlace?.url) {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: selectedPlace.url }),
          })
          const data = await res.json()
          if (data.error) { setApiError(data.error); setIsNavigating(false); return }
          if (data.jobId) {
            localStorage.setItem("challenge_start_time", Date.now().toString())
            localStorage.setItem("challenge_site_id", data.jobId)
          }
        } else {
          const res = await fetch("/api/sites/create-template", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gymName: name }),
          })
          const data = await res.json()
          if (data.error) { setApiError(data.error); setIsNavigating(false); return }
        }
        router.push("/my-sites")
      } catch {
        setApiError("Something went wrong. Please try again.")
        setIsNavigating(false)
      }
      return
    }

    const url = selectedPlace
      ? `/onboard/preview?name=${encodeURIComponent(name)}&url=${encodeURIComponent(selectedPlace.url)}`
      : `/onboard/preview?name=${encodeURIComponent(name)}`
    go(url)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <div className="border-b border-border px-5 h-14 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">MapToSite <span className="text-primary">Fitness</span></span>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          {/* Progress */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">1</div>
            <div className="h-1.5 flex-1 rounded-full bg-muted relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-primary" />
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-muted flex items-center justify-center text-muted-foreground text-xs font-bold shrink-0">2</div>
            <span className="text-xs text-muted-foreground font-medium">Step 1 of 2</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Confirm your gym</h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Edit your gym name, then optionally find it on Google Maps to <span className="font-semibold text-foreground">auto-fill photos, reviews &amp; hours.</span>
          </p>

          <div className="space-y-5">

            {/* Field 1: Gym name */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                Your gym name
              </label>
              <Input
                type="text"
                value={gymName}
                onChange={(e) => { setGymName(e.target.value); setSelectedPlace(null) }}
                onKeyDown={(e) => { if (e.key === "Enter" && gymName.trim()) handleContinue() }}
                placeholder="e.g. Iron Arena Fitness"
                className="h-13 text-base font-semibold shadow-sm"
                autoFocus
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-primary/20" />
              <span className="text-xs font-black text-primary uppercase tracking-widest">Recommended</span>
              <div className="flex-1 h-px bg-primary/20" />
            </div>

            {/* Field 2: Maps search */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Search on Google Maps</span>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Pulls real photos &amp; reviews</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Search your gym to auto-fill real photos, reviews, ratings &amp; hours — nothing to enter manually.
              </p>

              {/* Show success state if place selected */}
              <AnimatePresence mode="wait">
                {selectedPlace ? (
                  <motion.div key="selected"
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-green-900 truncate">{selectedPlace.name}</p>
                      {selectedPlace.address && <p className="text-xs text-green-700 truncate">{selectedPlace.address}</p>}
                    </div>
                    <button onClick={() => { setSelectedPlace(null); setMapsQuery("") }}
                      className="text-xs text-green-700 font-semibold hover:underline shrink-0">
                      Change
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="search" exit={{ opacity: 0 }} className="relative" ref={mapsRef}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                    {isSearching && (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground z-10" />
                    )}
                    <Input
                      type="text"
                      value={mapsQuery}
                      onChange={(e) => setMapsQuery(e.target.value)}
                      onFocus={() => { if (results.length > 0) setShowDropdown(true) }}
                      onKeyDown={(e) => { if (e.key === "Escape") setShowDropdown(false) }}
                      placeholder="Search gym name or area…"
                      className="pl-10 pr-10 h-11 text-sm shadow-sm"
                    />

                    {/* Dropdown */}
                    <AnimatePresence>
                      {showDropdown && results.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
                          className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="px-4 py-2 border-b border-border bg-muted/30">
                            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                              <MapPin className="w-3 h-3" /> Google Maps — tap to auto-fill
                            </p>
                          </div>
                          <div className="max-h-56 overflow-y-auto">
                            {results.map((result, i) => (
                              <button key={result.id}
                                className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-primary/5 transition-colors group ${i > 0 ? "border-t border-border/50" : ""}`}
                                onMouseDown={(e) => { e.preventDefault(); handleSelectPlace(result) }}
                              >
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                                  <MapPin className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm truncate">{result.name}</p>
                                  {result.address && <p className="text-xs text-muted-foreground truncate mt-0.5">{result.address}</p>}
                                </div>
                                <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1">
                                  Select <ArrowRight className="w-3 h-3" />
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Continue button */}
            {apiError && <p className="text-destructive text-sm">{apiError}</p>}
            <Button
              onClick={handleContinue}
              disabled={!gymName.trim() || isNavigating}
              className="w-full h-12 font-bold text-sm mt-2"
            >
              {isNavigating
                ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />{selectedPlace?.url && session ? "Creating Website…" : "Loading…"}</>
                : session ? <>Set Up My Gym <ArrowRight className="ml-2 w-4 h-4" /></> : <>Continue <ArrowRight className="ml-2 w-4 h-4" /></>}
            </Button>

          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function OnboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
      <OnboardStep1 />
    </Suspense>
  )
}
