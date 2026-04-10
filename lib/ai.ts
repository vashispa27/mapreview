import { GoogleGenAI, Type } from "@google/genai"

export async function generateBusinessContent(parsedData: any) {
  const apiKey = process.env.GEMINI_API_KEY

  // If the user hasn't mounted their API key, we fail gracefully 
  // so the site generation doesn't completely crash for local testing.
  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found! Returning fallback analysis.")
    return null
  }

  const ai = new GoogleGenAI({ apiKey })

  // Slice to 30 to avoid overwhelming output token limits while getting enough mass.
  const topReviews = parsedData.reviews.slice(0, 30)

  const prompt = `
You are an expert Jobs-To-Be-Done marketing copywriter. We have scraped data from Google Maps for "${parsedData.businessInfo.name || "the business"}".
Your task is to generate marketing copy strictly following these rules:

1. About Us (description): Enhance the existing description if it exists, or create a nice-sounding, compelling summary. Never include negative sentiments.
2. What We Offer (features): Return EXACTLY 4 short feature strings. 
   - The first two MUST describe core jobs/offerings (e.g., in case of restaurants the food they offer, and in case of other businesses what they offer).
   - The last two MUST be derived from positive ambient/experiential things users said in reviews (e.g., "Cozy Lighting", "Friendly Staff"). 
   - Never have any negative reviews or statements.
3. Customer Reviews (jtbdHeader): For each review provided below, generate a short Jobs-To-Be-Done header that the review proves. For example, "Find the best experience for your family". Ensure there are no negative statements.

Original Description: ${(parsedData.businessInfo as any)?.description || "Not provided."}
Reviews to Analyze:
${topReviews.map((r: any, idx: number) => `[ID: ${idx}] ${r.text}`).join("\n\n")}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
    if (!resultText) return null
    console.log("response from AI")
    console.log(response)

    return JSON.parse(resultText)
  } catch (err) {
    console.error("Gemini AI failed to generate payload:", err)
    return null
  }
}
