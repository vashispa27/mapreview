import type { Metadata, Viewport } from "next"
import Script from "next/script"

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "Console — MapToSite",
  description: "Manage your gym members, payments and plans",
  manifest: "/console-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Console",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="register-sw" strategy="afterInteractive">{`
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
              .catch(function(err) { console.warn('SW registration failed:', err) })
          })
        }
      `}</Script>
      {children}
    </>
  )
}
