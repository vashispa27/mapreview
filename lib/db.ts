import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
}

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

export const db = globalForPrisma.prisma || new PrismaClient({ 
  adapter,
  // In Prisma 7, we can also pass log options here if needed
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
