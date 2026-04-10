export type JobStatus = "QUEUED" | "SCRAPING_APIFY" | "ANALYZING_GEMINI" | "COMPLETED" | "FAILED"

export interface Job {
  id: string
  url: string
  status: JobStatus
  errorMessage?: string
  intermediateData?: any
}

const globalForJobs = globalThis as unknown as {
  jobStore: Map<string, Job>
}

// Persist the map across hot-reloads dynamically
if (!globalForJobs.jobStore) {
  globalForJobs.jobStore = new Map()
}

export const jobStore = globalForJobs.jobStore

export function createJob(url: string, forceId?: string): string {
  const id = forceId || Math.random().toString(36).substring(2, 12)
  jobStore.set(id, { id, url, status: "QUEUED" })
  return id
}

export function getJob(id: string): Job | undefined {
  return jobStore.get(id)
}

export function updateJob(id: string, updates: Partial<Job>) {
  const job = jobStore.get(id)
  if (job) {
    jobStore.set(id, { ...job, ...updates })
  }
}
