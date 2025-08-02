// app/api/tools/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_PERSONAL_TOKEN;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;
  const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;

  // Debug logging
  console.log("Environment variables check:", {
    AIRTABLE_PERSONAL_TOKEN: !!AIRTABLE_API_KEY,
    AIRTABLE_BASE_ID: !!AIRTABLE_BASE_ID,
    AIRTABLE_TABLE_ID: !!AIRTABLE_TABLE_ID,
    API_URL: AIRTABLE_API_URL
  });

  // Check if all required Airtable environment variables are configured
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    console.error("Airtable configuration missing. Required environment variables:", {
      AIRTABLE_PERSONAL_TOKEN: !!AIRTABLE_API_KEY,
      AIRTABLE_BASE_ID: !!AIRTABLE_BASE_ID,
      AIRTABLE_TABLE_ID: !!AIRTABLE_TABLE_ID
    });
    
    // Return test tools when Airtable is not configured
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
    
    return NextResponse.json(testTools);
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
    
    // Return test tools as fallback when Airtable API fails
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
    
    return NextResponse.json(testTools);
  }
}
