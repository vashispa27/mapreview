import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-32">
        <h1 className="text-4xl font-black tracking-tight mb-8">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
            <p>Welcome to MapToSite. We respect your privacy and want to protect your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Data</strong> includes first name, last name, and profile picture from your Google Account.</li>
              <li><strong>Contact Data</strong> includes email address.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
              <li><strong>Business Data</strong> includes Google Maps URLs and business information you provide for site generation.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To register you as a new customer.</li>
              <li>To process and generate your business website.</li>
              <li>To manage our relationship with you.</li>
            </ul>
          </section>

          <section id="cookies" className="space-y-4 pt-8">
            <h2 className="text-2xl font-bold text-foreground">4. Cookie Policy</h2>
            <p>We use cookies to enhance your experience and secure your session. By using MapToSite, you consent to the use of cookies for authentication and performance tracking purposes.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
