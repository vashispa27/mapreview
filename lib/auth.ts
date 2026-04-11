import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Check if database is configured
const isDatabaseConfigured = !!process.env.DATABASE_URL

// Create the appropriate NextAuth configuration
let authInstance: ReturnType<typeof NextAuth> | null = null

async function getAuthInstance() {
  if (authInstance) return authInstance

  if (isDatabaseConfigured) {
    // Database is configured, use Prisma adapter
    const { PrismaAdapter } = await import("@auth/prisma-adapter")
    const { db } = await import("@/lib/db")
    
    authInstance = NextAuth({
      adapter: PrismaAdapter(db),
      secret: process.env.AUTH_SECRET,
      providers: [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          checks: ["none"],
        }),
      ],
      callbacks: {
        session({ session, user }) {
          if (session.user) {
            session.user.id = user.id
          }
          return session
        },
      },
    })
  } else {
    // No database, use JWT-based session
    authInstance = NextAuth({
      secret: process.env.AUTH_SECRET || "development-secret-not-for-production",
      providers: [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
          checks: ["none"],
        }),
      ],
      session: {
        strategy: "jwt",
      },
      callbacks: {
        session({ session, token }) {
          if (session.user && token.sub) {
            session.user.id = token.sub
          }
          return session
        },
      },
    })
  }

  return authInstance
}

// Export the auth functions - they'll resolve to the correct implementation
export const handlers = {
  GET: async (req: Request) => {
    const instance = await getAuthInstance()
    return instance.handlers.GET(req)
  },
  POST: async (req: Request) => {
    const instance = await getAuthInstance()
    return instance.handlers.POST(req)
  },
}

export const signIn = async (...args: any[]) => {
  const instance = await getAuthInstance()
  return instance.signIn(...args)
}

export const signOut = async (...args: any[]) => {
  const instance = await getAuthInstance()
  return instance.signOut(...args)
}

export const auth = async () => {
  const instance = await getAuthInstance()
  return instance.auth()
}
