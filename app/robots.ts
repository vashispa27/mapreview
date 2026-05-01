import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/console/", "/preview/", "/my-sites/"],
      },
    ],
    sitemap: "https://maptosite.app/sitemap.xml",
  }
}
