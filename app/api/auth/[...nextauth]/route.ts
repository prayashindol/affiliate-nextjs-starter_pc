// app/api/auth/[...nextauth]/route.ts
export const runtime = 'nodejs';          // ❗ must not be 'edge'
export const dynamic = 'force-dynamic';   // avoids caching of the session route

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github"; // or add your other providers

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,    // we confirmed it's set
  trustHost: true,                        // important on Vercel (previews, proxies)
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,       // we saw GITHUB_ID is SET
      clientSecret: process.env.GITHUB_SECRET!
    }),
  ],
  // Optional: turn on verbose logs temporarily
  debug: process.env.NEXTAUTH_DEBUG === "true",
});

export { handler as GET, handler as POST };
