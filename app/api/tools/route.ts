// app/api/tools/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_PERSONAL_TOKEN;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;
  const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;

  // Test tools fallback data
  const testTools = [
    {
      id: "test1",
      fields: {
        Name: "PriceLabs",
        CleanedName: "PriceLabs",
        Description: "AI-powered dynamic pricing for vacation rentals. Optimize your rates automatically based on demand, competition, and market trends.",
        Category: "Pricing",
        Website: "https://pricelabs.co",
        AffiliateLink: "https://pricelabs.co",
        Featured: true,
        DontShow: false,
        logoUrl: null,
        fallbackEmoji: "💰"
      }
    },
    {
      id: "test2", 
      fields: {
        Name: "Hostfully",
        CleanedName: "Hostfully",
        Description: "Complete property management solution with unified inbox, automated messaging, and guest experience tools.",
        Category: "Property Management",
        Website: "https://hostfully.com",
        AffiliateLink: "https://hostfully.com",
        Featured: true,
        DontShow: false,
        logoUrl: null,
        fallbackEmoji: "🏠"
      }
    },
    {
      id: "test3",
      fields: {
        Name: "Smartbnb",
        CleanedName: "Smartbnb", 
        Description: "Automated messaging and guest communication platform. Save time with smart templates and instant responses.",
        Category: "Communication",
        Website: "https://smartbnb.io",
        AffiliateLink: "https://smartbnb.io",
        Featured: false,
        DontShow: false,
        logoUrl: null,
        fallbackEmoji: "💬"
      }
    },
    {
      id: "test4",
      fields: {
        Name: "Wheelhouse",
        CleanedName: "Wheelhouse",
        Description: "Revenue management and market intelligence platform for short-term rental hosts and property managers.",
        Category: "Pricing",
        Website: "https://usewheelhouse.com",
        AffiliateLink: "https://usewheelhouse.com",
        Featured: false,
        DontShow: false,
        logoUrl: null,
        fallbackEmoji: "📊"
      }
    },
    {
      id: "test5",
      fields: {
        Name: "Host Tools",
        CleanedName: "Host Tools",
        Description: "Comprehensive property management suite with cleaning schedules, maintenance tracking, and financial reporting.",
        Category: "Property Management", 
        Website: "https://hosttools.com",
        AffiliateLink: "https://hosttools.com",
        Featured: true,
        DontShow: false,
        logoUrl: null,
        fallbackEmoji: "🔧"
      }
    },
    {
      id: "test6",
      fields: {
        Name: "Awning",
        CleanedName: "Awning",
        Description: "Full-service property management for Airbnb. From listing optimization to guest services and cleaning coordination.",
        Category: "Property Management",
        Website: "https://awning.com",
        AffiliateLink: "https://awning.com", 
        Featured: false,
        DontShow: false,
        logoUrl: null,
        fallbackEmoji: "⛱️"
      }
    }
  ];

  // Check if all required Airtable environment variables are configured
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    console.error("Airtable configuration missing. Required environment variables:", {
      AIRTABLE_PERSONAL_TOKEN: !!AIRTABLE_API_KEY,
      AIRTABLE_BASE_ID: !!AIRTABLE_BASE_ID,
      AIRTABLE_TABLE_ID: !!AIRTABLE_TABLE_ID
    });
    
    // Return configuration error response with test tools
    return NextResponse.json({
      error: "AIRTABLE_CONFIG_MISSING",
      message: "Airtable configuration is incomplete. Please check environment variables.",
      data: testTools,
      isTestData: true
    });
  }

  try {
    console.log(`Attempting to fetch from Airtable: ${AIRTABLE_API_URL}`);
    const res = await fetch(AIRTABLE_API_URL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Airtable API responded with status: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`Successfully fetched ${data.records?.length || 0} records from Airtable`);
    return NextResponse.json(data.records);
  } catch (error) {
    console.error("Error fetching from Airtable:", error);
    
    // Determine error type for better user messaging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isNetworkError = errorMessage.includes('EAI_AGAIN') || errorMessage.includes('getaddrinfo') || errorMessage.includes('fetch failed');
    
    // Return error response with test tools as fallback
    return NextResponse.json({
      error: isNetworkError ? "NETWORK_ERROR" : "AIRTABLE_API_ERROR", 
      message: isNetworkError 
        ? "Unable to connect to Airtable. Network connectivity issue detected."
        : `Airtable API error: ${errorMessage}`,
      data: testTools,
      isTestData: true
    });
  }
}
