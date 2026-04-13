import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"

/**
 * AI Content Generator with Fallback Logic
 * Tries models in order of preference to handle 503 (Throttling) and 429 (Rate Limits)
 */
export async function generateBusinessContent(parsedData: any) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found! Returning fallback analysis.")
    return null
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const topReviews = parsedData.reviews.slice(0, 30)

  const prompt = `
You are an expert Jobs-To-Be-Done marketing copywriter. We have scraped data from Google Maps for "${parsedData.businessInfo.name || "the business"}".
Your task is to generate marketing copy strictly following these rules:

1. About Us (description): Enhance the existing description if it exists, or create a nice-sounding, compelling summary. Never include negative sentiments.
2. What We Offer (features): Return EXACTLY 4 short feature strings. 
   - The first two MUST describe core jobs/offerings.
   - The last two MUST be derived from positive ambient/experiential things users said in reviews.
3. Customer Reviews (jtbdHeader): For each review provided below, generate a short Jobs-To-Be-Done header that the review proves.

Original Description: ${(parsedData.businessInfo as any)?.description || "Not provided."}
Reviews to Analyze:
${topReviews.map((r: any, idx: number) => `[ID: ${idx}] ${r.text}`).join("\n\n")}`;

  // MODELS TO TRY IN ORDER (High Performance -> Fast Fallback -> Lite Fallback)
  // Note: Updated names to match current Google AI Studio stable IDs
  const modelsToTry = [
    "gemini-2.0-flash", 
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b"
  ]

  let lastError = null

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
      if (!resultText) continue // Try next model if empty

      console.log(`✅ Success with ${modelName}`)
      return JSON.parse(resultText)

    } catch (err: any) {
      lastError = err
      console.warn(`⚠️ Model ${modelName} failed or throttled. Error: ${err.message || "Unknown"}`)
      
      // If it's a "Safety" block, don't fallback, just fail (it will likely fail on all models)
      if (err.message?.includes("SAFETY")) {
        console.error("❌ Generation blocked by Safety Filters")
        break
      }
      
      // Continue to next model in the loop...
    }
  }

  console.error("💥 All Gemini models failed to generate payload:", lastError)
  return null
}
