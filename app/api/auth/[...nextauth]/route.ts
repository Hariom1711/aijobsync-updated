

// import NextAuth, { AuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";

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

// const prisma = new PrismaClient();

// export const authOptions: AuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) return null;

//         const isValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isValid) return null;

//         return user;
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: { strategy: "jwt" },
//   callbacks: {
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.sub;
//       }
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
