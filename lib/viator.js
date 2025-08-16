/**
 * Viator integration utility (pure JavaScript version).
 * - Imports city -> destinationId map from /data/viatorCityMap.json (bundled on Vercel)
 * - Normalizes city names & destination IDs with robust variants
 * - Calls Viator API (tries v2 first, falls back to v1)
 * - Returns a unified product shape for UI stability
 */

// ✅ Import JSON so the serverless bundle includes it (no fs)
import CITY_MAP_RAW from '@/data/viatorCityMap.json';

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
function variantsFor(norm) {
  const v = new Set();
  v.add(norm);

  // Remove leading "the "
  if (norm.startsWith('the ')) v.add(norm.replace(/^the\s+/, ''));

  // Replace "&" <-> "and"
  if (norm.includes(' & ')) v.add(norm.replace(/ & /g, ' and '));
  if (norm.includes(' and ')) v.add(norm.replace(/ and /g, ' & '));

  // Hyphenated version and space version
  if (norm.includes(' ')) v.add(norm.replace(/\s+/g, '-'));
  if (norm.includes('-')) v.add(norm.replace(/-+/g, ' '));

  // Remove "city" word (e.g., "new york city" -> "new york")
  v.add(norm.replace(/\bcity\b/g, '').replace(/\s+/g, ' ').trim());

  return Array.from(v).filter(Boolean);
}

function normalizeDestinationId(id) {
  if (id == null) return null;
  const numeric = String(id).trim().replace(/^d/i, '');
  return /^\d+$/.test(numeric) ? numeric : null;
}

/** Build a normalized index from the imported JSON (no fs) */
let CITY_MAP_NORM = {};
let CITY_MAP_LOAD_STATUS = 'not_loaded';

try {
  const normIndex = {};
  for (const [key, val] of Object.entries(CITY_MAP_RAW || {})) {
    const dest = normalizeDestinationId(val);
    if (!dest) continue;

    const norm = normalizeCity(key);
    const candidates = variantsFor(norm);
    for (const c of candidates) {
      if (!normIndex[c]) normIndex[c] = dest; // first wins
    }
  }
  CITY_MAP_NORM = normIndex;
  CITY_MAP_LOAD_STATUS = 'loaded';
  console.log(
    `[Viator Setup] Loaded city map: ${Object.keys(CITY_MAP_RAW || {}).length} raw keys -> ${Object.keys(CITY_MAP_NORM).length} normalized keys`
  );
} catch (err) {
  CITY_MAP_LOAD_STATUS = 'error';
  console.warn(`[Viator Setup] Failed building city map: ${err?.message || err}`);
}

/** Lookup using the normalized index (with variants fallback) */
export function getViatorDestinationId(city) {
  const t0 = Date.now();
  if (!city) return null;

  const norm = normalizeCity(city);
  const candidates = variantsFor(norm);
  for (const c of candidates) {
    const dest = CITY_MAP_NORM[c];
    if (dest) return dest;
  }

  // Last-chance: strip non-letters
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

/** Unified product shape for UI */
function shapeProduct(raw, destinationId) {
  if (!raw || typeof raw !== 'object') return null;

  const images = Array.isArray(raw.images) ? raw.images : [];
  const firstImage = images[0] || {};
  const thumbnail =
    (firstImage && Array.isArray(firstImage.urls) && firstImage.urls[0]) ||
    (firstImage && Array.isArray(firstImage.variants) && firstImage.variants[0]?.url) ||
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
    (raw.price && raw.price.formattedValue) ||
    (raw.price && raw.price.fromPrice && raw.price.fromPrice.formattedValue) ||
    (raw.price &&
      raw.price.fromPrice &&
      raw.price.fromPrice.amount &&
      raw.price.fromPrice.currencyCode
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

// Deterministic mock tours
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

/**
 * Fetch tours from Viator. Tries v2 (exp) API first, falls back to v1 if needed.
 * Returns: { products, apiStatus, apiError, destinationId, rawMeta }
 */
export async function fetchViatorTours({
  city,
  count = 9,
  revalidateSeconds = 60 * 60, // 1h
  preferReal = true,
}) {
  const overallStart = Date.now();
  const destinationId = getViatorDestinationId(city);

  const meta = {
    apiStatus: 'init',
    apiError: null,
    destinationId,
    rawMeta: {
      cityMapStatus: CITY_MAP_LOAD_STATUS,
      totalMs: null,
      fetchMs: null,
      tried: [],
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
      const shaped = (Array.isArray(json.products) ? json.products : [])
        .slice(0, count)
        .map((p) => shapeProduct(p, destinationId))
        .filter(Boolean);
      meta.apiStatus = 'success';
      meta.rawMeta.totalMs = Date.now() - overallStart;
      return { products: shaped, ...meta };
    } else {
      const text = await resV2.text().catch(() => '');
      meta.apiStatus = 'error';
      meta.apiError = `v2 ${resV2.status} ${resV2.statusText} ${text.slice(0, 300)}`;
    }
  } catch (e) {
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
      const rawArr = Array.isArray(json.data) ? json.data : (json.products || []);
      const shaped = rawArr
        .slice(0, count)
        .map((p) => shapeProduct(p, destinationId))
        .filter(Boolean);
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
  } catch (e) {
    meta.apiStatus = 'exception';
    meta.apiError = `${meta.apiError || ''} | v1 exception: ${e?.message || e}`.trim();
    meta.rawMeta.totalMs = Date.now() - overallStart;
    return { products: [], ...meta };
  }
}
