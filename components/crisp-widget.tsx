"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

function shouldHide(pathname: string) {
  return (
    pathname.startsWith("/site/") ||
    pathname.startsWith("/preview/") ||
    pathname.startsWith("/console/")
  )
}

export function CrispWidget() {
  const pathname = usePathname()

  useEffect(() => {
    const w = window as any
    if (!w.$crisp) return
    if (shouldHide(pathname)) {
      w.$crisp.push(["do", "chat:hide"])
    } else {
      w.$crisp.push(["do", "chat:show"])
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
