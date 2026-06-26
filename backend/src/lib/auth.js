// src/lib/auth.js
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
 
  database: prismaAdapter(prisma, {
    provider: "postgresql", 
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  secret: process.env.BETTER_AUTH_SECRET,
  
trustedOrigins: [
    "http://localhost:3000",
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30, 
    updateAge: 60 * 60 * 24, 
    cookieCache: {
      enabled: true,
      maxAge: 15 * 60, 
    },
  },

  
  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // },
  },
});