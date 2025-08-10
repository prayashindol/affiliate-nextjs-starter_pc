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
  return (city || '').trim().toLowerCase()
}

export function getViatorDestinationId(city) {
  const key = normalizeCity(city)
  return CITY_MAP[key] || null
}

export async function fetchViatorTours({ city, count = 9, revalidateSeconds = 60 * 60 * 12 }) {
  // Use environment variable first, fallback to the API key from the PHP implementation for compatibility
  const apiKey = process.env.VIATOR_API_KEY || '1fc70765-578a-4e19-b645-6b2447ff101b'
  
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
    throw error
  }
}