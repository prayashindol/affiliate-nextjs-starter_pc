// app/api/auth/[...nextauth]/route.ts
export const runtime = 'nodejs';          // must not be 'edge'
export const dynamic = 'force-dynamic';   // avoid caching the session route

import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,       // we verified both are SET
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  // debug: true, // <- optional: enable temporarily if you still need logs
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
