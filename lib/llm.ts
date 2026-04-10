import { formatReviewsForLLM } from './parser';

export interface JTBDAnalysis {
  overallVibe: string;
  jobsToBeDone: string[];
  highlightQuotes: { quote: string; author: string }[];
  constructiveFeedback: string;
}

/**
 * MOCK LLM WRAPPER
 * Takes the raw parsed reviews, formats them for the LLM, and asks the LLM to 
 * analyze the Jobs-to-be-Done (JTBD), sentiment, and extract top quotes.
 * Returns a strict JSON structure.
 */
export async function analyzeReviewsJTBD(reviews: any[]): Promise<JTBDAnalysis> {
  // In a real scenario, this reduces the array into a compressed text blob to save tokens
  const formattedPromptText = formatReviewsForLLM(reviews);
  
  console.log(`🤖 LLM Mock is analyzing ${reviews.length} reviews for JTBD insights...`);
  
  // Simulate network latency for the LLM generating the response (2.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 2500));

  // MOCKED RESPONSE
  // In production, we will use OpenAI Structured Outputs or Gemini JSON Schema
  // to force the LLM to return exactly this format, ensuring the UI never breaks.
  return {
    overallVibe: "A trendy, vibrant spot that expertly balances casual dining with premium, gourmet flavors.",
    jobsToBeDone: [
      "Hire this place for a memorable, low-stress lunch date.",
      "Hire this place when you are craving quick street-food vibes but with massive flavor upgrades."
    ],
    highlightQuotes: [
      {
        quote: "Honestly the best sandwich I've had in the city. The jalapeno cheese poppers are life-changing.",
        author: "Recent Customer"
      },
      {
        quote: "I drive 45 minutes every weekend just to grab their Salted Caramel Crepe.",
        author: "Local Guide"
      },
      {
        quote: "Incredible vibe and outdoor seating. The staff takes their time to make sure everything is perfect.",
        author: "Verified Reviewer"
      }
    ],
    constructiveFeedback: "During peak lunch hours (1 PM - 2 PM), wait times can extend up to 30 minutes, and parking in the immediate vicinity is occasionally chaotic."
  };
}
