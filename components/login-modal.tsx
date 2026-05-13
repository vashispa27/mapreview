"use client"

import { useState, useRef, useEffect } from "react"
import { signIn } from "next-auth/react"
import { Mail, Lock, Loader2, Phone, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { track } from "@/lib/analytics"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdminLogin?: () => void
  accent?: "red"
}

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@maptosite.app"
function isAdminEmail(e: string) { return e === ADMIN_EMAIL || e === "admin" }

// ─── Shared OTP step UI ───────────────────────────────────────────────────────

function OtpStep({
  label, onBack, onSend, onVerify, isLoading, error, resendTimer,
}: {
  label: string
  onBack: () => void
  onSend: () => void
  onVerify: (otp: string) => void
  isLoading: boolean
  error: string
  resendTimer: number
}) {
  const [otp, setOtp] = useState("")
  return (
    <>
      <button
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        onClick={onBack}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {label}
      </button>
      <p className="text-sm text-muted-foreground">Enter the 6-digit OTP we sent you</p>
      <Input
        type="tel"
        inputMode="numeric"
        placeholder="• • • • • •"
        value={otp}
        maxLength={6}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => e.key === "Enter" && onVerify(otp)}
        disabled={isLoading}
        className="text-center text-2xl tracking-[0.6em] font-bold h-14"
        autoFocus
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button className="w-full" onClick={() => onVerify(otp)} disabled={isLoading || otp.length !== 6}>
        {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Verifying...</> : "Verify OTP"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {resendTimer > 0
          ? `Resend in ${resendTimer}s`
          : <button className="underline hover:text-foreground" onClick={onSend}>Resend OTP</button>}
      </p>
    </>
  )
}

// ─── Phone tab ────────────────────────────────────────────────────────────────

function PhoneTab({ onOpenChange }: { onOpenChange: (o: boolean) => void }) {
  const [phone, setPhone] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const startTimer = () => {
    setResendTimer(30)
    timerRef.current = setInterval(() => {
      setResendTimer(p => { if (p <= 1) { clearInterval(timerRef.current!); return 0 } return p - 1 })
    }, 1000)
  }

  const handleSend = async () => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length !== 10) { setError("Enter a valid 10-digit mobile number"); return }
    setError("")
    setIsLoading(true)
    track("phone_number_entered")
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleaned }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to send OTP"); return }
      track("otp_sent_phone")
      setStep("otp")
      startTimer()
    } catch {
      setError("Failed to send OTP. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (otp: string) => {
    setError("")
    setIsLoading(true)
    try {
      const res = await signIn("phone", { phone: phone.replace(/\D/g, ""), otp, redirect: false })
      if (res?.error) { setError("Wrong OTP or it has expired.") }
      else { track("otp_verified_phone"); onOpenChange(false); window.location.reload() }
    } catch {
      setError("Verification failed. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 pt-2">
      {step === "phone" ? (
        <>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 h-10 px-3 border border-input rounded-md bg-muted/40 text-sm font-medium shrink-0">
              🇮🇳 +91
            </div>
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={phone}
              maxLength={10}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError("") }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              autoFocus
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button className="w-full" onClick={handleSend} disabled={isLoading || phone.replace(/\D/g, "").length !== 10}>
            {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Sending OTP...</> : "Send OTP"}
          </Button>
        </>
      ) : (
        <OtpStep
          label={`+91 ${phone}`}
          onBack={() => { setStep("phone"); setError("") }}
          onSend={handleSend}
          onVerify={handleVerify}
          isLoading={isLoading}
          error={error}
          resendTimer={resendTimer}
        />
      )}
    </div>
  )
}

// ─── Email OTP tab ────────────────────────────────────────────────────────────

function EmailTab({ onOpenChange }: { onOpenChange: (o: boolean) => void }) {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const startTimer = () => {
    setResendTimer(30)
    timerRef.current = setInterval(() => {
      setResendTimer(p => { if (p <= 1) { clearInterval(timerRef.current!); return 0 } return p - 1 })
    }, 1000)
  }

  const handleSend = async () => {
    if (!email.includes("@")) { setError("Enter a valid email address"); return }
    setError("")
    setIsLoading(true)
    track("email_entered")
    try {
      const res = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to send OTP"); return }
      track("otp_sent_email")
      setStep("otp")
      startTimer()
    } catch {
      setError("Failed to send OTP. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (otp: string) => {
    setError("")
    setIsLoading(true)
    try {
      const res = await signIn("email-otp", { email: email.trim().toLowerCase(), otp, redirect: false })
      if (res?.error) { setError("Wrong OTP or it has expired.") }
      else { track("otp_verified_email"); onOpenChange(false); window.location.reload() }
    } catch {
      setError("Verification failed. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Admin credentials flow
  const showAdminPassword = isAdminEmail(email.trim().toLowerCase())
  const [password, setPassword] = useState("")
  const handleAdminLogin = async () => {
    setIsLoading(true)
    const result = await signIn("admin-credentials", { email: ADMIN_EMAIL, password, redirect: false })
    setIsLoading(false)
    if (result?.error) setError("Invalid credentials")
    else { onOpenChange(false); window.location.reload() }
  }

  return (
    <div className="space-y-4 pt-2">
      {step === "email" ? (
        <>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError("") }}
              onKeyDown={(e) => e.key === "Enter" && (showAdminPassword ? handleAdminLogin() : handleSend())}
              className="pl-10"
              disabled={isLoading}
              autoFocus
            />
          </div>
          {showAdminPassword && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button
            className="w-full"
            onClick={showAdminPassword ? handleAdminLogin : handleSend}
            disabled={isLoading || !email.trim()}
          >
            {isLoading
              ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />{showAdminPassword ? "Signing in..." : "Sending OTP..."}</>
              : showAdminPassword ? "Sign In" : "Send OTP to Email"}
          </Button>
        </>
      ) : (
        <OtpStep
          label={email}
          onBack={() => { setStep("email"); setError("") }}
          onSend={handleSend}
          onVerify={handleVerify}
          isLoading={isLoading}
          error={error}
          resendTimer={resendTimer}
        />
      )}
    </div>
  )
}

// ─── Google button (shared) ───────────────────────────────────────────────────

function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => { setIsLoading(true); signIn("google", { callbackUrl: window.location.href }) }}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : (
          <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        Continue with Google
      </Button>
    </>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type Tab = "phone" | "email"

export function LoginModal({ open, onOpenChange, accent }: LoginModalProps) {
  const [tab, setTab] = useState<Tab>("phone")
  useEffect(() => { if (open) setTab("phone") }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {accent === "red" ? "Get your restaurant online" : "Welcome to MapToSite"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {accent === "red"
              ? "Sign in to build your restaurant website in 60 seconds"
              : "Sign in to get your website + management console in 60 seconds"}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {([
            { id: "phone" as Tab, label: "Phone", icon: <Phone className="w-3.5 h-3.5" /> },
            { id: "email" as Tab, label: "Email", icon: <Mail className="w-3.5 h-3.5" /> },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all",
                tab === t.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "phone" ? <PhoneTab onOpenChange={onOpenChange} /> : <EmailTab onOpenChange={onOpenChange} />}

        <GoogleButton />

        <p className="text-xs text-center text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  )
}
