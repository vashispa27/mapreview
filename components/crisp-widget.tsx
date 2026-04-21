"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

const HIDE_ROUTES = ["/site/", "/preview/", "/console/"]

function shouldHide(pathname: string) {
  return HIDE_ROUTES.some((r) => pathname.startsWith(r))
}

const CRISP_CSS_ID = "crisp-force-hide"
const CRISP_HIDE_CSS = "#crisp-chatbox, .crisp-client { display: none !important; }"

export function CrispWidget() {
  const pathname = usePathname()

  useEffect(() => {
    const hide = shouldHide(pathname)
    const existing = document.getElementById(CRISP_CSS_ID)

    if (hide && !existing) {
      const style = document.createElement("style")
      style.id = CRISP_CSS_ID
      style.textContent = CRISP_HIDE_CSS
      document.head.appendChild(style)
    } else if (!hide && existing) {
      existing.remove()
    }

    // Also call Crisp API if already loaded
    const w = window as any
    if (w.$crisp?.push) {
      w.$crisp.push(["do", hide ? "chat:hide" : "chat:show"])
    }
  }, [pathname])

  return (
    <Script id="crisp-widget" strategy="lazyOnload">
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
  )
}
