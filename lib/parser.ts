/**
 * Parses the massive JSON from Apify into a clean, strictly typed structure
 * designed specifically for our UI and LLM.
 */

export function parseScrapedData(placeData: any) {
  // 1. Core Business Information
  const businessInfo = {
    title: placeData.title || '',
    rating: placeData.totalScore || null,
    reviewsCount: placeData.reviewsCount || 0,
    address: placeData.address || '',
    website: placeData.website || '',
    phone: placeData.phone || '',
    categories: placeData.categories || [],
    openingHours: placeData.openingHours || [],
  };

  // 2. Photos Aggregation
  // We use a Set to automatically prevent duplicate images
  const photos = new Set<string>();
  
  if (placeData.imageUrl) {
    photos.add(placeData.imageUrl);
  }
  
  // A. Grab high-quality promotional photos from the owner's Google Maps posts
  if (placeData.ownerUpdates && Array.isArray(placeData.ownerUpdates)) {
    placeData.ownerUpdates.forEach((update: any) => {
      if (update.imageUrl) photos.add(update.imageUrl);
    });
  }

  // B. Grab photos attached to customer reviews
  if (placeData.reviews && Array.isArray(placeData.reviews)) {
    placeData.reviews.forEach((review: any) => {
      if (review.reviewImageUrls && Array.isArray(review.reviewImageUrls)) {
        review.reviewImageUrls.forEach((url: string) => photos.add(url));
      }
    });
  }

  // C. Fallback for raw image arrays (if maxImages was enabled in Apify payload)
  if (placeData.imageUrls && Array.isArray(placeData.imageUrls)) {
    placeData.imageUrls.forEach((url: string) => photos.add(url));
  }

  // 3. Review Extraction
  // We strip away unnecessary metadata (like reviewer IDs) to minimize the payload 
  // and dramatically reduce LLM token costs.
  const reviews = (placeData.reviews || [])
    .filter((r: any) => r.text && r.text.trim().length > 0) // Only keep reviews with text
    .map((review: any) => ({
      name: review.name,
      stars: review.stars,
      text: review.text,
      publishAt: review.publishAt,
      date: review.publishedAtDate,
      likes: review.likesCount || 0
    }));

  return {
    businessInfo,
    photos: Array.from(photos).slice(0, 4),
    availablePhotos: Array.from(photos).slice(0, 15),
    reviews
  };
}

/**
 * Utility function to convert the cleaned reviews into a highly compressed 
 * text format so the LLM can parse it without burning excess tokens.
 */
export function formatReviewsForLLM(reviews: any[]) {
  // Reduces the JSON array into a clean string block:
  // [Rating: 5/5] "This place is amazing..."
  return reviews.map(r => `[Rating: ${r.stars}/5] ${r.text}`).join('\n\n');
}
