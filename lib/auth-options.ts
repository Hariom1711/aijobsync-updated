// /* eslint-disable @typescript-eslint/no-explicit-any */

// import type { AuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "./prisma";
// import bcrypt from "bcrypt";

// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id?: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
// }

// export const authOptions: AuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;
//         const user = await prisma.user.findUnique({ where: { email: credentials.email } });
//         if (!user || !user.password) return null;
//         const valid = await bcrypt.compare(credentials.password, user.password);
//         return valid ? user : null;
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: { strategy: "jwt" },
// callbacks: {
//   async session({ session, token }) {
//     if (session.user && token?.sub) {
//       session.user.id = token.sub; // typed: string | undefined
//     }
//     return session;
//   },
// },

// };


import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: "FREE" | "PRO";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?: "FREE" | "PRO";
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        return valid ? user : null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On sign-in, pull plan from DB user object
      if (user) {
        token.plan = (user as any).plan ?? "FREE";
      }

      // On session update (e.g. after plan change), refresh plan from DB
      if (trigger === "update" && session?.plan) {
        token.plan = session.plan;
      }

      // Also keep plan fresh from DB on every token refresh
      if (token.sub && !user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { plan: true },
        });
        if (dbUser) token.plan = dbUser.plan;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id   = token.sub;
        session.user.plan = token.plan ?? "FREE";
      }
      return session;
    },
  },
};
