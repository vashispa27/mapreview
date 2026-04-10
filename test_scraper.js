const fs = require('fs');

// We grab the Apify token from an environment variable, or you can paste it directly below
const APIFY_TOKEN = process.env.APIFY_TOKEN || 'apify_api_zlzswZo4PsuPuyhyzoL5GGXPyFKylv3DnsAV';

// The URL is passed as a command-line argument
const targetUrl = "https://www.google.com/maps/place/Paris+Panini+-+Gourmet+Sandwiches+%26+Wraps,+Whitefield/@12.9569785,77.7297516,17z/data=!3m2!4b1!5s0x3bae12122042474b:0x724d8a10c415a16!4m6!3m5!1s0x3bae132871b95849:0x411c436497cb5801!8m2!3d12.9569785!4d77.7323265!16s%2F";

if (!targetUrl) {
  console.error("❌ Please provide a Google Maps URL as an argument.");
  console.error("Usage: node test_scraper.js \"https://www.google.com/maps/...\"");
  process.exit(1);
}

if (APIFY_TOKEN === 'YOUR_APIFY_TOKEN_HERE') {
  console.error("❌ Please replace 'YOUR_APIFY_TOKEN_HERE' with your actual Apify API Token in the script, or set the APIFY_TOKEN environment variable.");
  process.exit(1);
}

async function testScraper() {
  console.log(`\n🚀 Starting scraper for: ${targetUrl}`);
  console.log("⚙️  Configured to fetch up to 50 reviews from the past 1 year...");

  try {
    const response = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Here is our specific configuration
      body: JSON.stringify({
        startUrls: [{ url: targetUrl }],
        maxReviews: 50,
        reviewsSort: "newest",           // REQUIRED when using date filtering
        reviewsStartDate: "1 year",      // Only grab reviews from the last year
        scrapeReviewsPersonalData: false, // Get reviewer name & photo
        scrapePlaceDetailPage: true,     // Mandatory to access the reviews tab
        language: "en"
      })
    });

    if (!response.ok) {
      console.error("❌ API Request failed!");
      const errorText = await response.text();
      console.error(errorText);
      return;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const place = data[0];
      console.log("\n✅ Scraping Successful!");
      console.log(`-------------------------------------------------`);
      console.log(`🏢 Business Name: ${place.title}`);
      console.log(`⭐ Rating: ${place.totalScore} / 5 (Based on ${place.reviewsCount} total reviews)`);
      console.log(`💬 Reviews Extracted: ${place.reviews ? place.reviews.length : 0} (Matching criteria)`);

      if (place.reviews && place.reviews.length > 0) {
        console.log(`\nHere is a sample of the most recent review:`);
        console.log(`👤 Reviewer: ${place.reviews[0].name}`);
        console.log(`✨ Stars: ${place.reviews[0].stars}`);
        console.log(`📝 Text: "${place.reviews[0].text}"`);
        console.log(`📅 Date: ${place.reviews[0].publishedAtDate}`);
      }

      // Save the full JSON structure to a file so we can inspect everything it returns
      fs.writeFileSync('sample_scraped_data.json', JSON.stringify(data, null, 2));
      console.log(`\n💾 Full JSON payload saved to: sample_scraped_data.json`);
      console.log(`Check this file to see all the data points we can use to build the brochure!`);
    } else {
      console.log("⚠️ No data returned by the scraper. Check the URL.");
    }

  } catch (error) {
    console.error("❌ An error occurred while fetching:", error);
  }
}

testScraper();
