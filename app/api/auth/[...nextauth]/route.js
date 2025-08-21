// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"
import { sql } from "@/lib/dbConfig"

// Основні налаштування NextAuth
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { scope: "openid email profile" } },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials
        const users = await sql`SELECT * FROM users WHERE email = ${email}`
        const user = users[0]
        if (!user) throw new Error("No user")
        const valid = await bcryptjs.compare(password, user.password_hash)
        if (!valid) throw new Error("Invalid password")
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    // Викликається після логіну
    async signIn({ user, account, profile }) {
      console.log("signIn callback:", { user, account, profile })

      if (!user.email) return false

      try {
        const [existingUser] = await sql`SELECT * FROM users WHERE email = ${user.email}`
        if (!existingUser) {
          // Створюємо нового користувача
          await sql`
            INSERT INTO users (email, name, avatar, email_verified, provider)
            VALUES (${user.email}, ${user.name}, ${user.image}, true, ${account.provider})
          `
          console.log(`✅ New user created: ${user.email}`)
        } else {
          console.log(`✅ Existing user: ${user.email}`)
        }
        return true
      } catch (error) {
        console.error("❌ DB error in signIn:", error)
        return false
      }
    },

    // Викликається при кожному отриманні сесії
    async session({ session, token }) {
      try {
        const [dbUser] = await sql`SELECT id, role FROM users WHERE email = ${session.user.email}`
        if (dbUser) {
          session.user.id = dbUser.id // додаємо id
          session.user.role = dbUser.role // додаємо роль
        }
      } catch (error) {
        console.error("Error in session callback:", error)
      }
      return session
    },
  },
  pages: {
    signIn: "/auth",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
