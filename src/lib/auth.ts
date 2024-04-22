import { db } from "@/db"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({session, token}) => {
      session.user.id = token.id as string
      return session
    },
    jwt: async ({token, user}) => {
      if (user) {
        token.id = user.id
      }

      console.log("jwt", token)
      return token
    },
  }
})
