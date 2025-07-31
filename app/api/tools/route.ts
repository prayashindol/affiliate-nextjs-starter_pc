// app/api/tools/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_PERSONAL_TOKEN;

  if (!AIRTABLE_API_KEY) {
    console.error('Missing Airtable configuration');
    return NextResponse.json({ error: "Missing Airtable token" }, { status: 500 });
  }

  try {
    // Add timeout and retry logic for better reliability
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(AIRTABLE_API_URL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'User-Agent': 'NextJS-App/1.0',
      },
      signal: controller.signal,
      // Cache for 5 minutes, revalidate in background
      next: { revalidate: 300 }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Airtable API error: ${res.status} ${res.statusText}`);
      return NextResponse.json({ 
        error: "Failed to fetch Airtable data",
        status: res.status 
      }, { status: 500 });
    }

    const data = await res.json();

    if (!data.records || !Array.isArray(data.records)) {
      console.error('Invalid data structure from Airtable');
      return NextResponse.json({ error: "Invalid data format" }, { status: 500 });
    }

    // Return with enhanced cache headers for better performance
    return NextResponse.json(data.records, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, max-age=60',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
      }
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Airtable API request timeout');
      return NextResponse.json({ error: "Request timeout" }, { status: 504 });
    }
    
    console.error('Error fetching tools:', error);
    return NextResponse.json({ 
      error: "Failed to fetch tools data",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
  }
}
