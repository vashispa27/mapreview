import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MapToSite — Gym & Restaurant Websites from Google Maps in 60 Seconds',
  description: 'MapToSite instantly converts your Google Maps listing into a professional website with real reviews, photos, and a full management system. No coding. No setup.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'MapToSite - Turn Google Maps into Beautiful Websites',
    description: 'Your competitors have websites. Your customers expect one. Turn your Google Maps listing into a professional website in 30 seconds.',
    url: 'https://maptosite.app',
    siteName: 'MapToSite',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MapToSite - Google Maps to Website in seconds',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MapToSite - Turn Google Maps into Beautiful Websites',
    description: 'Your competitors have websites. Your customers expect one. Turn your Google Maps listing into a professional website in 30 seconds.',
    images: ['/og-image.png'],
  },
}

import { AuthProvider } from "@/components/providers/auth-provider"
import { AdminProvider } from "@/components/providers/admin-provider"
import Script from "next/script"
import { WhatsAppWidget } from "@/components/whatsapp-widget"
import { StickyTimer } from "@/components/sticky-timer"

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MapToSite",
  alternateName: ["MapToSite.app", "Map To Site"],
  url: "https://maptosite.app",
  description: "Turn your Google Maps listing into a professional website in 60 seconds. Auto-fills photos, reviews, hours and memberships.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://maptosite.app/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MapToSite",
  alternateName: "MapToSite.app",
  url: "https://maptosite.app",
  logo: "https://maptosite.app/apple-icon.png",
  description: "MapToSite instantly converts your Google Maps business profile into a professional website with built-in enquiry and management tools. No coding. No setup.",
  foundingDate: "2024",
  areaServed: "IN",
  sameAs: [
    "https://instagram.com/maptosite",
    "https://twitter.com/maptosite",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "admin@maptosite.app",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          strategy="beforeInteractive"
        />
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          strategy="beforeInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LNGGMH0MFE"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LNGGMH0MFE');
          `}
        </Script>
        <WhatsAppWidget />
        <StickyTimer />
        <AuthProvider>
          <AdminProvider>
            {children}
          </AdminProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
