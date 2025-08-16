// app/api/viator-probe/route.ts
export const runtime = "nodejs";
export async function GET() {
  try {
    const r = await fetch("https://api.viator.com/partner/v1/taxonomies/categories", {
      headers: { "api-key": process.env.VIATOR_API_KEY! },
    });
    return new Response(JSON.stringify({ ok: r.ok, status: r.status }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 500 });
  }
}
