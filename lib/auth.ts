import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { sendWelcomeEmail } from "@/lib/email"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ["none"], // Disables PKCE/State checks to prevent the 'pkceCodeVerifier' error in some environments
    }),
  ],
  callbacks: {
    // Expose user ID, plan, and planExpiresAt on the session
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.plan = (user as any).plan ?? "free"
        session.user.planExpiresAt = (user as any).planExpiresAt ?? null
      }
      return session
    },
  },
  events: {
    // Fire welcome email the first time a user account is created
    async createUser({ user }) {
      if (user.email) {
        await sendWelcomeEmail(user.email, user.name || "").catch((err) =>
          console.error("Welcome email failed:", err)
        )
      }
    },
  },
})
