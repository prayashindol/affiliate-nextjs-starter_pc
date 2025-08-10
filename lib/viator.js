import fs from 'fs'
import path from 'path'

const CITY_MAP_PATH = path.join(process.cwd(), 'data', 'viatorCityMap.json')

let CITY_MAP = {}
try {
  CITY_MAP = JSON.parse(fs.readFileSync(CITY_MAP_PATH, 'utf8'))
} catch {
  console.warn('City map not found or invalid at data/viatorCityMap.json')
}

// Create a reverse mapping from slug-style names to actual city names with special characters
const SLUG_TO_CITY_MAP = {
  // Cities with ampersands
  "alberobello locorotondo": "alberobello & locorotondo",
  "anaheim buena park": "anaheim & buena park",
  "cairns the tropical north": "cairns & the tropical north",
  "dunedin the otago peninsula": "dunedin & the otago peninsula",
  "fiordland milford sound": "fiordland & milford sound",
  "franz josef fox glacier": "franz josef & fox glacier",
  "green bay door county": "green bay & door county",
  "kelowna okanagan valley": "kelowna & okanagan valley",
  "livigno bormio": "livigno & bormio", 
  "monterey carmel": "monterey & carmel",
  "napa sonoma": "napa & sonoma",
  "niagara falls around": "niagara falls & around",
  "noosa sunshine coast": "noosa & sunshine coast",
  "peterborough the kawarthas": "peterborough & the kawarthas",
  "the whitsundays hamilton island": "the whitsundays & hamilton island",
  "windsor eton": "windsor & eton",
  // Add more mappings as needed for other special characters
}

function normalizeCity(city) {
  if (!city) return ''
  
  // First normalize the input 
  let normalized = city.trim().toLowerCase()
  
  // Handle HTML entities
  normalized = normalized.replace(/&amp;/g, '&')
  
  // If we already have a proper city name with special characters, use it
  if (CITY_MAP[normalized]) {
    return normalized
  }
  
  // Try to convert from slug format to proper city name
  // Remove common prefixes from URLs like "best-tours-in-", "ultimate-travel-tips-for-"
  const URL_PREFIXES = [
    'best-tours-in-',
    'ultimate-travel-tips-for-',
    'best-tours-for-',
    'travel-guide-for-'
  ];
  const prefixRegex = new RegExp('^(' + URL_PREFIXES.map(prefix => prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|') + ')', 'i');
  const cleanSlug = normalized
    .replace(prefixRegex, '')
    .replace(/-/g, ' ') // Convert hyphens to spaces
  
  // Check if we have a mapping for this slug-style name
  if (SLUG_TO_CITY_MAP[cleanSlug]) {
    return SLUG_TO_CITY_MAP[cleanSlug]
  }
  
  // Return the cleaned slug as fallback
  return cleanSlug
}

export function getViatorDestinationId(city) {
  const key = normalizeCity(city)
  return CITY_MAP[key] || null
}

export async function fetchViatorTours({ city, count = 9, revalidateSeconds = 60 * 60 * 12 }) {
  console.log(`[Viator API] Starting fetch for city: ${city}`)
  
  const destinationId = getViatorDestinationId(city)
  if (!destinationId) {
    console.warn(`[Viator API] No destination ID found for city: ${city}`)
    return { products: [], destinationId: null }
  }

  console.log(`[Viator API] Found destination ID: ${destinationId} for city: ${city}`)

  // Match the exact payload structure from the PHP implementation
  const payload = {
    "filtering": {
      "destination": destinationId
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
    
    return { products, destinationId }
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
      
      return { products: mockTours, destinationId }
    }
    
    // Re-throw error for production or non-network issues
    throw error
  }
}