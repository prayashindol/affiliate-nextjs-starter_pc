/**
 * Viator integration utility (enhanced).
 * Responsibilities:
 *  - Load & cache city -> destinationId map
 *  - Normalize city names & destination IDs
 *  - Fetch products from Viator Partner API
 *  - Return a UNIFIED product shape (real or mock) to keep UI stable
 *
 * Notes:
 *  - Destination IDs must be NUMERIC (strip any leading 'd').
 *  - When API key missing or preferReal=false we return deterministic mock data.
 *  - Added product transformation for consistent fields:
 *      { productCode, title, shortDescription, price, thumbnail, link }
 */

import fs from 'fs'
import path from 'path'

const CITY_MAP_PATH = path.join(process.cwd(), 'data', 'viatorCityMap.json')

let CITY_MAP = {}
let CITY_MAP_LOAD_STATUS = 'not_loaded'
try {
  const startTime = Date.now()
  CITY_MAP = JSON.parse(fs.readFileSync(CITY_MAP_PATH, 'utf8'))
  CITY_MAP_LOAD_STATUS = 'loaded'
  console.log(`[Viator Setup] Loaded city map with ${Object.keys(CITY_MAP).length} entries in ${Date.now() - startTime}ms`)
} catch (err) {
  CITY_MAP_LOAD_STATUS = 'error'
  console.warn(`[Viator Setup] Failed loading city map: ${err.message}`)
}

function normalizeCity(city) {
  if (!city) return ''
  return city
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
}

function normalizeDestinationId(id) {
  if (id == null) return null
  const numeric = String(id).trim().replace(/^d/i, '')
  return /^\d+$/.test(numeric) ? numeric : null
}

export function getViatorDestinationId(city) {
  const t0 = Date.now()
  console.log(`[Viator Lookup] Start for "${city}"`)
  if (!city) return null
  const norm = normalizeCity(city)
  let dest = CITY_MAP[norm]
  if (dest) {
    const valid = normalizeDestinationId(dest)
    if (valid) {
      console.log(`[Viator Lookup] Direct match ${norm} -> ${valid} (${Date.now() - t0}ms)`)
      return valid
    }
  }

  // Try ampersand variations if multi-word & no existing ampersand
  if (!norm.includes('&') && norm.includes(' ')) {
    const words = norm.split(' ')
    if (words.length >= 2) {
      const candidates = [
        words.slice(0, -1).join(' ') + ' & ' + words[words.length - 1],
        words[0] + ' & ' + words.slice(1).join(' ')
      ]
      for (const cand of candidates) {
        dest = CITY_MAP[cand]
        if (dest) {
          const valid = normalizeDestinationId(dest)
            if (valid) {
              console.log(`[Viator Lookup] Variation "${cand}" -> ${valid} (${Date.now() - t0}ms)`)
              return valid
            }
        }
      }
    }
  }

  console.log(`[Viator Lookup] No match for "${city}" (${Date.now() - t0}ms)`)
  return null
}

/**
 * Unified product shape builder
 */
function shapeProduct(raw, destinationId) {
  if (!raw || typeof raw !== 'object') return null
  const images = Array.isArray(raw.images) ? raw.images : []
  const firstImage = images[0] || {}
  const thumbnail =
    firstImage?.urls?.[0] ||
    (Array.isArray(firstImage?.variants) && firstImage.variants[0]?.url) ||
    firstImage?.url ||
    null

  const rawShort =
    (Array.isArray(raw.highlights) && raw.highlights[0]) ||
    raw.shortDescription ||
    (raw.description
      ? (raw.description.length > 160
          ? raw.description.slice(0, 157) + '…'
          : raw.description)
      : 'Tour description')

  const price =
    raw.price?.formattedValue ||
    raw.price?.fromPrice?.formattedValue ||
    (raw.price?.fromPrice?.amount && raw.price?.fromPrice?.currencyCode
      ? `${raw.price.fromPrice.amount} ${raw.price.fromPrice.currencyCode}`
      : null)

  return {
    productCode: raw.productCode || raw.code || raw.id || raw.title || 'UNKNOWN',
    title: raw.title || 'Untitled Tour',
    shortDescription: rawShort,
    price,
    thumbnail,
    // Basic deep link (adjust if you have a specific tracking format)
    link: raw.productCode
      ? `https://www.viator.com/tours/${destinationId}/${encodeURIComponent(raw.productCode)}`
      : null
  }
}

// Deterministic mock products (already in final shape)
const MOCK_TOURS = [
  {
    productCode: 'MOCK-1',
    title: 'Sample Tour One',
    shortDescription: 'Placeholder tour while real data loads.',
    price: '$100.00',
    thumbnail: 'https://via.placeholder.com/300x200?text=Tour+1',
    link: null
  },
  {
    productCode: 'MOCK-2',
    title: 'Sample Tour Two',
    shortDescription: 'Second placeholder tour.',
    price: '$120.00',
    thumbnail: 'https://via.placeholder.com/300x200?text=Tour+2',
    link: null
  },
  {
    productCode: 'MOCK-3',
    title: 'Sample Tour Three',
    shortDescription: 'Third placeholder tour.',
    price: '$90.00',
    thumbnail: 'https://via.placeholder.com/300x200?text=Tour+3',
    link: null
  }
]

/**
 * Fetch tours from Viator Partner API and return unified structure.
 *
 * @param {object} params
 * @param {string} params.city
 * @param {number} [params.count=9]
 * @param {number} [params.revalidateSeconds=43200]
 * @param {boolean} [params.preferReal=true]
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
  const meta = {
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
    meta.apiStatus = 'no-destination'
    meta.rawMeta.totalMs = Date.now() - overallStart
    return { products: [], ...meta }
  }

  const apiKey = process.env.VIATOR_API_KEY || ''
  if (!apiKey || !preferReal) {
    meta.apiStatus = 'mock'
    meta.rawMeta.totalMs = Date.now() - overallStart
    return { products: MOCK_TOURS.slice(0, count), ...meta }
  }

  try {
    const body = {
      filtering: { destination: destinationId },
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
    meta.rawMeta.fetchMs = Date.now() - reqStart

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      const msg = `Viator API error ${res.status} ${res.statusText} ${text}`
      meta.apiStatus = 'error'
      meta.apiError = msg
      meta.rawMeta.totalMs = Date.now() - overallStart
      return { products: [], ...meta }
    }

    const json = await res.json()
    const shaped = (Array.isArray(json.products) ? json.products : [])
      .slice(0, count)
      .map(p => shapeProduct(p, destinationId))
      .filter(Boolean)

    meta.apiStatus = 'success'
    meta.rawMeta.totalMs = Date.now() - overallStart
    console.log(`[Viator API] Success city="${city}" dest=${destinationId} products=${shaped.length}`)
    return { products: shaped, ...meta }
  } catch (err) {
    meta.apiStatus = 'exception'
    meta.apiError = err instanceof Error ? err.message : String(err)
    meta.rawMeta.totalMs = Date.now() - overallStart
    return { products: [], ...meta }
  }
}