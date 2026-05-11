import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import { MapPin, Zap, Heart, Globe, ArrowRight, Mail } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About MapToSite — Built for Indian Small Businesses",
  description: "MapToSite was built to give every gym owner, restaurant, and local business a professional website — without developers, designers, or weeks of effort. Learn our story.",
  alternates: {
    canonical: "https://maptosite.app/about",
  },
  openGraph: {
    title: "About MapToSite",
    description: "Built to give every local business a professional web presence in 60 seconds.",
    url: "https://maptosite.app/about",
    type: "website",
    siteName: "MapToSite",
  },
}

const stats = [
  { value: "60s",   label: "Average time to go live" },
  { value: "100+",  label: "Businesses online" },
  { value: "₹259",  label: "Starting price per month" },
  { value: "0",     label: "Lines of code needed" },
]

const values = [
  {
    icon: Zap,
    title: "Speed over perfection",
    body: "A website that's live today beats a perfect one that's still being designed next month. We obsess over getting you online as fast as possible.",
  },
  {
    icon: Heart,
    title: "Built for the owner, not the developer",
    body: "Most website tools assume you have a tech team. We assume you're the one running the front desk, training clients, and answering calls yourself.",
  },
  {
    icon: Globe,
    title: "Your Google presence, amplified",
    body: "You already built credibility on Google Maps — reviews, photos, ratings. We turn that work into a website instead of making you start over.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 mb-6">
              <MapPin className="w-3 h-3" /> Our story
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              We built MapToSite because{" "}
              <span className="text-primary">good businesses deserve good websites</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Thousands of gyms, restaurants, and local businesses in India have hundreds of Google reviews, great photos, and loyal customers — but no website. We fixed that.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4 border-y border-border bg-muted/30">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black text-primary mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-3xl font-black tracking-tight text-foreground not-prose mb-6">The problem we saw</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Walk into any gym in Mumbai or Delhi. Ask the owner if they have a website. Half of them will say no. The other half will pull out something built in 2018 that hasn&apos;t been updated since.
                </p>
                <p>
                  But open Google Maps. That same gym has 4.7 stars. 300 reviews. A dozen photos of people actually training there. Real social proof, built up over years.
                </p>
                <p>
                  The data exists. The credibility exists. What&apos;s missing is a way to turn it into a website without hiring a developer, learning design, or waiting three weeks.
                </p>
                <p>
                  That&apos;s what MapToSite does. Paste your Google Maps link. We pull your photos, reviews, hours, and business info automatically. Your website is live in 60 seconds — with a management system included.
                </p>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-foreground not-prose mt-16 mb-6">Who we&apos;re building for</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We built MapToSite primarily for <strong className="text-foreground">gyms and fitness centres</strong> across India — the kind of business where the owner is also the head trainer, accountant, and marketing team.
                </p>
                <p>
                  We also serve <strong className="text-foreground">restaurants, cafes, and food businesses</strong> that need a professional online presence without the complexity of a full e-commerce setup.
                </p>
                <p>
                  Our Pro plan includes a full gym management system — member tracking, workout and diet plans, GST billing, and earnings dashboards — so your website and operations live in one place.
                </p>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-foreground not-prose mt-16 mb-6">Where we&apos;re based</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  MapToSite is built and run from India. Our pricing is in rupees, our support speaks in your timezone, and we understand what it means to run a local business here — the GST invoicing, the WhatsApp-first customers, the cash-and-carry memberships.
                </p>
                <p>
                  We&apos;re a small team that cares more about whether your website actually gets you new members than about building features nobody uses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black tracking-tight text-foreground text-center mb-12">What we believe in</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((v) => (
                <div key={v.title} className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-black text-lg text-foreground mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team / Founder note */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-primary-foreground">A</span>
                </div>
                <div>
                  <div className="font-black text-lg text-foreground">Abhinav V.</div>
                  <div className="text-sm text-muted-foreground">Founder, MapToSite</div>
                </div>
              </div>
              <blockquote className="text-muted-foreground leading-relaxed text-base md:text-lg italic border-l-4 border-primary pl-5">
                &ldquo;I kept seeing incredible gyms and restaurants with no web presence — and a fully updated Google Maps profile sitting right there. It felt absurd that turning one into the other required a developer. So we built the bridge.&rdquo;
              </blockquote>
            </div>
          </div>
        </section>

        {/* Contact + CTA */}
        <section className="py-20 px-4 bg-muted/30 border-t border-border">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-stretch">

            {/* Get in touch */}
            <div className="flex-1 bg-card border border-border rounded-2xl p-8">
              <Mail className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-black text-foreground mb-2">Get in touch</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Questions, feedback, or just want to say hi — we read every email and reply within 24 hours.
              </p>
              <a
                href="mailto:admin@maptosite.app"
                className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
              >
                admin@maptosite.app <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* CTA */}
            <div className="flex-1 bg-primary rounded-2xl p-8 text-primary-foreground flex flex-col justify-between">
              <div>
                <Zap className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="text-xl font-black mb-2">Try it yourself</h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
                  Paste any Google Maps gym or restaurant link and see your website in 60 seconds. No sign-up needed to preview.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white text-primary font-black text-sm px-5 py-3 rounded-xl hover:bg-white/90 transition-colors w-fit"
              >
                Build my website <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
