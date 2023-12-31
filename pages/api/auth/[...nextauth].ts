import NextAuth, { NextAuthOptions, SessionStrategy } from 'next-auth'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from "@prisma/client"
import { custom } from 'openid-client'
import { Session } from 'inspector'

custom.setHttpOptionsDefaults({
  timeout: 10000,
})

type ClientType = {
  clientId: string
  clientSecret: string
}

const prisma = new PrismaClient()

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    } as ClientType),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL as string
      return redirectUrl
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {strategy: 'database' as SessionStrategy},
}

export default NextAuth(authOptions)
export { authOptions }