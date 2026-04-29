"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdminLogin?: () => void
  accent?: "red"
}

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@maptosite.app"

function isAdminEmail(email: string) {
  return email === ADMIN_EMAIL || email === "admin"
}

export function LoginModal({ open, onOpenChange, accent }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const showPasswordField = isAdminEmail(email.trim().toLowerCase())

  const handleEmailSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase()
    setError("")

    if (!trimmedEmail) return

    // Admin credentials flow
    if (isAdminEmail(trimmedEmail)) {
      if (!password) {
        setError("Enter your admin password")
        return
      }
      setIsLoading(true)
      const result = await signIn("admin-credentials", {
        email: ADMIN_EMAIL,
        password,
        redirect: false,
      })
      setIsLoading(false)
      if (result?.error) {
        setError("Invalid credentials")
      } else {
        onOpenChange(false)
        window.location.reload()
      }
      return
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    signIn("google", { callbackUrl: window.location.href })
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    signIn("google", { callbackUrl: window.location.href })
  }

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
              : "Sign in to generate beautiful websites from your Google Maps listing"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && !showPasswordField && handleEmailSubmit()}
                className="pl-10"
                disabled={isLoading}
              />
            </div>

            {showPasswordField && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                  className="pl-10"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            )}

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button
              className={accent === "red" ? "w-full bg-red-600 hover:bg-red-700 text-white" : "w-full"}
              onClick={handleEmailSubmit}
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  {showPasswordField ? "Signing in..." : "Redirecting..."}
                </>
              ) : (
                showPasswordField ? "Sign In" : "Continue with Email"
              )}
            </Button>
          </div>

          {!showPasswordField && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                ) : (
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
          )}

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
