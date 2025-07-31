// app/api/tools/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_PERSONAL_TOKEN;

  if (!AIRTABLE_API_KEY) {
    return NextResponse.json({ error: "Missing Airtable token" }, { status: 500 });
  }

  try {
    const res = await fetch(AIRTABLE_API_URL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      // Cache for 5 minutes to improve performance
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch Airtable data" }, { status: 500 });
    }

    const data = await res.json();

    // Set cache headers for client-side caching
    const response = NextResponse.json(data.records);
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ error: "Failed to fetch tools data" }, { status: 500 });
  }
}
