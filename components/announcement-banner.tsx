"use client"

import { Zap } from "lucide-react"

export function AnnouncementBanner() {
  return (
    <div className="flex justify-center pt-20 pb-0 relative z-40">
      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium">
        <Zap className="w-3.5 h-3.5" />
        <span>Built for gym owners — website, members, billing &amp; workout plans, all in <strong>60 seconds</strong></span>
      </div>
    </div>
  )
}
