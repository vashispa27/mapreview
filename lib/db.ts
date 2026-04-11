import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check offline mode directly - no imports to avoid module load issues
const isOffline = process.env.NEXT_PUBLIC_OFFLINE_MODE === "true"

// Lazy-initialized database client
let _db: PrismaClient | null = null

function getDb(): PrismaClient {
  if (isOffline) {
    return {} as PrismaClient
  }

  if (_db) return _db
  if (globalForPrisma.prisma) {
    _db = globalForPrisma.prisma
    return _db
  }

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined")
  }

  const pool = new Pool({
    connectionString,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  })

  const adapter = new PrismaPg(pool)
  const client = new PrismaClient({ adapter })

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client
  }

  _db = client
  return _db
}

// Export a proxy that lazily initializes the db on first access
// This prevents the error from being thrown at module load time
export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (isOffline) {
      // Return a no-op for offline mode
      return () => Promise.resolve(null)
    }
    const client = getDb()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})
