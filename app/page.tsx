import Link from "next/link"
import { MapPin, UtensilsCrossed, Dumbbell, ArrowRight, Globe, MessageSquare, LayoutDashboard, Zap, Bell, CheckCircle2 } from "lucide-react"
import { Footer } from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "MapToSite — Turn Your Google Maps Listing into a Website & Business System",
  description:
    "MapToSite instantly converts your Google business profile into a high-converting website with built-in enquiry and management tools. No coding. No setup.",
}

export default function HubPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Nav */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-lg">MapToSite</span>
          </div>
          <a
            href={`https://wa.me/917452008033?text=${encodeURIComponent("Hi, I'd like to get a demo for MapToSite!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Book Demo
          </a>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="px-4 pt-20 pb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 mb-6">
              <Zap className="w-3 h-3" /> Powered by your Google listing
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Turn Your Google Maps Listing into a{" "}
              <span className="text-primary">Website & Business System</span>{" "}
              in 60 Seconds
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              MapToSite instantly converts your Google business profile into a high-converting website
              with built-in enquiry and management tools.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/gyms"
                className="inline-flex items-center gap-2 h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base rounded-xl shadow-lg shadow-primary/25 transition-colors"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`https://wa.me/917452008033?text=${encodeURIComponent("Hi, I'd like to see a demo of MapToSite!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-14 px-8 border-2 border-border hover:border-primary text-foreground font-bold text-base rounded-xl transition-colors"
              >
                See Demo
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              No coding · No setup · Works with your existing Google listing
            </p>
          </div>
        </section>

        {/* ── Quick access: Fitness + Food ── */}
        <section className="px-4 pb-16">
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">Choose your business type</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/gyms"
                className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-6 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-base font-black mb-1 tracking-tight">MapToSite Fitness</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  For gym owners. Website, WhatsApp enquiries, and member management.
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-primary">
                  Get started <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                href="/restaurants"
                className="group bg-card border-2 border-border hover:border-red-500 rounded-2xl p-6 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                  <UtensilsCrossed className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-base font-black mb-1 tracking-tight">MapToSite Food</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  For restaurants. Menu, table booking, loyalty programs, and Google reviews.
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-red-600">
                  Get started <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── From listing to system ── */}
        <section className="px-4 py-20 bg-gray-50 border-y border-border">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 mb-5">
              How it works
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-5">
              From a Simple Listing to a{" "}
              <span className="text-primary">Complete Business System</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-14 max-w-xl mx-auto">
              Most businesses rely only on their Google listing — and lose leads every day.
              MapToSite transforms it into:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: <Globe className="w-6 h-6 text-primary" />,
                  bg: "bg-primary/10",
                  title: "A professional website",
                  desc: "Mobile-optimised, auto-built from your Google listing. Live in 60 seconds.",
                },
                {
                  icon: <MessageSquare className="w-6 h-6 text-emerald-600" />,
                  bg: "bg-emerald-50",
                  title: "A lead capture system",
                  desc: "WhatsApp buttons and enquiry forms that turn visitors into real contacts.",
                },
                {
                  icon: <LayoutDashboard className="w-6 h-6 text-violet-600" />,
                  bg: "bg-violet-50",
                  title: "A business management dashboard",
                  desc: "Track leads, manage members, and automate follow-ups — all in one place.",
                },
              ].map(({ icon, bg, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl border border-border p-7 text-left shadow-sm">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-5`}>
                    {icon}
                  </div>
                  <h3 className="font-black text-base mb-2 tracking-tight">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <p className="text-base font-bold text-foreground">All in seconds.</p>
          </div>
        </section>

        {/* ── What you get ── */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                Everything You Need to Convert and Manage Leads
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                One tool. Zero complexity. Built for local business owners in India.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <Globe className="w-5 h-5 text-primary" />, bg: "bg-primary/10", title: "Auto-generated website", desc: "Mobile-optimised site built from your Google Maps profile in seconds." },
                { icon: <MessageSquare className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50", title: "WhatsApp & form lead capture", desc: "Every visitor can reach you instantly — no middlemen, no missed enquiries." },
                { icon: <LayoutDashboard className="w-5 h-5 text-violet-600" />, bg: "bg-violet-50", title: "Central dashboard to manage leads", desc: "All enquiries, members, and bookings in one place." },
                { icon: <Bell className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50", title: "Automation for follow-ups", desc: "Automated renewal reminders and re-engagement messages so you never lose a customer." },
                { icon: <Zap className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50", title: "Booking & enquiry system", desc: "Let customers book or enquire directly from your website — 24/7." },
              ].map(({ icon, bg, title, desc }) => (
                <div key={title} className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl p-5">
                <div className="text-center">
                  <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-black text-foreground">Free to start</p>
                  <p className="text-xs text-muted-foreground">No credit card · No coding required</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="px-4 py-20 bg-primary text-primary-foreground text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-5">
              Ready to turn your Google listing into a business system?
            </h2>
            <p className="text-primary-foreground/70 mb-8 text-lg">
              Pick your business type and go live in 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/gyms"
                className="inline-flex items-center gap-2 h-13 px-8 py-3.5 bg-white text-primary font-black rounded-xl shadow-lg hover:bg-white/90 transition-colors"
              >
                <Dumbbell className="w-5 h-5" /> MapToSite Fitness
              </Link>
              <Link
                href="/restaurants"
                className="inline-flex items-center gap-2 h-13 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-black rounded-xl border border-white/20 transition-colors"
              >
                <UtensilsCrossed className="w-5 h-5" /> MapToSite Food
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
