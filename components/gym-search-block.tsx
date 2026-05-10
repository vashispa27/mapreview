"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, MapPin, Loader2, HelpCircle, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { LoginModal } from "@/components/login-modal"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface SearchResult {
  id: string
  name: string
  address: string
  url: string
}

interface GymSearchBlockProps {
  accent?: "blue" | "green"
  placeholder?: string
  entityLabel?: string
}

export function GymSearchBlock({
  accent = "blue",
  placeholder = "Search your gym name...",
  entityLabel = "gym",
}: GymSearchBlockProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [pendingResult, setPendingResult] = useState<SearchResult | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const clientCache = useRef(new Map<string, SearchResult[]>())

  useEffect(() => {
    const handleFocus = () => {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    window.addEventListener("focus-gym-input", handleFocus)
    return () => window.removeEventListener("focus-gym-input", handleFocus)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.length < 3) { setSearchResults([]); setShowDropdown(false); return }
    const key = searchQuery.toLowerCase()
    if (clientCache.current.has(key)) {
      setSearchResults(clientCache.current.get(key)!)
      setShowDropdown(true)
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/maps/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        if (res.ok && data.results) {
          clientCache.current.set(key, data.results)
          setSearchResults(data.results)
          setShowDropdown(data.results.length > 0)
        }
      } catch { /* silently fail */ } finally { setIsSearching(false) }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const validateUrl = (u: string) => {
    if (u.trim().toLowerCase() === "admin") return null
    const valid = u.includes("maps.app.goo.gl") || u.includes("goo.gl/maps") || u.includes("google.com/maps") || u.includes("maps.google.com")
    return valid ? null : "invalid"
  }

  const handleGenerate = async (overrideUrl?: string) => {
    const finalUrl = (overrideUrl || url).trim()
    if (finalUrl.toLowerCase() === "admin") {
      setIsLoading(true)
      await new Promise(r => setTimeout(r, 500))
      router.push("/preview/admin-demo")
      return
    }
    if (!session) { setIsLoginModalOpen(true); return }
    if (!finalUrl) { setError(`Please enter a Google Maps URL`); return }
    if (validateUrl(finalUrl) === "invalid") { setIsTutorialOpen(true); return }
    setError(""); setIsLoading(true)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to generate site"); return }
      localStorage.setItem("challenge_site_id", data.jobId)
      window.dispatchEvent(new Event("challenge-start"))
      toast({ title: "Site Generation Started!", description: "Your page is being built. Check your My Sites dashboard." })
      router.push("/my-sites")
    } catch { setError("Something went wrong. Please try again.") } finally { setIsLoading(false) }
  }

  const handleSelectResult = (result: SearchResult) => {
    if (!session) { setIsLoginModalOpen(true); return }
    setSearchQuery(""); setShowDropdown(false); setPendingResult(result)
  }

  const accentClass = accent === "green"
    ? "bg-green-600 hover:bg-green-700 shadow-green-600/20"
    : "bg-primary hover:bg-primary/90 shadow-primary/20"

  return (
    <>
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />

      {/* URL tutorial dialog */}
      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none bg-transparent shadow-none z-[200]">
          <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">Wrong Link Format</DialogTitle>
                  <DialogDescription>The link you pasted isn&apos;t a Google Maps &quot;Share&quot; link.</DialogDescription>
                </div>
              </div>
              <button onClick={() => setIsTutorialOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black">
              <img src="/url-tutorial.gif" alt="How to copy Google Maps URL" loading="lazy" decoding="async" className="w-full h-auto rounded-xl shadow-inner" />
            </div>
            <div className="p-6 bg-muted/30 text-center">
              <Button className="w-full h-12 text-base font-bold" onClick={() => setIsTutorialOpen(false)}>
                Got it, I&apos;ll copy the right link!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog */}
      <Dialog open={!!pendingResult} onOpenChange={(o) => { if (!o) setPendingResult(null) }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none z-[200]">
          <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border">
            <div className="p-6 border-b border-border bg-muted/30">
              <DialogTitle className="text-lg font-bold">Generate website for this {entityLabel}?</DialogTitle>
              <DialogDescription className="sr-only">Confirm {entityLabel} selection</DialogDescription>
            </div>
            {pendingResult && (
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-start gap-3 bg-muted/40 rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-base leading-tight">{pendingResult.name}</p>
                    {pendingResult.address && <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{pendingResult.address}</p>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We will pull your <span className="font-semibold text-foreground">photos, reviews, ratings &amp; hours</span> from Google Maps and build your website in 60 seconds.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12" onClick={() => setPendingResult(null)} disabled={isLoading}>Go back</Button>
                  <Button
                    className={cn("flex-1 h-12 text-white font-bold shadow-md", accentClass)}
                    onClick={() => { const u = pendingResult.url; setPendingResult(null); handleGenerate(u) }}
                    disabled={isLoading}
                  >
                    {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Generating...</> : <>Yes, build my website<ArrowRight className="ml-2 w-4 h-4" /></>}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-3 w-full">
        {/* Info banner */}
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-2.5">
          <span className="text-base leading-none mt-0.5">🗺️</span>
          <p className="text-[12px] text-blue-700 leading-snug">
            <span className="font-semibold">We automatically pull your photos, reviews, ratings &amp; hours from Google Maps</span> — nothing to type manually.
          </p>
        </div>

        {/* Search by name */}
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
          {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground z-10" />}
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            readOnly={!session}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={() => { if (!session) setIsLoginModalOpen(true) }}
            onFocus={() => { if (searchResults.length > 0) setShowDropdown(true) }}
            onKeyDown={(e) => { if (e.key === "Escape") setShowDropdown(false) }}
            className={cn("pl-12 h-14 text-base bg-card border-border shadow-sm", !session && "cursor-pointer")}
          />
          <AnimatePresence>
            {showDropdown && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-y-auto max-h-60"
              >
                {searchResults.map((result, i) => (
                  <button
                    key={result.id}
                    className={cn("w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/60 transition-colors", i > 0 && "border-t border-border/50")}
                    onMouseDown={(e) => { e.preventDefault(); handleSelectResult(result) }}
                  >
                    <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{result.name}</p>
                      {result.address && <p className="text-xs text-muted-foreground truncate">{result.address}</p>}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="relative flex items-center gap-4">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">or paste your Google Maps link</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Paste + Generate */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="url"
              placeholder="Paste Google Maps link"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError("") }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleGenerate() } }}
              className="pl-10 h-11 text-sm bg-muted/30 border-dashed border-border"
              disabled={isLoading}
            />
          </div>
          <Button
            className={cn("h-11 px-6 text-white font-semibold shadow-md text-sm", accentClass)}
            onClick={() => handleGenerate()}
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Building...</> : <>Go Live<ArrowRight className="ml-2 w-4 h-4" /></>}
          </Button>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    </>
  )
}
