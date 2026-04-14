"use client"

import { AnnouncementBanner } from "@/components/announcement-banner"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { WhyWebsiteSection } from "@/components/why-website-section"
import { ShowcaseSection } from "@/components/showcase-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { FloatingElements } from "@/components/floating-elements"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating background elements */}
      <FloatingElements />
      
      {/* Announcement Banner */}
      <AnnouncementBanner />

      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* How It Works Section */}
        <section id="how-it-works">
          <HowItWorksSection />
        </section>

        {/* Why You Need a Website */}
        <WhyWebsiteSection />

        {/* Features Section */}
        <section id="features">
          <FeaturesSection />
        </section>
        
        {/* Showcase Section */}
        <ShowcaseSection />
        
        {/* Testimonials Section */}

        {/* Pricing Section */}
        <PricingSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
