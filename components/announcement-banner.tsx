"use client"

import { useState } from "react"
import { Sparkles, Copy, Check } from "lucide-react"

const COUPON = "FIRST100"

export function AnnouncementBanner() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex justify-center pt-20 pb-0 relative z-40">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-500/15 transition-colors cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>First 100 customers: 50% off on all plans — use code <strong>{COUPON}</strong></span>
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
      </button>
    </div>
  )
}
