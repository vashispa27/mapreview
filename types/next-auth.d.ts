import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      plan: string           // "free" | "base" | "pro"
      planExpiresAt: string | null
    } & DefaultSession["user"]
  }
}
