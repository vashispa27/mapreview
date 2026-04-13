import { GoogleGenAI, Type } from "@google/genai"

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

  const ai = new GoogleGenAI({ apiKey })
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

  // MODELS TO TRY IN ORDER
  // Note: Using standard IDs as '3' and '2.5' are not yet public strings
  const modelsToTry = [
    "gemini-2.0-flash", 
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b"
  ]

  let lastError = null

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Attempting generation with model: ${modelName}...`)
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              features: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 strings."
              },
              reviews: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    originalIndex: { type: Type.INTEGER },
                    jtbdHeader: { type: Type.STRING }
                  },
                  required: ["originalIndex", "jtbdHeader"]
                }
              }
            },
            required: ["description", "features", "reviews"]
          }
        }
      })

      const resultText = response.text
      if (!resultText) continue

      console.log(`✅ Success with ${modelName}`)
      return JSON.parse(resultText)

    } catch (err: any) {
      lastError = err
      console.warn(`⚠️ Model ${modelName} failed or throttled. Error: ${err.message || "Unknown"}`)
      
      if (err.message?.includes("SAFETY")) {
        console.error("❌ Generation blocked by Safety Filters")
        break
      }
    }
  }

  console.error("💥 All Gemini models failed to generate payload:", lastError)
  return null
}
