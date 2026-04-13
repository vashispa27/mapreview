"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, MapPin, Loader2, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mascot } from "@/components/mascot"
import { WebsitePreviewCard } from "@/components/showcase-cards"
import { useSession, signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function HeroSection() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleFocusEvent = () => {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    window.addEventListener("focus-input", handleFocusEvent)
    return () => window.removeEventListener("focus-input", handleFocusEvent)
  }, [])

  const validateUrl = (testUrl: string) => {
    // Restore ADMIN bypass
    if (testUrl.trim().toLowerCase() === "admin") return null

    if (!testUrl.includes("maps.app.goo.gl") && !testUrl.includes("goo.gl/maps")) {
      return "invalid"
    }
    return null
  }

  const handleGenerate = async () => {
    const finalUrl = url.trim()

    // ADMIN BYPASS
    if (finalUrl.toLowerCase() === "admin") {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push(`/preview/admin-demo`)
      return
    }

    // OFFLINE MODE BYPASS
    if (process.env.NEXT_PUBLIC_OFFLINE_MODE === "true") {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push(`/preview/mock-site-id`)
      setIsLoading(false)
      return
    }

    if (!session) {
      signIn("google")
      return
    }

    if (!finalUrl) {
      setError("Please enter a Google Maps URL")
      return
    }

    const validationResult = validateUrl(finalUrl)
    if (validationResult === "invalid") {
      setIsTutorialOpen(true)
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to generate site")
        return
      }

      toast({
        title: "Site Generation Started!",
        description: "Your page is being built. Check the status in your My Sites dashboard.",
      })
      
      router.push("/my-sites")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* URL Tutorial Modal */}
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
                  <DialogDescription>The link you pasted isn't a Google Maps "Share" link.</DialogDescription>
                </div>
              </div>
              <button onClick={() => setIsTutorialOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black">
              <img 
                src="/url-tutorial.gif" 
                alt="How to copy Google Maps URL" 
                className="w-full h-auto rounded-xl shadow-inner"
              />
            </div>
            <div className="p-6 bg-muted/30 text-center">
              <Button className="w-full h-12 text-base font-bold" onClick={() => setIsTutorialOpen(false)}>
                Got it, I'll copy the right link!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Turn Google Maps into Websites</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
            >
              <span className="text-balance">Your business deserves a</span>{" "}
              <span className="text-primary relative">
                beautiful website
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.path
                    d="M2 8 Q100 2 198 8"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 text-pretty"
            >
              Paste your Google Maps "Share" link and watch as we transform your reviews into a beautiful one-page website.
            </motion.p>

            {/* URL Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-4 max-w-xl mx-auto lg:mx-0"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="url"
                    placeholder="Paste Google Maps link..."
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      setError("")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleGenerate()
                      }
                    }}
                    className="pl-12 h-14 text-base bg-card border-border shadow-sm"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  size="lg"
                  className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25"
                  onClick={handleGenerate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Site
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-sm mt-2 max-w-xl mx-auto lg:mx-0"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          {/* Right side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <WebsitePreviewCard className="w-full max-w-md mx-auto" />
            </motion.div>

            <motion.div
              className="absolute -left-16 bottom-0"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <Mascot className="w-32 h-40" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  )
}
