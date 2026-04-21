import { inngest } from "./client"
import { updateJob, getJob } from "@/lib/job-store"
import { createPreview } from "@/lib/preview-store"
import { parseScrapedData } from "@/lib/parser"
import { generateBusinessContent } from "@/lib/ai"
import { BusinessData, ServiceItem, TrainerItem } from "@/lib/mock-data"
import { db } from "@/lib/db"
import { sendSiteStatusEmail } from "@/lib/email"
import sampleData from "../../sample_scraped_data.json"

const GYM_KEYWORDS = ["gym", "fitness", "crossfit", "yoga", "pilates", "zumba", "martial arts", "boxing", "health club", "sports club", "aerobics", "strength", "personal trainer", "dance studio", "wellness center"]

function detectGym(categories: string[]): boolean {
  const combined = categories.join(" ").toLowerCase()
  return GYM_KEYWORDS.some((k) => combined.includes(k))
}

const GYM_TEMPLATE_SERVICES: ServiceItem[] = [
  {
    id: "gym-monthly",
    title: "Monthly Membership",
    price: "₹1,499 / month",
    description: "Full access to gym floor, all equipment, and cardio zone. Perfect for getting started on your fitness journey.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  },
  {
    id: "gym-quarterly",
    title: "Quarterly Plan",
    price: "₹3,999 / 3 months",
    description: "Save more with our 3-month plan. Includes full gym access plus group classes like yoga and Zumba.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  },
  {
    id: "gym-halfyearly",
    title: "Half-Yearly Plan",
    price: "₹6,999 / 6 months",
    description: "Our most popular plan. Full access, all group classes, and 2 complimentary personal training sessions.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  },
  {
    id: "gym-annual",
    title: "Annual Membership",
    price: "₹11,999 / year",
    description: "Best value. Unlimited access to everything — gym floor, all classes, and 12 personal training sessions included.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
  },
]

const GYM_TEMPLATE_TRAINERS: TrainerItem[] = [
  {
    id: "trainer-1",
    name: "Trainer Name",
    specialization: "Strength & Conditioning",
    experience: "5+ years experience",
    bio: "Certified personal trainer specializing in strength training and weight management. Tap to update details.",
    photo: undefined,
  },
  {
    id: "trainer-2",
    name: "Trainer Name",
    specialization: "Yoga & Flexibility",
    experience: "3+ years experience",
    bio: "Experienced yoga instructor focused on improving flexibility, posture, and mental wellness. Tap to update details.",
    photo: undefined,
  },
]

export const generateSiteJob = inngest.createFunction(
  {
    id: "generate-business-site",
    retries: 3,
    triggers: [{ event: "app/generate.site" }],
    // FAILURE HANDLER: This runs only after all 3 retries are exhausted.
    onFailure: async ({ event, error }) => {
      const jobId = event.data.event.data.jobId
      console.error(`❌ [${jobId}] INNGEST JOB FAILED PERMANENTLY:`, error)
      
      // 1. Update in-memory jobStore for immediate UI polling
      updateJob(jobId, { 
        status: "FAILED", 
        errorMessage: "Generation failed after multiple attempts. Please try again later." 
      })

      // 2. Update Prisma Database for persistence and notify user
      try {
        const site = await db.site.update({
          where: { id: jobId },
          data: { status: "FAILED" },
          include: { user: true }
        })

        // SEND FAILURE EMAIL
        if (site.user?.email) {
          await sendSiteStatusEmail(site.user.email, site.businessName || "Your Site", "FAILED")
        }
      } catch (e) {
        console.error("Failed to update database on failure:", e)
      }
    }
  },
  async ({ event, step }) => {
    const { url, jobId } = event.data
    const startTime = new Date().toISOString()
    console.log(`\n\n🟢 [${startTime}] INNGEST JOB STARTED: ${jobId}`)
    console.log(`🔗 Target URL: ${url}`)

    // Step 1: Scrape Google Maps via Apify (retryable — network errors)
    const apifyData = await step.run("scrape-google-maps", async () => {
      console.log(`\n▶️ [${jobId}] Step 1: Triggering Scraping Engine...`)
      
      // Update DB and Memory status
      updateJob(jobId, { status: "SCRAPING_APIFY" })
      await db.site.update({ where: { id: jobId }, data: { status: "SCRAPING_APIFY" } })

      const USE_MOCK_APIFY = process.env.USE_MOCK_APIFY === 'true'
      if (USE_MOCK_APIFY) {
        console.log(`🟡 [${jobId}] Mock Mode Active! Reusing sample_scraped_data.json`)
        await new Promise(resolve => setTimeout(resolve, 3000))
        return sampleData
      }

      console.log(`🚀 [${jobId}] Firing Apify SDK Request...`)
      const APIFY_TOKEN = process.env.APIFY_TOKEN
      if (!APIFY_TOKEN) throw new Error("Missing Apify Token configuration")

      const response = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: [{ url }],
          maxReviews: 50,
          reviewsSort: "newest",
          reviewsStartDate: "1 year",
          scrapeReviewsPersonalData: true,
          scrapePlaceDetailPage: true,
          language: "en"
        })
      })

      if (!response.ok) throw new Error('Failed connecting to Apify extraction endpoint')
      const payload = await response.json()
      if (!payload || payload.length === 0) throw new Error("Google location empty or inaccessible")
      return payload
    })

    // Parse scraped data — logical errors here should NOT retry
    const place = apifyData[0]
    let parsedData
    try {
      parsedData = parseScrapedData(place)
    } catch (err) {
      updateJob(jobId, { status: "FAILED", errorMessage: "error occurred in analysing your business, please contact the developer" })
      await db.site.update({ where: { id: jobId }, data: { status: "FAILED" } })
      console.error(`\n❌ [${jobId}] Fatal Parser Error — stopping retries.`, err)
      return { success: false }
    }

    const reviewsCount = parsedData.reviews?.length || 0
    console.log(`\n✅ [${jobId}] Step 1 Complete: Apify Data Returned`)
    console.log(`📍 Business Name: ${parsedData.businessInfo.title}`)
    console.log(`⭐ Rating: ${parsedData.businessInfo.rating}`)
    console.log(`💬 Reviews Scraped: ${reviewsCount}`)

    // Step 2: Save intermediate checkpoint (so Gemini retry doesn't re-scrape)
    await step.run("checkpoint-intermediate-state", async () => {
      updateJob(jobId, { status: "ANALYZING_GEMINI", intermediateData: parsedData })
      await db.site.update({ where: { id: jobId }, data: { status: "ANALYZING_GEMINI" } })
      console.log(`\n▶️ [${jobId}] Step 2: Intermediate Checkpoint saved`)
    })

    // Step 3: Gemini AI analysis (retryable — transient 503s)
    const aiData = await step.run("analyze-reviews", async () => {
      console.log(`\n▶️ [${jobId}] Step 3: Triggering Gemini 2.5 AI Analysis...`)
      const data = await generateBusinessContent(parsedData)
      if (!data) throw new Error("Gemini returned null — triggering Inngest retry")
      console.log(`\n✅ [${jobId}] Step 3 Complete: AI analysis ready`)
      return data
    })

    // Step 4: Map and publish (logical errors here should NOT retry)
    await step.run("publish-preview-site", async () => {
      try {
        console.log(`\n▶️ [${jobId}] Step 4: Mapping Business Dataset...`)
        const isGym = detectGym(parsedData.businessInfo.categories || [])

        const businessData: BusinessData = {
          id: btoa(url).slice(0, 12).replace(/[^a-zA-Z0-9]/g, "x"),
          name: parsedData.businessInfo.title || "Unknown Business",
          category: parsedData.businessInfo.categories?.[0] || "Business",
          rating: parseFloat(parsedData.businessInfo.rating) || 5.0,
          totalReviews: parseInt(parsedData.businessInfo.reviewsCount) || 0,
          address: parsedData.businessInfo.address || "",
          phone: parsedData.businessInfo.phone || "",
          website: parsedData.businessInfo.website || "",
          socials: {
            instagram: "",
            facebook: "",
            twitter: "",
          },
          pages: { services: true, products: !isGym, contact: true, trainers: isGym },
          services: isGym ? GYM_TEMPLATE_SERVICES : [],
          products: [],
          isGym,
          trainers: isGym ? GYM_TEMPLATE_TRAINERS : [],
          showTrainersSection: isGym,
          heroImage: parsedData.photos[0] || "/placeholder.jpg",
          hours: parsedData.businessInfo.openingHours
            ? parsedData.businessInfo.openingHours.map((h: any) => ({ day: h.day, hours: h.hours }))
            : [],
          photos: parsedData.photos.map((p: string) => ({ url: p, caption: "Gallery Image" })),
          availablePhotos: parsedData.availablePhotos.map((p: string) => ({ url: p, caption: "Gallery Image" })),
          reviews: parsedData.reviews.map((r: any, idx: number) => {
            let jtbd = "A great experience waiting for you"
            if (aiData?.reviews) {
              const match = aiData.reviews.find((aiRev: any) => aiRev.originalIndex === idx)
              if (match && match.jtbdHeader) jtbd = match.jtbdHeader
            }
            const reviewerName = r.name || "Anonymous User"
            return {
              author: reviewerName,
              avatar: r.avatar,
              rating: r.stars || 5,
              date: r.date || "Recent",
              text: r.text,
              jtbdHeader: jtbd
            }
          }),
          description: aiData?.description || (parsedData.businessInfo as any).description || "A highly rated business.",
          features: aiData?.features || ["Quality Service", "Great Atmosphere", "Friendly Staff", "Comfortable Settings"],
          priceLevel: "$$",
        }

          ; (businessData as any).analysis = aiData

        // Store the final business data to Prisma for persistence!
        const site = await db.site.update({
          where: { id: jobId },
          data: {
            status: "COMPLETED",
            businessName: businessData.name,
            businessData: businessData as any,
            config: {
              colorSchemeId: "default",
              layout: "modern",
              fontStyle: "sans",
              animations: true
            } as any
          },
          include: { user: true }
        })

        updateJob(jobId, { status: "COMPLETED" })

        // SEND SUCCESS EMAIL
        if (site.user?.email) {
          const liveUrl = `https://maptosite.app/site/${site.slug || site.id}`
          await sendSiteStatusEmail(site.user.email, businessData.name, "SUCCESS", liveUrl)
        }

        const endTime = new Date().toISOString()
        console.log(`\n\n🏁 [${endTime}] INNGEST JOB COMPLETED SUCCESSFULLY! (${jobId})`)
      } catch (err) {
        // Catch logical errors — don't retry, just inform the user
        updateJob(jobId, { status: "FAILED", errorMessage: "error occurred in analysing your business, please contact the developer" })
        await db.site.update({ where: { id: jobId }, data: { status: "FAILED" } })
        console.error(`\n❌ [${jobId}] Fatal Mapping Error (no retry):`, err)
      }
    })

    return { success: true, url }
  }
)
