"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"

export function CrispWidget() {
  const pathname = usePathname()
  if (pathname.startsWith("/site/")) return null

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
