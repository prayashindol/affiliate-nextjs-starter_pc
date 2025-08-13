import fs from 'fs'
import path from 'path'

const CITY_MAP_PATH = path.join(process.cwd(), 'data', 'viatorCityMap.json')

let CITY_MAP = {}
let CITY_MAP_LOAD_STATUS = 'not_loaded'
try {
  const startTime = Date.now()
  CITY_MAP = JSON.parse(fs.readFileSync(CITY_MAP_PATH, 'utf8'))
  const loadTime = Date.now() - startTime
  const cityCount = Object.keys(CITY_MAP).length
  CITY_MAP_LOAD_STATUS = 'loaded'
  console.log(`[Viator Setup] Successfully loaded city map with ${cityCount} cities in ${loadTime}ms`)
} catch (error) {
  CITY_MAP_LOAD_STATUS = 'error'
  console.warn(`[Viator Setup] City map load failed at ${CITY_MAP_PATH}:`, error.message)
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
  const startTime = Date.now()
  console.log(`[Viator Lookup] Starting destination lookup for city: "${city}"`)
  
  if (!city) {
    console.log(`[Viator Lookup] Empty city provided`)
    return null
  }
  
  const normalizedCity = normalizeCity(city)
  console.log(`[Viator Lookup] City normalized: "${city}" -> "${normalizedCity}"`)
  
  // Try direct lookup first
  let destinationId = CITY_MAP[normalizedCity]
  if (destinationId) {
    const lookupTime = Date.now() - startTime
    console.log(`[Viator Lookup] Direct match found: "${normalizedCity}" -> ${destinationId} (${lookupTime}ms)`)
    return destinationId
  }
  
  console.log(`[Viator Lookup] No direct match for "${normalizedCity}", trying variations...`)
  
  // If direct lookup fails, try alternative strategies for cities with potential missing ampersands
  // Strategy 1: Try adding " & " between words if the city has multiple words but no ampersand
  if (!normalizedCity.includes('&') && normalizedCity.includes(' ')) {
    const words = normalizedCity.split(' ')
    if (words.length >= 2) {
      // Try different combinations with ampersands
      const variations = [
        // "monterey carmel" -> "monterey & carmel" 
        words.slice(0, -1).join(' ') + ' & ' + words[words.length - 1],
        // For longer names like "cairns the tropical north" -> "cairns & the tropical north"
        words[0] + ' & ' + words.slice(1).join(' ')
      ]
      
      console.log(`[Viator Lookup] Testing ${variations.length} ampersand variations:`, variations)
      
      for (const variation of variations) {
        destinationId = CITY_MAP[variation]
        if (destinationId) {
          const lookupTime = Date.now() - startTime
          console.log(`[Viator Lookup] Found destination using variation "${variation}" for original city "${city}" -> ${destinationId} (${lookupTime}ms)`)
          return destinationId
        }
      }
      
      console.log(`[Viator Lookup] No matches found for any ampersand variations`)
    }
  }
  
  const lookupTime = Date.now() - startTime
  console.log(`[Viator Lookup] No destination ID found for city: "${city}" (searched for ${lookupTime}ms)`)
  return null
}

export async function fetchViatorTours({ city, count = 9, revalidateSeconds = 60 * 60 * 12 }) {
  const functionStartTime = Date.now()
  console.log(`[Viator API] Starting fetch for city: ${city}, count: ${count}, revalidate: ${revalidateSeconds}s`)
  
  // Initialize metadata object for structured return
  const metadata = {
    apiStatus: 'unknown',
    apiError: null,
    rawMeta: {
      cityMapStatus: CITY_MAP_LOAD_STATUS,
      lookupTiming: null,
      requestTiming: null,
      responseTiming: null,
      totalTiming: null,
      productsCount: 0,
      usedMockData: false
    }
  }
  
  const destinationId = getViatorDestinationId(city)
  metadata.rawMeta.lookupTiming = Date.now() - functionStartTime
  
  if (!destinationId) {
    console.warn(`[Viator API] No destination ID found for city: ${city}`)
    metadata.apiStatus = 'no_destination'
    metadata.apiError = `No destination mapping found for city: ${city}`
    metadata.rawMeta.totalTiming = Date.now() - functionStartTime
    return { products: [], destinationId: null, ...metadata }
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
      const error = 'Viator API key is not set. Please set the VIATOR_API_KEY environment variable.'
      console.error(`[Viator API] ${error}`)
      metadata.apiStatus = 'no_api_key'
      metadata.apiError = error
      throw new Error(error)
    }

    if (process.env.VIATOR_DEBUG === 'true') {
      console.log(`[Viator API] API key present`)
    }
    
    const requestStartTime = Date.now()
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
    
    metadata.rawMeta.requestTiming = Date.now() - requestStartTime
    console.log(`[Viator API] Request completed in ${metadata.rawMeta.requestTiming}ms, status: ${res.status} ${res.statusText}`)

    const responseStartTime = Date.now()
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      const errorMessage = `Viator API error: ${res.status} ${res.statusText} ${text}`
      console.error(`[Viator API] API Request Failed: ${res.status} ${res.statusText} ${text}`)
      metadata.apiStatus = 'api_error'
      metadata.apiError = errorMessage
      metadata.rawMeta.responseTiming = Date.now() - responseStartTime
      throw new Error(errorMessage)
    }

    const json = await res.json()
    metadata.rawMeta.responseTiming = Date.now() - responseStartTime
    console.log(`[Viator API] Response parsed in ${metadata.rawMeta.responseTiming}ms`)
    
    const products = json?.products || []
    metadata.rawMeta.productsCount = products.length
    metadata.apiStatus = 'success'
    
    console.log(`[Viator API] Successfully fetched ${products.length} tours for ${city}`)
    
    if (products.length === 0) {
      console.warn(`[Viator API] No tours found for City Name: ${city}`)
      metadata.apiStatus = 'no_products'
    }
    
    metadata.rawMeta.totalTiming = Date.now() - functionStartTime
    console.log(`[Viator API] Total fetch operation completed in ${metadata.rawMeta.totalTiming}ms`)
    
    return { products, destinationId: destinationCode, ...metadata }
  } catch (error) {
    console.error(`[Viator API] Request failed for city ${city}:`, error.message)
    
    // Development fallback: Return mock data when API fails
    if (
      process.env.NODE_ENV === 'development' ||
      error.message.includes('Viator API key is not set') ||
      (error.code && ['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET', 'EAI_AGAIN'].includes(error.code))
    ) {
      console.log(`[Viator API] Using mock data for development/testing`)
      metadata.rawMeta.usedMockData = true
      metadata.apiStatus = 'mock_data'
      
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
      
      metadata.rawMeta.productsCount = mockTours.length
      metadata.rawMeta.totalTiming = Date.now() - functionStartTime
      console.log(`[Viator API] Mock data fallback completed in ${metadata.rawMeta.totalTiming}ms`)
      
      return { products: mockTours, destinationId: destinationCode, ...metadata }
    }
    
    // Set error metadata before re-throwing
    metadata.rawMeta.totalTiming = Date.now() - functionStartTime
    if (!metadata.apiStatus || metadata.apiStatus === 'unknown') {
      metadata.apiStatus = 'error'
    }
    if (!metadata.apiError) {
      metadata.apiError = error.message
    }
    
    // Re-throw error for production or non-network issues
    throw error
  }
}