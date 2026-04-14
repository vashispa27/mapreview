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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RXC8HGDM3G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RXC8HGDM3G');
          `}
        </Script>
        <Script id="crisp-widget" strategy="afterInteractive">
          {`
            window.$crisp=[];
            window.CRISP_WEBSITE_ID="2f66a409-5d22-4f8a-9209-e573f37cb7d9";
            (function(){
              d=document;
              s=d.createElement("script");
              s.src="https://client.crisp.chat/l.js";
              s.async=1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `}
        </Script>
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
