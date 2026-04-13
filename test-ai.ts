import "dotenv/config"
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"

/**
 * Standalone test script to verify Gemini fallback logic
 * Usage: npx tsx test-ai.ts
 */

async function testAiFallback() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY not found in environment variables.")
    return
  }

  const genAI = new GoogleGenerativeAI(apiKey)

  // Mock data representing what the scraper would provide
  const parsedData = {
    businessInfo: {
      name: "Paris Panini - Gourmet Sandwiches & Wraps",
      description: "Authentic French street food in the heart of the city."
    },
    reviews: [
      { text: "The paninis here are amazing! Best I've had outside France." },
      { text: "Love the vibe of this place. Very cozy and welcoming." },
      { text: "Quick service and great quality. Highly recommended." },
      { text: "A bit pricey but worth every penny for the taste." },
      { text: "The hot chocolate is to die for. Perfect for a rainy day." }
    ]
  }

  const topReviews = parsedData.reviews.slice(0, 30)

  const prompt = `
You are an expert Jobs-To-Be-Done marketing copywriter. We have scraped data from Google Maps for "${parsedData.businessInfo.name || "the business"}".
Your task is to generate marketing copy strictly following these rules:

1. About Us (description): Enhance the existing description if it exists, or create a nice-sounding, compelling summary. Never include negative sentiments.
2. What We Offer (features): Return EXACTLY 4 short feature strings. 
   - The first two MUST describe core jobs/offerings.
   - The last two MUST be derived from positive ambient/experiential things users said in reviews.
3. Customer Reviews (jtbdHeader): For each review provided below, generate a short Jobs-To-Be-Done header that the review proves.

Original Description: ${parsedData.businessInfo.description || "Not provided."}
Reviews to Analyze:
${topReviews.map((r: any, idx: number) => `[ID: ${idx}] ${r.text}`).join("\n\n")}`;

  const modelsToTry = [
    "gemini-flash-latest"
  ]

  let lastError = null

  console.log("🚀 Starting AI Fallback Test...")

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Attempting generation with model: ${modelName}...`)
      
      const model = genAI.getGenerativeModel({ model: modelName })
      
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              description: { type: SchemaType.STRING },
              features: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description: "Exactly 4 strings."
              },
              reviews: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    originalIndex: { type: SchemaType.NUMBER },
                    jtbdHeader: { type: SchemaType.STRING }
                  },
                  required: ["originalIndex", "jtbdHeader"]
                }
              }
            },
            required: ["description", "features", "reviews"]
          }
        }
      })

      const resultText = response.response.text()
      if (!resultText) {
        console.warn(`⚠️ Model ${modelName} returned empty text.`)
        continue 
      }

      console.log(`✅ Success with ${modelName}!`)
      console.log("\n--- GENERATED PAYLOAD ---")
      console.log(JSON.stringify(JSON.parse(resultText), null, 2))
      return

    } catch (err: any) {
      lastError = err
      console.warn(`⚠️ Model ${modelName} failed or throttled.`)
      console.warn(`   Error: ${err.message || "Unknown"}`)
      
      if (err.message?.includes("SAFETY")) {
        console.error("❌ Generation blocked by Safety Filters")
        break
      }
    }
  }

  console.error("\n💥 All Gemini models failed to generate payload.")
  if (lastError) {
    console.error("Final Error Message:", lastError.message)
  }
}

testAiFallback()
