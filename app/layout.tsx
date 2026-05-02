import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MapToSite - Turn Google Maps into Beautiful Websites',
  description: 'Transform any Google Maps business page into a stunning one-pager website with real reviews and photos in seconds.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
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
