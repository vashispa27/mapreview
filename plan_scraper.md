# Part 2: Scraper and Sentiment Analysis

This part involves building the backend engine to extract data from a Google Maps link and analyze it to power the brochure. Since the official API limits reviews to 5, this component focuses on custom data extraction and intelligence.

## Proposed Architecture
- **Data Scraping Engine**: 
  - Approach: Use a headless browser (Puppeteer/Playwright) to navigate to the Google Maps link, parse the HTML, and extract more than 5 reviews, photos, business name, address, rating, and hours. Alternatively, use a managed scraping API (like Apify or Outscraper) to avoid blocking.
- **Sentiment Analysis**:
  - Once the reviews are scraped, pass the text data through an LLM (e.g., Google Gemini or OpenAI) to perform sentiment analysis.
  - Categorize reviews into "Highlights" (Positive) and "Constructive Feedback" / "Room for Improvement" (Negative), or extract key themes (e.g., "Great food," "Slow service").

## Architecture & Integration
- The scraper will run as an API route in Next.js or a separate background worker depending on timeouts. Since scraping can take time, we may need a loading/polling state on the frontend.

## Task Checklist
- `[ ]` 
- `[ ]` 
- `[ ]` 
