import { NextRequest, NextResponse } from "next/server"
import { createPreview } from "@/lib/preview-store"
import { parseScrapedData } from "@/lib/parser"
import { analyzeReviewsJTBD } from "@/lib/llm"
import { BusinessData } from "@/lib/mock-data"
import sampleData from "../../../sample_scraped_data.json"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    if (!url.includes("google.com/maps") && !url.includes("goo.gl") && !url.includes("maps.app")) {
      return NextResponse.json({ error: "Please provide a valid Google Maps URL" }, { status: 400 })
    }

    const USE_MOCK_APIFY = process.env.USE_MOCK_APIFY === 'true';
    let apifyData: any;

    if (USE_MOCK_APIFY) {
      console.log(`🟡 MOCK MODE ACTIVE: Skipping Apify fetch and using local sample_scraped_data.json`);
      // Simulate standard network latency for the UI logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      apifyData = sampleData;
    } else {
      const APIFY_TOKEN = process.env.APIFY_TOKEN;
      if (!APIFY_TOKEN) {
        return NextResponse.json({ error: "Server missing Apify token. Cannot scrape live data." }, { status: 500 });
      }

      console.log(`🚀 TRIGGERING REAL APIFY SCRAPER for: ${url}`);
      // 1. Scrape Apify
      const response = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: [{ url }],
          maxReviews: 50,
          reviewsSort: "newest",           
          reviewsStartDate: "1 year",      
          scrapeReviewsPersonalData: false, 
          scrapePlaceDetailPage: true,     
          language: "en"
        })
      });

      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to scrape live data from Google Maps' }, { status: 502 });
      }

      apifyData = await response.json();
    }
    if (!apifyData || apifyData.length === 0) {
      return NextResponse.json({ error: 'No data returned for this URL' }, { status: 404 });
    }

    const place = apifyData[0];

    // 2. Parser & LLM
    const parsedData = parseScrapedData(place);
    const jtbdAnalysis = await analyzeReviewsJTBD(parsedData.reviews);

    // 3. Adapter Layer (Map to V3 BusinessData schema)
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
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        twitter: "https://twitter.com"
      },
      heroImage: parsedData.photos[0] || "/placeholder.jpg",
      hours: parsedData.businessInfo.openingHours ? 
        parsedData.businessInfo.openingHours.map((h: any) => ({ day: h.day, hours: h.hours })) : [],
      photos: parsedData.photos.map((p: string) => ({ url: p, caption: "Gallery Image" })),
      availablePhotos: parsedData.availablePhotos.map((p: string) => ({ url: p, caption: "Gallery Image" })),
      reviews: parsedData.reviews.map((r: any) => ({
        author: r.name,
        avatar: `https://i.pravatar.cc/150?u=${r.name.replace(/\\s/g, '')}`,
        rating: r.rating || r.stars || 5, // fallback
        date: r.publishedAtDate || "Recent",
        text: r.text
      })),
      description: jtbdAnalysis.overallVibe || "A highly rated business on Google Maps.",
      features: jtbdAnalysis.jobsToBeDone ? jtbdAnalysis.jobsToBeDone.map((j: string | any) => typeof j === 'string' ? j : j.job) : [],
      priceLevel: "$$",
    };

    // Cast and append AI analysis to be used freely in site customizer UI
    (businessData as any).analysis = jtbdAnalysis;

    // 4. Create a preview session in memory
    const previewId = createPreview(businessData)

    return NextResponse.json({
      success: true,
      previewId,
      business: businessData,
    })
  } catch (error) {
    console.error("Error generating site:", error)
    return NextResponse.json({ error: "Failed to generate site" }, { status: 500 })
  }
}
