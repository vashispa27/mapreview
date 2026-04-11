import { NextRequest, NextResponse } from "next/server"
import { createJob } from "@/lib/job-store"
import { inngest } from "@/lib/inngest/client"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isOfflineMode, mockUser } from "@/lib/offline-mode"
import { OFFLINE_MOCK_SITE_ID } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    // In offline mode, bypass auth and return mock job ID immediately
    if (isOfflineMode) {
      const { url } = await request.json()
      
      if (!url || typeof url !== "string") {
        return NextResponse.json({ error: "URL is required" }, { status: 400 })
      }

      // Return the offline mock site ID - no actual job is created
      return NextResponse.json({ success: true, jobId: OFFLINE_MOCK_SITE_ID })
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    if (!url.includes("google.com/maps") && !url.includes("goo.gl") && !url.includes("maps.app")) {
      return NextResponse.json({ error: "Please provide a valid Google Maps URL" }, { status: 400 })
    }

    // Usage limit check (Max 3 sites)
    const siteCount = await db.site.count({
      where: { userId: session.user.id }
    })

    if (siteCount >= 3) {
      return NextResponse.json({ 
        error: "Usage limit reached. You can only generate up to 3 websites with a free account." 
      }, { status: 403 })
    }

    // Connect Memory Dictionary safely locking local variables immediately 
    const jobId = createJob(url)

    // Log the site creation in the database
    await db.site.create({
      data: {
        id: jobId,
        userId: session.user.id,
        url: url,
        status: "QUEUED"
      }
    })

    // Execute absolute Decoupling triggering Serverless Event Webhooks via Message Brokers completely reliably.
    await inngest.send({
      name: "app/generate.site",
      data: { url, jobId }
    })

    // Reply instantaneously disconnecting underlying computation streams shielding frontend timeouts dynamically!
    return NextResponse.json({ success: true, jobId })
    
  } catch (error) {
    console.error("Error creating job payload tracking:", error)
    return NextResponse.json({ error: "Failed to queue remote site generation limits correctly natively." }, { status: 500 })
  }
}
