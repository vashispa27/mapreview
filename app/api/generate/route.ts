import { NextResponse } from 'next/server';
import { parseScrapedData } from '../../../lib/parser';
import { analyzeReviewsJTBD } from '../../../lib/llm';
import sampleData from '../../../sample_scraped_data.json';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'Google Maps URL is required' }, { status: 400 });
    }

    const USE_MOCK_APIFY = process.env.USE_MOCK_APIFY === 'true';
    let data : any;

    if (USE_MOCK_APIFY) {
      console.log(`🟡 MOCK MODE ACTIVE: Skipping Apify fetch and loading local sample_scraped_data.json`);
      // Simulate standard network latency for the UI skeleton loader
      await new Promise(resolve => setTimeout(resolve, 2000));
      data = sampleData;
    } else {
      const APIFY_TOKEN = process.env.APIFY_TOKEN;
      if (!APIFY_TOKEN) {
        return NextResponse.json({ error: 'Server misconfiguration: Apify token missing' }, { status: 500 });
      }

      console.log(`🚀 Triggering REAL Apify Scraper for: ${url}`);

      // Call Apify Synchronously
      const response = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        const errorText = await response.text();
        console.error("❌ Apify Error:", errorText);
        return NextResponse.json({ error: 'Failed to scrape data from Google Maps' }, { status: 502 });
      }

      data = await response.json();
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No data returned for this URL' }, { status: 404 });
    }

    const place = data[0];
    console.log(`✅ Successfully extracted data from Apify for: ${place.title}.`);

    // 1. Clean and transform the chaotic Apify data
    const parsedData = parseScrapedData(place);

    // 2. Send the stripped-down reviews to the LLM for JTBD Sentiment Parsing
    const jtbdAnalysis = await analyzeReviewsJTBD(parsedData.reviews);

    // 3. Assemble the final Master Brochure Payload
    const finalBrochurePayload = {
      ...parsedData.businessInfo,
      photos: parsedData.photos,
      analysis: jtbdAnalysis
    };

    return NextResponse.json({
        success: true,
        data: finalBrochurePayload
    });

  } catch (error: any) {
    console.error("❌ API Route Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
