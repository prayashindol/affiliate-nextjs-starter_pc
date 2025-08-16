/**
 * Viator integration utility.
 * - Loads city -> destinationId map from /data/viatorCityMap.json (server-side).
 * - Normalizes city names & destination IDs.
 * - Calls Viator API (tries v2 "exp" API first, falls back to v1) with server-only key.
 * - Always returns a unified product shape for UI stability.
 */

import fs from 'fs';
import path from 'path';

const CITY_MAP_PATH = path.join(process.cwd(), 'data', 'viatorCityMap.json');

/** Remove diacritics (e.g., “São Paulo” -> “Sao Paulo”) */
function stripDiacritics(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Our canonical normalizer for both input city and map keys */
function normalizeCity(raw?: string) {
  if (!raw) return '';
  return stripDiacritics(
    raw
      .toLowerCase()
      .trim()
      .replace(/[-_]+/g, ' ')        // hyphens/underscores -> spaces
      .replace(/[.,()/]/g, ' ')      // punctuation -> spaces
      .replace(/&amp;/g, '&')
      .replace(/&lt;|</g, '<')
      .replace(/&gt;|>/g, '>')
      .replace(/&quot;|"/g, '"')
      .replace(/&#39;|’|‘|'/g, "'")
      .replace(/\s+/g, ' ')          // collapse spaces
  );
}

/** Extra alias variants for more forgiving matching */
function variantsFor(norm: string) {
  const v = new Set<string>();
  v.add(norm);

  // Remove leading "the "
  if (norm.startsWith('the ')) v.add(norm.replace(/^the\s+/, ''));

  // Replace "&" with "and" (and vice-versa)
  if (norm.includes(' & ')) v.add(norm.replace(/ & /g, ' and '));
  if (norm.includes(' and ')) v.add(norm.replace(/ and /g, ' & '));

  // Add a hyphenated version and a space version
  if (norm.includes(' ')) v.add(norm.replace(/\s+/g, '-'));
  if (norm.includes('-')) v.add(norm.replace(/-+/g, ' '));

  // Remove the word "city" suffix/prefix
  v.add(norm.replace(/\bcity\b/g, '').replace(/\s+/g, ' ').trim());

  return Array.from(v).filter(Boolean);
}

function normalizeDestinationId(id: string | number | null | undefined) {
  if (id == null) return null;
  const numeric = String(id).trim().replace(/^d/i, '');
  return /^\d+$/.test(numeric) ? numeric : null;
}

/** Build a normalized index from the JSON */
/** Build a normalized index from the JSON */
let CITY_MAP_RAW = {};
let CITY_MAP_NORM = {};
let CITY_MAP_LOAD_STATUS = 'not_loaded';

try {
  const start = Date.now();
  CITY_MAP_RAW = JSON.parse(fs.readFileSync(CITY_MAP_PATH, 'utf8'));

  const normIndex: Record<string, string> = {};
  for (const [key, val] of Object.entries(CITY_MAP_RAW)) {
    const dest = normalizeDestinationId(val);
    if (!dest) continue;

    const norm = normalizeCity(key);
    const candidates = variantsFor(norm);
    for (const c of candidates) {
      // First one wins; don’t overwrite if duplicate variants collide
      if (!normIndex[c]) normIndex[c] = dest;
    }
  }
  CITY_MAP_NORM = normIndex;
  CITY_MAP_LOAD_STATUS = 'loaded';
  console.log(
    `[Viator Setup] Loaded city map: ${Object.keys(CITY_MAP_RAW).length} raw keys -> ${Object.keys(CITY_MAP_NORM).length} normalized keys in ${Date.now() - start}ms`
  );
} catch (err: any) {
  CITY_MAP_LOAD_STATUS = 'error';
  console.warn(`[Viator Setup] Failed loading city map: ${err?.message || err}`);
}

/** Lookup using the normalized index (with variants fallback) */
export function getViatorDestinationId(city?: string) {
  const t0 = Date.now();
  if (!city) return null;

  const norm = normalizeCity(city);
  const candidates = variantsFor(norm);
  for (const c of candidates) {
    const dest = CITY_MAP_NORM[c];
    if (dest) {
      // console.log(`[Viator Lookup] ${city} -> ${c} -> ${dest} (${Date.now() - t0}ms)`);
      return dest;
    }
  }

  // Last-chance: try removing all non-letters for very noisy inputs
  const stripped = norm.replace(/[^a-z\s&-]/g, '').replace(/\s+/g, ' ').trim();
  if (stripped && stripped !== norm) {
    const extra = variantsFor(stripped);
    for (const c of extra) {
      const dest = CITY_MAP_NORM[c];
      if (dest) return dest;
    }
  }

  console.log(`[Viator Lookup] No match for "${city}" (${Date.now() - t0}ms)`);
  return null;
}

/** Unified product shape */
function shapeProduct(raw: any, destinationId: string) {
  if (!raw || typeof raw !== 'object') return null;

  const images = Array.isArray(raw.images) ? raw.images : [];
  const firstImage = images[0] || {};
  const thumbnail =
    firstImage?.urls?.[0] ||
    (Array.isArray(firstImage?.variants) && firstImage.variants[0]?.url) ||
    firstImage?.url ||
    null;

  const rawShort =
    (Array.isArray(raw.highlights) && raw.highlights[0]) ||
    raw.shortDescription ||
    (raw.description
      ? raw.description.length > 160
        ? raw.description.slice(0, 157) + '…'
        : raw.description
      : 'Tour description');

  const price =
    raw.price?.formattedValue ||
    raw.price?.fromPrice?.formattedValue ||
    (raw.price?.fromPrice?.amount && raw.price?.fromPrice?.currencyCode
      ? `${raw.price.fromPrice.amount} ${raw.price.fromPrice.currencyCode}`
      : null);

  const productCode = raw.productCode || raw.code || raw.id || 'UNKNOWN';

  return {
    productCode,
    title: raw.title || 'Untitled Tour',
    shortDescription: rawShort,
    price,
    thumbnail,
    link: productCode
      ? `https://www.viator.com/tours/${destinationId}/${encodeURIComponent(productCode)}`
      : null,
  };
}

// Deterministic mock tours for resilience
const MOCK_TOURS = [
  {
    productCode: 'MOCK-1',
    title: 'Sample Tour One',
    shortDescription: 'Placeholder tour while real data loads.',
    price: '$100.00',
    thumbnail: 'https://via.placeholder.com/300x200?text=Tour+1',
    link: null,
  },
  {
    productCode: 'MOCK-2',
    title: 'Sample Tour Two',
    shortDescription: 'Second placeholder tour.',
    price: '$120.00',
    thumbnail: 'https://via.placeholder.com/300x200?text=Tour+2',
    link: null,
  },
  {
    productCode: 'MOCK-3',
    title: 'Sample Tour Three',
    shortDescription: 'Third placeholder tour.',
    price: '$90.00',
    thumbnail: 'https://via.placeholder.com/300x200?text=Tour+3',
    link: null,
  },
];

type FetchToursParams = {
  city: string;
  count?: number;
  revalidateSeconds?: number;
  preferReal?: boolean;
};

/**
 * Fetch tours from Viator. Tries v2 (exp) API first, falls back to v1 if needed.
 * Returns: { products, apiStatus, apiError, destinationId, rawMeta }
 */
export async function fetchViatorTours({
  city,
  count = 9,
  revalidateSeconds = 60 * 60, // 1h
  preferReal = true,
}: FetchToursParams) {
  const overallStart = Date.now();
  const destinationId = getViatorDestinationId(city);

  const meta: any = {
    apiStatus: 'init',
    apiError: null,
    destinationId,
    rawMeta: {
      cityMapStatus: CITY_MAP_LOAD_STATUS,
      totalMs: null,
      fetchMs: null,
      tried: [] as string[],
    },
  };

  if (!destinationId) {
    meta.apiStatus = 'no-destination';
    meta.rawMeta.totalMs = Date.now() - overallStart;
    return { products: [], ...meta };
  }

  const apiKey = process.env.VIATOR_API_KEY || '';
  if (!apiKey || !preferReal) {
    meta.apiStatus = 'mock';
    meta.rawMeta.totalMs = Date.now() - overallStart;
    return { products: MOCK_TOURS.slice(0, count), ...meta };
  }

  // Attempt 1: v2 "exp" API
  try {
    meta.rawMeta.tried.push('v2/products/search');
    const bodyV2 = {
      filtering: { destination: destinationId },
      currency: 'USD',
      pagination: { start: 1, count },
    };

    const t1 = Date.now();
    const resV2 = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'exp-api-key': apiKey,
      },
      body: JSON.stringify(bodyV2),
      next: { revalidate: revalidateSeconds },
    });
    meta.rawMeta.fetchMs = Date.now() - t1;

    if (resV2.ok) {
      const json = await resV2.json();
      const shaped =
        (Array.isArray(json.products) ? json.products : [])
          .slice(0, count)
          .map((p: any) => shapeProduct(p, destinationId))
          .filter(Boolean) || [];
      meta.apiStatus = 'success';
      meta.rawMeta.totalMs = Date.now() - overallStart;
      return { products: shaped, ...meta };
    } else {
      const text = await resV2.text().catch(() => '');
      meta.apiStatus = 'error';
      meta.apiError = `v2 ${resV2.status} ${resV2.statusText} ${text.slice(0, 300)}`;
    }
  } catch (e: any) {
    meta.apiStatus = 'error';
    meta.apiError = `v2 exception: ${e?.message || e}`;
  }

  // Attempt 2: v1 fallback
  try {
    meta.rawMeta.tried.push('v1/products/search');
    const bodyV1 = {
      filters: [{ id: 'destinations', value: [Number(destinationId)] }],
      currency: 'USD',
      start: 1,
      count,
    };

    const t2 = Date.now();
    const resV1 = await fetch('https://api.viator.com/partner/v1/products/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(bodyV1),
      next: { revalidate: revalidateSeconds },
    });
    meta.rawMeta.fetchMs = (meta.rawMeta.fetchMs || 0) + (Date.now() - t2);

    if (resV1.ok) {
      const json = await resV1.json();
      const shaped =
        (Array.isArray(json.data) ? json.data : json.products || [])
          .slice(0, count)
          .map((p: any) => shapeProduct(p, destinationId))
          .filter(Boolean) || [];
      meta.apiStatus = 'success';
      meta.rawMeta.totalMs = Date.now() - overallStart;
      return { products: shaped, ...meta };
    } else {
      const text = await resV1.text().catch(() => '');
      meta.apiStatus = 'error';
      meta.apiError = `${meta.apiError || ''} | v1 ${resV1.status} ${resV1.statusText} ${text.slice(0, 300)}`.trim();
      meta.rawMeta.totalMs = Date.now() - overallStart;
      return { products: [], ...meta };
    }
  } catch (e: any) {
    meta.apiStatus = 'exception';
    meta.apiError = `${meta.apiError || ''} | v1 exception: ${e?.message || e}`.trim();
    meta.rawMeta.totalMs = Date.now() - overallStart;
    return { products: [], ...meta };
  }
}
