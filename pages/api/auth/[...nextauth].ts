import NextAuth, { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from "@prisma/client"
import { custom } from 'openid-client'

custom.setHttpOptionsDefaults({
  timeout: 10000,
})

type ClientType = {
  clientId: string
  clientSecret: string
}

const prisma = new PrismaClient()

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    } as ClientType),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session(params) {
      return Promise.resolve({
        ...params.session,
        user: {
          ...params.session.user,
          id: params.user.id,
        },
      });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)