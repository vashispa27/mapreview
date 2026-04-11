import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
}

const connectionString = process.env.DATABASE_URL

// Create a lazy-initialized db client that only throws when actually used
function createDbClient(): PrismaClient {
  if (!connectionString) {
    // Return a proxy that throws on access - this allows the app to load
    // but will error if you actually try to use the database
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        // Allow some properties that might be checked during initialization
        if (prop === 'then' || prop === Symbol.toStringTag) {
          return undefined
        }
        throw new Error("DATABASE_URL is not defined. Please configure your database connection.")
      }
    })
  }

  // Optimized for Vercel Serverless + Supabase Pooler
  const pool = new Pool({ 
    connectionString,
    max: 1, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    // This handles the JS-side of the SSL connection
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  })

  const adapter = new PrismaPg(pool)

  return new PrismaClient({ 
    adapter,
    // In Prisma 7, we can also pass log options here if needed
  })
}

export const db = globalForPrisma.prisma || createDbClient()

if (process.env.NODE_ENV !== "production" && connectionString) {
  globalForPrisma.prisma = db
}

// Helper to check if database is configured
export function isDatabaseConfigured(): boolean {
  return !!connectionString
}
