import { NextRequest, NextResponse } from "next/server"
import { createJob } from "@/lib/job-store"
import { inngest } from "@/lib/inngest/client"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const isGoogleMapsUrl =
      url.includes("maps.app.goo.gl") ||
      url.includes("goo.gl/maps") ||
      url.includes("google.com/maps") ||
      url.includes("maps.google.com")
    if (!isGoogleMapsUrl) {
      return NextResponse.json({
        error: "Please provide a valid Google Maps URL.",
      }, { status: 400 })
    }

    // 1. Fetch User and their current sites
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true }
    })

    const allSites = await db.site.findMany({
      where: { userId: session.user.id },
      select: { status: true }
    })

    // 2. CHECK: Is there a site ALREADY in progress?
    const inProgressStatuses = ["QUEUED", "SCRAPING_APIFY", "ANALYZING_GEMINI"]
    const siteInProgress = allSites.some(s => inProgressStatuses.includes(s.status))

    if (siteInProgress) {
      return NextResponse.json({ 
        error: "You already have a site being generated. Please wait for it to finish before starting a new one!" 
      }, { status: 403 })
    }

    // 3. CHECK: Has the user reached their total limit? (Ignore FAILED sites)
    const activeSiteCount = allSites.filter(s => s.status !== "FAILED").length
    const limit = user?.plan === "pro" ? 10 : user?.plan === "base" ? 3 : 1
    
    if (activeSiteCount >= limit) {
      const message = user?.plan === "base" || !user?.plan 
        ? "Usage limit reached. You can only have 1 active website on the free plan."
        : `Usage limit reached. Your ${user.plan} plan allows up to ${limit} active websites.`
        
      return NextResponse.json({ error: message }, { status: 403 })
    }

    // --- Start Generation ---
    const jobId = createJob(url)

    await db.site.create({
      data: {
        id: jobId,
        userId: session.user.id,
        url: url,
        status: "QUEUED"
      }
    })

    await inngest.send({
      name: "app/generate.site",
      data: { url, jobId }
    })

    return NextResponse.json({ success: true, jobId })
    
  } catch (error) {
    console.error("Generation Error:", error)
    return NextResponse.json({ error: "Failed to queue site generation." }, { status: 500 })
  }
}
