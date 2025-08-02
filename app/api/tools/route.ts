// app/api/tools/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_PERSONAL_TOKEN;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

  // Check if all required Airtable environment variables are configured
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    console.error("Airtable configuration missing. Required environment variables:", {
      AIRTABLE_PERSONAL_TOKEN: !!AIRTABLE_API_KEY,
      AIRTABLE_BASE_ID: !!AIRTABLE_BASE_ID,
      AIRTABLE_TABLE_ID: !!AIRTABLE_TABLE_ID
    });
    
    // Return empty array instead of mock data to avoid showing test tools
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(AIRTABLE_API_URL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Airtable API responded with status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data.records);
  } catch (error) {
    console.error("Error fetching from Airtable:", error);
    // Return empty array instead of error to prevent blocking the UI
    return NextResponse.json([]);
  }
}
