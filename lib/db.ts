import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { isOfflineMode } from '@/lib/offline-mode'

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
}

// Create db connection only if not in offline mode
let db: PrismaClient

if (isOfflineMode) {
  // In offline mode, create a mock Prisma client
  // API routes check isOfflineMode and return mock data before hitting db
  db = {} as PrismaClient
} else {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined")
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

  db = globalForPrisma.prisma || new PrismaClient({ 
    adapter,
  })

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
}

export { db }
