export const runtime = 'nodejs';
export async function GET() {
  const mask = (v?: string) => (v ? 'SET' : 'MISSING');
  return new Response(JSON.stringify({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: mask(process.env.NEXTAUTH_SECRET),
    SANITY_TOKEN: mask(process.env.SANITY_TOKEN),
    VIATOR_API_KEY: mask(process.env.VIATOR_API_KEY),
    AIRTABLE_TOKEN: mask(process.env.AIRTABLE_TOKEN),
    GITHUB_ID: mask(process.env.GITHUB_ID),
    GITHUB_SECRET: mask(process.env.GITHUB_SECRET),
  }, null, 2), { headers: { 'content-type': 'application/json' }});
}
