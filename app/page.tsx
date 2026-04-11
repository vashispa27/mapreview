"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
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
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <section id="features">
          <FeaturesSection />
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
        
        {/* Showcase Section */}
        <ShowcaseSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* Pricing Section */}
        <section id="pricing">
          <PricingSection />
        </section>
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
