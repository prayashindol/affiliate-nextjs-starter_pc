
// /app/api/tools/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const AIRTABLE_API_URL = "https://api.airtable.com/v0/app40ZHtvYU2nqvAg/shrttRklwIcpmazc7";
  const AIRTABLE_API_KEY = process.env.AIRTABLE_PERSONAL_TOKEN;

  const res = await fetch(AIRTABLE_API_URL, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch Airtable data" }, { status: 500 });
  }

  const data = await res.json();

  // Map and clean up data as needed here if you want
  return NextResponse.json(data.records);
}
