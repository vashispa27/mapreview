import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { sendWelcomeEmail } from "@/lib/email"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@maptosite.app"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ["none"],
    }),
    Credentials({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email !== ADMIN_EMAIL ||
          credentials?.password !== ADMIN_PASSWORD
        ) return null

        // Upsert the admin user with pro plan
        const user = await db.user.upsert({
          where: { email: ADMIN_EMAIL },
          update: {
            plan: "pro",
            planExpiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
          },
          create: {
            email: ADMIN_EMAIL,
            name: "Admin",
            plan: "pro",
            planExpiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
          },
        })

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        // For credentials login, fetch plan from DB
        if (account?.provider === "admin-credentials") {
          const dbUser = await db.user.findUnique({ where: { id: user.id as string } })
          token.plan = dbUser?.plan ?? "pro"
          token.planExpiresAt = dbUser?.planExpiresAt ?? null
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        // For JWT sessions (credentials), read from token
        if (token.plan) {
          session.user.plan = token.plan as string
          session.user.planExpiresAt = token.planExpiresAt as Date | null
        } else {
          // For database sessions (OAuth), fetch from DB
          const dbUser = await db.user.findUnique({ where: { id: token.id as string } })
          session.user.plan = dbUser?.plan ?? "free"
          session.user.planExpiresAt = dbUser?.planExpiresAt ?? null
        }
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email && user.email !== ADMIN_EMAIL) {
        await sendWelcomeEmail(user.email, user.name || "").catch((err) =>
          console.error("Welcome email failed:", err)
        )
      }
    },
  },
})
