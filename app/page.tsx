import { AnnouncementBanner } from "@/components/announcement-banner"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { WhyBothSection } from "@/components/why-both-section"
import { ShowcaseSection } from "@/components/showcase-section"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { FloatingElements } from "@/components/floating-elements"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingElements />
      <AnnouncementBanner />
      <Navbar />

      <main className="relative z-10">
        <HeroSection />

        <WhyBothSection />

        <ShowcaseSection />

        <PricingSection />

        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
