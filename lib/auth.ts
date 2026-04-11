import { mockSession } from "@/lib/offline-mode"
import { NextRequest } from "next/server"

// Check offline mode directly here
const isOffline = process.env.NEXT_PUBLIC_OFFLINE_MODE === "true"

// Create mock handlers for offline mode
const mockHandlers = {
  GET: async (request: NextRequest) => {
    const url = request.url
    if (url.includes('/session')) {
      return Response.json(mockSession)
    }
    if (url.includes('/providers')) {
      return Response.json({})
    }
    if (url.includes('/csrf')) {
      return Response.json({ csrfToken: "offline-csrf-token" })
    }
    // Handle all other auth endpoints
    return Response.json({})
  },
  POST: async () => Response.json({ url: "/" })
}

const mockAuth = async () => mockSession
const mockSignIn = async () => ({ url: "/" })
const mockSignOut = async () => ({ url: "/" })

// Type for handlers
type HandlersType = typeof mockHandlers

// Lazy-loaded real NextAuth instance
let _realNextAuth: any = null

async function getRealNextAuth() {
  if (_realNextAuth) return _realNextAuth
  
  // Dynamic imports to avoid loading db/NextAuth in offline mode
  const NextAuth = (await import("next-auth")).default
  const Google = (await import("next-auth/providers/google")).default
  const { PrismaAdapter } = await import("@auth/prisma-adapter")
  const { db } = await import("@/lib/db")
  
  _realNextAuth = NextAuth({
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
      session({ session, user }: { session: any; user: any }) {
        if (session.user) {
          session.user.id = user.id
        }
        return session
      },
    },
  })
  
  return _realNextAuth
}

// Export handlers that work in both modes
export const handlers: HandlersType = isOffline 
  ? mockHandlers 
  : {
      GET: async (request: NextRequest) => {
        const nextAuth = await getRealNextAuth()
        return nextAuth.handlers.GET(request)
      },
      POST: async (request: NextRequest) => {
        const nextAuth = await getRealNextAuth()
        return nextAuth.handlers.POST(request)
      }
    }

export const auth = isOffline
  ? mockAuth
  : async () => {
      const nextAuth = await getRealNextAuth()
      return nextAuth.auth()
    }

export const signIn = isOffline
  ? mockSignIn
  : async (...args: any[]) => {
      const nextAuth = await getRealNextAuth()
      return nextAuth.signIn(...args)
    }

export const signOut = isOffline
  ? mockSignOut
  : async (...args: any[]) => {
      const nextAuth = await getRealNextAuth()
      return nextAuth.signOut(...args)
    }
