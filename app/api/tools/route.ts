// app/api/tools/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_PERSONAL_TOKEN;

  if (!AIRTABLE_API_KEY) {
    // Return mock data for development when no API key is available
    console.warn("Missing Airtable token, returning mock data");
    return NextResponse.json([
      {
        id: "mock1",
        fields: {
          Name: "Test Tool 1",
          Domain: "example.com",
          Website: "https://example.com",
          Category: "Property Management",
          Badge: "Popular",
          Highlight: "Best in class",
          Description: "A great tool for managing your properties",
          Rating: 4.5,
          UserCount: "1000+ users",
          Pricing: "From $29/month",
          Features: "Feature 1|Feature 2|Feature 3",
          Pros: "Easy to use|Great support|Affordable",
          Featured: true
        }
      },
      {
        id: "mock2", 
        fields: {
          Name: "Test Tool 2",
          Domain: "example2.com",
          Website: "https://example2.com",
          Category: "Dynamic Pricing",
          Badge: "New",
          Highlight: "AI-powered",
          Description: "Dynamic pricing tool with AI capabilities",
          Rating: 4.2,
          UserCount: "500+ users",
          Pricing: "$49/month",
          Features: "AI Pricing|Analytics|Reports",
          Pros: "Accurate|Fast|Reliable",
          Featured: true
        }
      }
    ]);
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
