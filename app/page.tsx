import Link from "next/link"
import { MapPin, UtensilsCrossed, Dumbbell, ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "MapToSite — Build Your Business Website from Google Maps",
  description:
    "Turn your Google Maps listing into a professional website in 60 seconds. Built for gyms and restaurants across India.",
}

export default function HubPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-lg">MapToSite</span>
          </div>
        </div>
      </header>

      {/* Hub */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl mx-auto w-full text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 mb-6">
            Website builder from Google Maps
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5 leading-[1.1]">
            Your business deserves<br />
            <span className="text-primary">a real website.</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed">
            We build it from your Google Maps listing in 60 seconds.
            Pick your business type below.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Gyms card */}
            <Link
              href="/gyms"
              className="group relative bg-card border-2 border-border hover:border-primary rounded-2xl p-8 text-left transition-all hover:shadow-xl hover:-translate-y-1 duration-200"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Dumbbell className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-black mb-2 tracking-tight">MapToSite Fitness</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                For gym owners. Turn Google visitors into paying members with a website, WhatsApp enquiries, and member management.
              </p>
              <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
                Get started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Restaurants card */}
            <Link
              href="/food"
              className="group relative bg-card border-2 border-border hover:border-red-500 rounded-2xl p-8 text-left transition-all hover:shadow-xl hover:-translate-y-1 duration-200"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5 group-hover:bg-red-100 transition-colors">
                <UtensilsCrossed className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-xl font-black mb-2 tracking-tight">MapToSite Food</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                For restaurant owners. Get a menu, table booking, loyalty programs, and Google reviews — all live in 60 seconds.
              </p>
              <div className="flex items-center gap-1.5 text-sm font-bold text-red-600">
                Get started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-10">
            Free to start · No credit card · Built from your Google Maps listing
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
