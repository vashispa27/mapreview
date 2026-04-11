import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { isOfflineMode, mockSession } from "@/lib/offline-mode"
import { NextRequest } from "next/server"

// Create mock handlers for offline mode
const mockHandlers = {
  GET: async (request: NextRequest) => {
    // Return the mock session for session endpoint
    if (request.url.includes('/session')) {
      return Response.json(mockSession)
    }
    return Response.json({})
  },
  POST: async () => Response.json({})
}

const mockAuth = async () => mockSession
const mockSignIn = async () => {}
const mockSignOut = async () => {}

// In offline mode, export mock functions
// Otherwise, export real NextAuth functions
let handlers: typeof mockHandlers
let signIn: typeof mockSignIn
let signOut: typeof mockSignOut
let auth: typeof mockAuth

if (isOfflineMode) {
  handlers = mockHandlers
  signIn = mockSignIn
  signOut = mockSignOut
  auth = mockAuth
} else {
  // Only import db when not in offline mode to prevent DATABASE_URL errors
  const { db } = require("@/lib/db")
  
  const nextAuth = NextAuth({
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

  handlers = nextAuth.handlers
  signIn = nextAuth.signIn
  signOut = nextAuth.signOut
  auth = nextAuth.auth
}

export { handlers, signIn, signOut, auth }
