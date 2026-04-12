/**
 * Standalone test script for Apify Scraper
 * Usage: 
 * 1. Set your APIFY_TOKEN in .env or as an environment variable
 * 2. Run: npx tsx test-apify.ts
 */

import "dotenv/config"

async function testApify() {
  const APIFY_TOKEN = process.env.APIFY_TOKEN
  const TEST_URL = "https://www.google.com/maps/place/Alka's+The+Nail+Bar/@12.9614549,77.7108679,15z/data=!4m6!3m5!1s0x3bae136ea2ade5af:0x2a37d3dd75008223!8m2!3d12.967417!4d77.7150185!16s%2Fg%2F11s4dymtzq?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
  if (!APIFY_TOKEN) {
    console.error("❌ Error: APIFY_TOKEN not found in environment variables.")
    return
  }

  console.log(`🚀 Testing Apify with URL: ${TEST_URL}`)
  console.log(`🔑 Using Token: ${APIFY_TOKEN.slice(0, 5)}...`)

  try {
    const response = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startUrls: [{ url: TEST_URL }],
        maxReviews: 5,
        reviewsSort: "newest",
        scrapeReviewsPersonalData: false,
        scrapePlaceDetailPage: true,
        language: "en"
      })
    })

    console.log(`📡 Response Status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Apify Request Failed:`)
      console.error(errorText)
      return
    }

    const data = await response.json()
    console.log(`✅ Success! Received data for: ${data[0]?.title || "Unknown Place"}`)
    console.log(`📊 Scraped ${data.length} items from the dataset.`)
    
    if (data.length > 0) {
      console.log("\nPreview of first item:")
      console.log(JSON.stringify({
        title: data[0].title,
        address: data[0].address,
        rating: data[0].totalScore,
        reviews: data[0].reviewsCount
      }, null, 2))
    }

  } catch (error) {
    console.error("💥 System Error during fetch:")
    console.error(error)
  }
}

testApify()
