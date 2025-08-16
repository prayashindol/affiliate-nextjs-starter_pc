// app/api/viator-destid/route.ts (TEMP)
export const runtime = 'nodejs';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || '';
  // import from your viator lib
  const { getViatorDestinationId } = await import('@/lib/viator');
  const dest = getViatorDestinationId(city);
  return new Response(JSON.stringify({ city, dest }, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
}
