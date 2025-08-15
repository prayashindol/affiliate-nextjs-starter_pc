/**
 * Viator integration utility:
 * - Loads a local city -> destinationId map
 * - Normalizes city names
 * - Fetches tours from Viator Partner API (products/search)
 * - Falls back to deterministic mock tours (prevents hydration mismatch)
 *
 * IMPORTANT: Destination IDs sent to the Partner API MUST be numeric (no 'd' prefix).
 */

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
  console.log(`[Viator Setup] Loaded city map with ${cityCount} entries in ${loadTime}ms`)
} catch (error) {
  CITY_MAP_LOAD_STATUS = 'error'
  console.warn(`[Viator Setup] Failed to load city map at ${CITY_MAP_PATH}: ${error.message}`)
}

function normalizeCity(city) {
  if (!city) return ''
  return city
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, ' ')      // treat hyphens/underscores as spaces
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
}

/**
 * Strip optional leading 'd' and ensure numeric.
 */
function normalizeDestinationId(id) {
  if (id == null) return null
  const trimmed = String(id).trim()
  const numeric = trimmed.replace(/^d/i, '')
  if (!/^\d+$/.test(numeric)) return null
  return numeric
}

export function getViatorDestinationId(city) {
  const startTime = Date.now()
  console.log(`[Viator Lookup] Start for city: "${city}"`)
  if (!city) {
    console.log('[Viator Lookup] Empty city string')
    return null
  }

  const normalizedCity = normalizeCity(city)
  console.log(`[Viator Lookup] Normalized "${city}" -> "${normalizedCity}"`)

  let destinationId = CITY_MAP[normalizedCity]
  if (destinationId) {
    const valid = normalizeDestinationId(destinationId)
    if (valid) {
      console.log(`[Viator Lookup] Direct match: ${normalizedCity} -> ${valid} (${Date.now() - startTime}ms)`)
      return valid
    } else {
      console.warn('[Viator Lookup] Direct match value invalid after normalization:', destinationId)
      return null
    }
  }

  // Ampersand variation strategy (e.g. "napa sonoma" -> "napa & sonoma")
  if (!normalizedCity.includes('&') && normalizedCity.includes(' ')) {
    const words = normalizedCity.split(' ')
    if (words.length >= 2) {
      const variations = [
        words.slice(0, -1).join(' ') + ' & ' + words[words.length - 1],
        words[0] + ' & ' + words.slice(1).join(' ')
      ]
      console.log('[Viator Lookup] Testing ampersand variations:', variations)
      for (const variation of variations) {
        destinationId = CITY_MAP[variation]
        if (destinationId) {
          const valid = normalizeDestinationId(destinationId)
          if (valid) {
            console.log(`[Viator Lookup] Variation success "${variation}" -> ${valid} (${Date.now() - startTime}ms)`)
            return valid
          }
        }
      }
    }
  }

  console.log(`[Viator Lookup] No match for city "${city}" (${Date.now() - startTime}ms)`)
  return null
}

// Deterministic mock tours (SSR + client identical -> avoids hydration mismatch on failure)
const MOCK_TOURS = [
  {
    productCode: 'MOCK-1',
    title: 'Sample Tour One',
    price: { formattedValue: '$100.00' },
    shortDescription: 'Placeholder tour while real data loads.',
    images: [{ urls: ['https://via.placeholder.com/300x200?text=Tour+1'] }]
  },
  {
    productCode: 'MOCK-2',
    title: 'Sample Tour Two',
    price: { formattedValue: '$120.00' },
    shortDescription: 'Second placeholder tour.',
    images: [{ urls: ['https://via.placeholder.com/300x200?text=Tour+2'] }]
  },
  {
    productCode: 'MOCK-3',
    title: 'Sample Tour Three',
    price: { formattedValue: '$90.00' },
    shortDescription: 'Third placeholder tour.',
    images: [{ urls: ['https://via.placeholder.com/300x200?text=Tour+3'] }]
  }
]

/**
 * Fetch tours from Viator Partner API.
 *
 * @param {object} options
 * @param {string} options.city - City name from post
 * @param {number} [options.count=9] - Max number of products
 * @param {number} [options.revalidateSeconds=43200] - ISR revalidate hint (12h default)
 * @param {boolean} [options.preferReal=true] - If false or no key, returns mock tours
 */
export async function fetchViatorTours({
  city,
  count = 9,
  revalidateSeconds = 60 * 60 * 12,
  preferReal = true
}) {
  const overallStart = Date.now()
  console.log(`[Viator API] Fetch start city="${city}" count=${count}`)

  const destinationId = getViatorDestinationId(city)
  const metadata = {
    apiStatus: 'init',
    apiError: null,
    destinationId,
    rawMeta: {
      cityMapStatus: CITY_MAP_LOAD_STATUS,
      totalMs: null,
      fetchMs: null
    }
  }

  if (!destinationId) {
    metadata.apiStatus = 'no-destination'
    metadata.rawMeta.totalMs = Date.now() - overallStart
    console.warn(`[Viator API] No numeric destination for "${city}", returning empty.`)
    return { products: [], ...metadata }
  }

  const apiKey = process.env.VIATOR_API_KEY || ''
  if (!apiKey || !preferReal) {
    metadata.apiStatus = 'mock'
    metadata.rawMeta.totalMs = Date.now() - overallStart
    return { products: MOCK_TOURS.slice(0, count), ...metadata }
  }

  try {
    const body = {
      filtering: { destination: destinationId }, // NUMERIC ONLY
      currency: 'USD',
      pagination: { start: 1, count }
    }

    const reqStart = Date.now()
    const res = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'exp-api-key': apiKey
      },
      body: JSON.stringify(body),
      next: { revalidate: revalidateSeconds }
    })
    metadata.rawMeta.fetchMs = Date.now() - reqStart

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      const msg = `Viator API error ${res.status} ${res.statusText} ${text}`
      console.warn('[Viator API] Non-OK:', msg)
      metadata.apiStatus = 'error'
      metadata.apiError = msg
      metadata.rawMeta.totalMs = Date.now() - overallStart
      return { products: [], ...metadata }
    }

    const json = await res.json()
    const products = Array.isArray(json.products) ? json.products.slice(0, count) : []
    metadata.apiStatus = 'success'
    metadata.rawMeta.totalMs = Date.now() - overallStart
    console.log(`[Viator API] Success city="${city}" dest=${destinationId} products=${products.length}`)
    return { products, ...metadata }
  } catch (err) {
    metadata.apiStatus = 'exception'
    metadata.apiError = err instanceof Error ? err.message : String(err)
    metadata.rawMeta.totalMs = Date.now() - overallStart
    console.warn('[Viator API] Exception, returning empty list:', metadata.apiError)
    return { products: [], ...metadata }
  }
}