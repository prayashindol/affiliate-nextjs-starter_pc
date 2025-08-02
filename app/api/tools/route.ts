// app/api/tools/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_PERSONAL_TOKEN;

  if (!AIRTABLE_API_KEY) {
    return NextResponse.json({ error: "Missing Airtable token" }, { status: 500 });
  }

  const res = await fetch(AIRTABLE_API_URL, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
    next: { revalidate: 300 }, // Cache for 5 minutes instead of no-store
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch Airtable data" }, { status: 500 });
  }

  const data = await res.json();

  return NextResponse.json(data.records);
}
