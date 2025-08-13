import fs from 'fs'
import path from 'path'

const CITY_MAP_PATH = path.join(process.cwd(), 'data', 'viatorCityMap.json')

let CITY_MAP = {}
try {
  CITY_MAP = JSON.parse(fs.readFileSync(CITY_MAP_PATH, 'utf8'))
} catch {
  console.warn('City map not found or invalid at data/viatorCityMap.json')
}

function normalizeCity(city) {
  if (!city) return '';
  
  // Decode HTML entities to handle cities like "monterey &amp; carmel"
  return city
    .trim()
    .toLowerCase()
    .replace(/&lt;/g, '<')       // &lt; -> <
    .replace(/&gt;/g, '>')       // &gt; -> >
    .replace(/&quot;/g, '"')     // &quot; -> "
    .replace(/&#39;/g, "'")      // &#39; -> '
    .replace(/&nbsp;/g, ' ')     // &nbsp; -> space
    .replace(/&amp;/g, '&')      // &amp; -> &
}

/**
 * Normalize destination ID to Viator API format
 * Accepts either numeric IDs (e.g., 24533) or string IDs with/without "d" prefix
 * Always returns format with "d" prefix (e.g., "d24533")
 */
function toViatorDestinationCode(id) {
  if (id === null || id === undefined || id === '') return null;
  
  // Convert to string if it's a number
  const stringId = String(id);
  
  // If already starts with "d", return as-is
  if (stringId.startsWith('d')) {
    return stringId;
  }
  
  // Otherwise, add "d" prefix
  return `d${stringId}`;
}

export function getViatorDestinationId(city) {
  if (!city) return null;
  
  const normalizedCity = normalizeCity(city);
  
  // Try direct lookup first
  let destinationId = CITY_MAP[normalizedCity];
  if (destinationId) {
    return destinationId;
  }
  
  // If direct lookup fails, try alternative strategies for cities with potential missing ampersands
  // Strategy 1: Try adding " & " between words if the city has multiple words but no ampersand
  if (!normalizedCity.includes('&') && normalizedCity.includes(' ')) {
    const words = normalizedCity.split(' ');
    if (words.length >= 2) {
      // Try different combinations with ampersands
      const variations = [
        // "monterey carmel" -> "monterey & carmel" 
        words.slice(0, -1).join(' ') + ' & ' + words[words.length - 1],
        // For longer names like "cairns the tropical north" -> "cairns & the tropical north"
        words[0] + ' & ' + words.slice(1).join(' ')
      ];
      
      for (const variation of variations) {
        destinationId = CITY_MAP[variation];
        if (destinationId) {
          console.log(`[Viator] Found destination using variation "${variation}" for original city "${city}"`);
          return destinationId;
        }
      }
    }
  }
  
  return null;
}

export async function fetchViatorTours({ city, count = 9, revalidateSeconds = 60 * 60 * 12 }) {
  console.log(`[Viator API] Starting fetch for city: ${city}`)
  
  const destinationId = getViatorDestinationId(city)
  if (!destinationId) {
    console.warn(`[Viator API] No destination ID found for city: ${city}`)
    return { products: [], destinationId: null }
  }

  // Normalize destination ID to ensure it has the "d" prefix required by Viator API
  const destinationCode = toViatorDestinationCode(destinationId)
  console.log(`[Viator API] Found destination ID: ${destinationId} -> normalized to: ${destinationCode} for city: ${city}`)

  // Match the exact payload structure from the PHP implementation
  const payload = {
    "filtering": {
      "destination": destinationCode
    },
    "sorting": {
      "sort": "TRAVELER_RATING",
      "order": "DESCENDING"
    },
    "pagination": {
      "start": 1,
      "count": count
    },
    "currency": "USD"
  }

  console.log(`[Viator API] Making request with payload:`, JSON.stringify(payload, null, 2))

  try {
    // Use environment variable only; do not fallback to a hardcoded API key
    const apiKey = process.env.VIATOR_API_KEY
    if (!apiKey) {
      throw new Error('Viator API key is not set. Please set the VIATOR_API_KEY environment variable.')
    }

    const res = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'Accept': 'application/json;version=2.0',
        'exp-api-key': apiKey
      },
      body: JSON.stringify(payload),
      // App Router: hint for ISR; Pages Router ignores and relies on getStaticProps revalidate
      next: { revalidate: revalidateSeconds }
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[Viator API] API Request Failed: ${res.status} ${res.statusText} ${text}`)
      throw new Error(`Viator API error: ${res.status} ${res.statusText} ${text}`)
    }

    const json = await res.json()
    const products = json?.products || []
    
    console.log(`[Viator API] Successfully fetched ${products.length} tours for ${city}`)
    
    if (products.length === 0) {
      console.warn(`[Viator API] No tours found for City Name: ${city}`)
    }
    
    return { products, destinationId: destinationCode }
  } catch (error) {
    console.error(`[Viator API] Request failed for city ${city}:`, error.message)
    
    // Development fallback: Return mock data when API fails
    if (
      process.env.NODE_ENV === 'development' ||
      error.message.includes('Viator API key is not set') ||
      (error.code && ['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET', 'EAI_AGAIN'].includes(error.code))
    ) {
      console.log(`[Viator API] Using mock data for development/testing`)
      const mockTours = [
        {
          productCode: "mock-tour-1",
          title: "Wenzhou Private Day Tour: Yandang Mountain and Tea Plantation",
          description: "Experience the natural beauty and culture of Wenzhou...",
          images: [{
            variants: [null, null, null, {
              url: "https://cache.viator.com/prod/11745/52c5b5dd-1f7d-4b7b-bb4f-7f9e9e8e7e6e_570x380.jpg"
            }]
          }],
          reviews: {
            totalReviews: 156,
            combinedAverageRating: 4.5
          },
          duration: {
            fixedDurationInMinutes: 480
          },
          pricing: {
            summary: {
              fromPrice: 89
            }
          },
          productUrl: "https://www.viator.com/tours/wenzhou/mock-tour-1"
        },
        {
          productCode: "mock-tour-2", 
          title: "Historic Wenzhou Walking Tour",
          description: "Discover the rich history and culture of Wenzhou...",
          images: [{
            variants: [null, null, null, {
              url: "https://cache.viator.com/prod/11745/temple-architecture-wenzhou_570x380.jpg"
            }]
          }],
          reviews: {
            totalReviews: 89,
            combinedAverageRating: 4.8
          },
          duration: {
            fixedDurationInMinutes: 180
          },
          pricing: {
            summary: {
              fromPrice: 45
            }
          },
          productUrl: "https://www.viator.com/tours/wenzhou/mock-tour-2"
        },
        {
          productCode: "mock-tour-3",
          title: "Wenzhou Food and Culture Experience",
          description: "Immerse yourself in Wenzhou's culinary scene...",
          images: [{
            variants: [null, null, null, {
              url: "https://cache.viator.com/prod/11745/wenzhou-food-culture_570x380.jpg"
            }]
          }],
          reviews: {
            totalReviews: 234,
            combinedAverageRating: 4.7
          },
          duration: {
            fixedDurationInMinutes: 240
          },
          pricing: {
            summary: {
              fromPrice: 67
            }
          },
          productUrl: "https://www.viator.com/tours/wenzhou/mock-tour-3"
        }
      ]
      
      return { products: mockTours, destinationId: destinationCode }
    }
    
    // Re-throw error for production or non-network issues
    throw error
  }
}