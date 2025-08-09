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
  const apiKey = process.env.VIATOR_API_KEY
  if (!apiKey) {
    console.warn('Missing VIATOR_API_KEY env variable - Viator tours will not be displayed')
    return { products: [], destinationId: null }
  }

  const destinationId = getViatorDestinationId(city)
  if (!destinationId) return { products: [], destinationId: null }

  const payload = {
    filtering: { destination: destinationId },
    sorting: { sort: 'TRAVELER_RATING', order: 'DESCENDING' },
    pagination: { start: 1, count },
    currency: 'USD'
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
    throw new Error(`Viator API error: ${res.status} ${res.statusText} ${text}`)
  }

  const json = await res.json()
  return { products: json?.products || [], destinationId }
}