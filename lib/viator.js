/**
 * Viator integration utility (Next.js compatible version).
 * - Loads city -> destinationId map from /data/viatorCityMap.json (bundled import)
 * - Normalizes city names & destination IDs with robust variants
 * - Calls Viator API (tries v2 first, falls back to v1)
 * - Returns a unified product shape for UI stability
 */

import cityMapRaw from './viatorCityMap.js';

/** Remove diacritics (e.g., “São Paulo” -> “Sao Paulo”) */
function stripDiacritics(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Canonical normalizer used for BOTH input city and map keys */
function normalizeCity(raw) {
  if (!raw) return '';
  return stripDiacritics(
    String(raw)
      .toLowerCase()
      .trim()
      .replace(/[\u00a0\u2000-\u200b\u202f]/g, ' ') // normalize NBSP & thin/zero-width spaces
      .replace(/[-_]+/g, ' ')
      .replace(/[.,()/]/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;|</g, '<')
      .replace(/&gt;|>/g, '>')
      .replace(/&quot;|"/g, '"')
      .replace(/&#39;|’|‘|'/g, "'")
      .replace(/\s+/g, ' ')
  );
}

/** Extra alias variants for more forgiving matching */
function variantsFor(norm) {
  const v = new Set();
  v.add(norm);
  if (norm.startsWith('the ')) v.add(norm.replace(/^the\s+/, ''));
  if (norm.includes(' & ')) v.add(norm.replace(/ & /g, ' and '));
  if (norm.includes(' and ')) v.add(norm.replace(/ and /g, ' & '));
  if (norm.includes(' ')) v.add(norm.replace(/\s+/g, '-'));
  if (norm.includes('-')) v.add(norm.replace(/-+/g, ' '));
  v.add(norm.replace(/\bcity\b/g, '').replace(/\s+/g, ' ').trim());
  return Array.from(v).filter(Boolean);
}

function normalizeDestinationId(id) {
  if (id == null) return null;
  const numeric = String(id).trim().replace(/^d/i, '');
  return /^\d+$/.test(numeric) ? numeric : null;
}

/** Build a normalized index from the JSON */
let CITY_MAP_NORM = {};
let CITY_MAP_LOAD_STATUS = 'not_loaded';

try {
  const normIndex = {};
  for (const [key, val] of Object.entries(cityMapRaw)) {
    const dest = normalizeDestinationId(val);
    if (!dest) continue;
    const norm = normalizeCity(key);
    for (const c of variantsFor(norm)) {
      if (!normIndex[c]) normIndex[c] = dest;
    }
  }
  CITY_MAP_NORM = normIndex;
  CITY_MAP_LOAD_STATUS = 'loaded';
  console.log(
    `[Viator Setup] Loaded city map: ${Object.keys(cityMapRaw).length} raw keys -> ${Object.keys(CITY_MAP_NORM).length} normalized keys`
  );
} catch (err) {
  CITY_MAP_LOAD_STATUS = 'error';
  console.warn(`[Viator Setup] Failed loading city map: ${err?.message || err}`);
}

/** Lookup using the normalized index (with variants fallback) */
export function getViatorDestinationId(city) {
  if (!city) return null;
  const norm = normalizeCity(city);
  for (const c of variantsFor(norm)) {
    const dest = CITY_MAP_NORM[c];
    if (dest) return dest;
  }
  const stripped = norm.replace(/[^a-z\s&-]/g, '').replace(/\s+/g, ' ').trim();
  if (stripped && stripped !== norm) {
    for (const c of variantsFor(stripped)) {
      const dest = CITY_MAP_NORM[c];
      if (dest) return dest;
    }
  }
  return null;
}

/* ---------- Helpers to normalize API shapes ---------- */

function formatMinutesToText(mins) {
  if (!mins || typeof mins !== 'number') return null;
  if (mins < 60) return `${mins} min`;
  const h = Math.round((mins / 60) * 10) / 10; // one decimal
  return h % 1 === 0 ? `${h} hrs` : `${h} hrs`;
}

function extractDuration(raw) {
  // v2 common shapes
  if (raw?.durationText && typeof raw.durationText === 'string') return raw.durationText;
  if (raw?.duration && typeof raw.duration === 'string') return raw.duration;

  // duration as object with minutes
  const mins =
    raw?.duration?.fixedDurationInMinutes ??
    raw?.duration?.durationInMinutes ??
    raw?.durationInMinutes ??
    raw?.fixedDurationInMinutes ??
    null;

  const formatted = formatMinutesToText(mins);
  if (formatted) return formatted;

  // older v1 shapes like { timeUnit: 'HOUR', timeValue: 3 }
  const unit = raw?.duration?.timeUnit || raw?.timeUnit;
  const val = raw?.duration?.timeValue || raw?.timeValue;
  if (unit && val) {
    const u = String(unit).toLowerCase();
    if (u.startsWith('hour')) return `${val} hrs`;
    if (u.startsWith('day')) return `${val} day${val > 1 ? 's' : ''}`;
    if (u.startsWith('min')) return `${val} min`;
    return `${val} ${unit}`;
  }

  return null;
}

function extractRating(raw) {
  // try the most common keys across v1/v2
  const r =
    raw?.reviewsAverageRating ??
    raw?.reviewsAvg ??
    raw?.averageRating ??
    raw?.ratingAvg ??
    raw?.rating ??
    raw?.reviews?.averageRating ??
    null;
  return typeof r === 'number' ? r : (r ? Number(r) : null);
}

function extractReviewCount(raw) {
  const c =
    raw?.reviewsCount ??
    raw?.numberOfReviews ??
    raw?.reviewCount ??
    raw?.reviews?.totalCount ??
    raw?.reviewsTotal ??
    0;
  return typeof c === 'number' ? c : (c ? Number(c) : 0);
}

/** Unified product shape for UI (used in cards) */
function shapeProduct(raw, destinationId) {
  if (!raw || typeof raw !== 'object') return null;

  const images = Array.isArray(raw.images) ? raw.images : [];
  const firstImage = images[0] || {};
  const thumbnail =
    (firstImage?.urls && firstImage.urls[0]) ||
    (firstImage?.variants && firstImage.variants[0]?.url) ||
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
    rating: extractRating(raw),
    reviewCount: extractReviewCount(raw),
    duration: extractDuration(raw), // ALWAYS a string (or null) now
  };
}

// Deterministic mock tours (for local/missing key)
const MOCK_TOURS = [
  {
    productCode: 'MOCK-1',
    title: 'Sample Tour One',
    shortDescription: 'Placeholder tour while real data loads.',
    price: '$100.00',
    thumbnail: 'https://via.placeholder.com/300x200?text=Tour+1',
    link: null,
    rating: 4.6,
    reviewCount: 128,
    duration: '3 hrs',
  },
  {
    productCode: 'MOCK-2',
    title: 'Sample Tour Two',
    shortDescription: 'Second placeholder tour.',
    price: '$120.00',
    thumbnail: 'https://via.placeholder.com/300x200?text=Tour+2',
    link: null,
    rating: 4.8,
    reviewCount: 64,
    duration: '1 day',
  },
];

/**
 * Fetch tours from Viator. Tries v2 (exp) API first, falls back to v1 if needed.
 * Returns: { products, apiStatus, apiError, destinationId, rawMeta }
 */
export async function fetchViatorTours({
  city,
  count = 9,
  revalidateSeconds = 3600, // 1h
  preferReal = true,
}) {
  const destinationId = getViatorDestinationId(city);
  const meta = {
    apiStatus: 'init',
    apiError: null,
    destinationId,
    rawMeta: { cityMapStatus: CITY_MAP_LOAD_STATUS, tried: [] },
  };

  if (!destinationId) return { products: [], ...meta, apiStatus: 'no-destination' };

  const apiKey = process.env.VIATOR_API_KEY || '';
  if (!apiKey || !preferReal) return { products: MOCK_TOURS.slice(0, count), ...meta, apiStatus: 'mock' };

  // Attempt 1: v2 "exp" API
  try {
    meta.rawMeta.tried.push('v2/products/search');
    const resV2 = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'exp-api-key': apiKey,
      },
      body: JSON.stringify({
        filtering: { destination: destinationId },
        currency: 'USD',
        pagination: { start: 1, count },
      }),
      next: { revalidate: revalidateSeconds },
    });

    if (resV2.ok) {
      const json = await resV2.json();
      const shaped = (Array.isArray(json.products) ? json.products : [])
        .slice(0, count)
        .map((p) => shapeProduct(p, destinationId))
        .filter(Boolean);
      return { products: shaped, ...meta, apiStatus: 'success' };
    } else {
      meta.apiError = `v2 ${resV2.status} ${resV2.statusText}`;
    }
  } catch (e) {
    meta.apiError = `v2 exception: ${e?.message || e}`;
  }

  // Attempt 2: v1 fallback
  try {
    meta.rawMeta.tried.push('v1/products/search');
    const resV1 = await fetch('https://api.viator.com/partner/v1/products/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        filters: [{ id: 'destinations', value: [Number(destinationId)] }],
        currency: 'USD',
        start: 1,
        count,
      }),
      next: { revalidate: revalidateSeconds },
    });

    if (resV1.ok) {
      const json = await resV1.json();
      const rawArr = Array.isArray(json.data) ? json.data : (json.products || []);
      const shaped = rawArr.slice(0, count).map((p) => shapeProduct(p, destinationId)).filter(Boolean);
      return { products: shaped, ...meta, apiStatus: 'success' };
    } else {
      meta.apiError = `${meta.apiError || ''} | v1 ${resV1.status} ${resV1.statusText}`.trim();
      return { products: [], ...meta, apiStatus: 'error' };
    }
  } catch (e) {
    meta.apiError = `${meta.apiError || ''} | v1 exception: ${e?.message || e}`.trim();
    return { products: [], ...meta, apiStatus: 'exception' };
  }
}
