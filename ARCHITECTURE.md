# Map2Site: Architecture & Economics Overview

## 1. High-Level Pipeline Architecture
The system executes a wholly decoupled, Serverless Event-Driven workflow designed to completely abstract scraping latency and LLM unreliability from the frontend user experience.

### A. The Frontend Abstraction (Radar Skeletons)
1. **Trigger**: When a Google Maps URL is submitted, the backend immediately replies with an empty `{ jobId: "123" }` ticket and disconnects, preventing Vercel Function Timeouts.
2. **Skeleton Polling**: The user is navigated to `/preview/123`. A grey loading Skeleton dynamically renders identical CSS properties of the final Website template.
3. **Ghosting Mechanisms**: The interface strictly shows *"Building your page..."* to obscure backend crashes. It continuously sends silent polling `GET` requests every 2000 milliseconds to `/api/preview/123` until a `COMPLETED` flag is triggered.

### B. The Durable Event Queue (Inngest Worker)
1. **Job Dispatch**: When the Job Ticket is created, Vercel fires an event payload into the **Inngest Serverless Engine**. 
2. **Phase 1 (Apify)**: Inngest invokes the Vercel backend to scrape Apify. If the scraper times out, Inngest detects the 500 error, waits, and automatically retries *just this step*. Data is explicitly persisted to an intermediate state.
3. **Phase 2 (Gemini)**: If LLM analysis mathematically crashes due to API overloads, Inngest initiates Exponential Backoff retries strictly on the Gemini invocation function, pulling the previously cached Apify data, protecting us from redundant scraping costs.
4. **Resolution**: Data is mapped to `BusinessData`, cached, and marked as `COMPLETED`. Next React pulse grabs the updated UI.

---

## 2. Unit Economics & Cost Analysis
Designed to operate highly cost-efficiently using Serverless compute allocations. Based on an arbitrary baseline model of **1,000 generated sites per month**, with approximately **500,000 native site views**.

### Fixed Infrastructure Pipeline Costs
- **Vercel Pro Account**: ~$20.00 / month
  *(Supports entirely the decoupled event functions minimizing Compute-GB hours natively underneath standard limits)*
- **Database (Upstash Redis / Vercel KV)**: ~$0.00 / month 
  *(State mappings fall completely under free tiers limiting tiny string checkpoints)*

### Variable AI & Scraping Operational Matrix
- **Inngest Engine**: ~$0.00 / month 
  *(The generous 500,000 monthly event capacity supports zero fractional expense).*
- **Apify Crawler**: ~$5.00 / 1,000 Sites 
  *($5 flat per 1000 Google Map payload queries)*
- **Gemini 2.5 Flash**: ~$0.50 / 1,000 Sites 
  *(Assuming 4M Total Pipeline Tokens combined Input & Output processing at $0.075 scaling rules)*

### Variable Delivery Margin Costs
- **Web App Compute Generation (SSR/ISR)**: Virtually $0.00. 
  *(The site template operates via SSG cached pages leveraging Vercel Edge networks after exactly one compilation run).*
- **Inbound Site Bandwidth**: $0.00. 
  *(Vercel Pro contains 1,000 GB native data payload capacity standard, supporting easily over 500,000 static site visitor engagements).*

**Unit Benchmark**: $0.0055 (Roughly 1/2 of one Penny USD per globally generated Website).
