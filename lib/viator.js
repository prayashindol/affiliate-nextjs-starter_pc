/**
 * Viator integration utility (Next.js compatible).
 * - Uses a bundled city->destId map (./viatorCityMap.js)
 * - Normalizes city names robustly (spaces, diacritics, ampersands, etc.)
 * - Calls Viator API (tries v2 first, falls back to v1)
 * - Shapes products so the UI can rely on a consistent structure
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
      .replace(/[\u00a0\u2000-\u200b\u202f]/g, ' ') // NBSP/zero-width -> space
      .replace(/[-_]+/g, ' ')                      // hyphens/underscores -> spaces
      .replace(/[.,()/]/g, ' ')                    // light punctuation -> spaces
      .replace(/&amp;/g, '&')
      .replace(/&lt;|</g, '<')
      .replace(/&gt;|>/g, '>')
      .replace(/&quot;|"/g, '"')
      .replace(/&#39;|’|‘|'/g, "'")
      .replace(/\s+/g, ' ')                        // collapse spaces
  );
}

/** Extra alias variants for forgiving matching */
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

/** Build a normalized index from the map */
let CITY_MAP_NORM = {};
let CITY_MAP_LOAD_STATUS = 'not_loaded';

try {
  const normIndex = {};
  for (const [key, val] of Object.entries(cityMapRaw || {})) {
    const dest = normalizeDestinationId(val);
    if (!dest) continue;

    const norm = normalizeCity(key);
    for (const c of variantsFor(norm)) {
      if (!normIndex[c]) normIndex[c] = dest; // first wins
    }
  }
  CITY_MAP_NORM = normIndex;
  CITY_MAP_LOAD_STATUS = 'loaded';
  console.log(
    `[Viator Setup] Loaded city map: ${Object.keys(cityMapRaw || {}).length} raw -> ${Object.keys(CITY_MAP_NORM).length} normalized`
  );
} catch (err) {
  CITY_MAP_LOAD_STATUS = 'error';
  console.warn(`[Viator Setup] Failed loading city map: ${err?.message || err}`);
}

/** Public: find destinationId for a city */
export function getViatorDestinationId(city) {
  const t0 = Date.now();
  if (!city) return null;

  const norm = normalizeCity(city);
  for (const c of variantsFor(norm)) {
    const dest = CITY_MAP_NORM[c];
    if (dest) return dest;
  }

  // Last-chance: strip non-letters
  const stripped = norm.replace(/[^a-z\s&-]/g, '').replace(/\s+/g, ' ').trim();
  if (stripped && stripped !== norm) {
    for (const c of variantsFor(stripped)) {
      const dest = CITY_MAP_NORM[c];
      if (dest) return dest;
    }
  }

  console.log(`[Viator Lookup] No match for "${city}" (${Date.now() - t0}ms)`);
  return null;
}

/** Pick a decent, larger image if available */
function bestImage(images) {
  if (!Array.isArray(images) || images.length === 0) return null;

  // flatten variants and sort by width desc, prefer >= 800px if possible
  const variants = images.flatMap(img => Array.isArray(img?.variants) ? img.variants : []);
  if (variants.length) {
    variants.sort((a, b) => (b?.width || 0) - (a?.width || 0));
    return variants[0]?.url || null;
  }
  // fallback: first direct url
  return images[0]?.url || null;
}

/** Format duration object to "Xh Ym" string */
function formatDuration(rawDuration) {
  if (!rawDuration) return null;

  // v2: { fixedDurationInMinutes, label }
  if (typeof rawDuration.fixedDurationInMinutes === 'number') {
    const mins = rawDuration.fixedDurationInMinutes;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`;
  }
  if (rawDuration.label) return String(rawDuration.label);

  // v1 sometimes gives plain strings
  if (typeof rawDuration === 'string') return rawDuration;

  return null;
}

/** Unified product shape the UI consumes */
/** Unified product shape builder – mirrors the PHP plugin image & link logic */
function shapeProduct(raw, destinationId) {
  if (!raw || typeof raw !== 'object') return null;

  // ===== IMAGE (match PHP: images[0].variants[3].url, then larger fallbacks) =====
  const imagesArr = Array.isArray(raw.images) ? raw.images : [];
  let thumbnail = null;
  if (imagesArr[0]?.variants && Array.isArray(imagesArr[0].variants)) {
    const v = imagesArr[0].variants;
    thumbnail =
      v[3]?.url ||                                  // exact PHP pick
      (v.find(x => x?.width >= 800)?.url) ||         // next best large
      (v.at?.(-1)?.url) ||                           // or last available
      (v[0]?.url) ||                                 // or first available
      null;
  }
  if (!thumbnail) {
    // other common shapes from Viator payloads
    thumbnail =
      imagesArr[0]?.url ||
      imagesArr[0]?.urls?.[0] ||
      raw.primaryPhoto?.large?.url ||
      raw.primaryPhoto?.medium?.url ||
      raw.primaryPhoto?.small?.url ||
      null;
  }

  // ===== SHORT DESCRIPTION =====
  const rawShort =
    (Array.isArray(raw.highlights) && raw.highlights[0]) ||
    raw.shortDescription ||
    (raw.description
      ? (raw.description.length > 160
          ? raw.description.slice(0, 157) + '…'
          : raw.description)
      : 'Tour description');

  // ===== PRICE (match PHP: pricing.summary.fromPrice) =====
  let price = null;
  if (raw?.pricing?.summary?.fromPrice != null) {
    // PHP rendered as "$123". If you prefer currency-aware, adjust here.
    price = `$${raw.pricing.summary.fromPrice}`;
  } else if (raw.price?.formattedValue) {
    price = raw.price.formattedValue;
  } else if (raw.price?.fromPrice?.formattedValue) {
    price = raw.price.fromPrice.formattedValue;
  } else if (raw.price?.fromPrice?.amount && raw.price?.fromPrice?.currencyCode) {
    price = `${raw.price.fromPrice.amount} ${raw.price.fromPrice.currencyCode}`;
  }

  // ===== LINK (match PHP: productUrl first) =====
  const productCode = raw.productCode || raw.code || raw.id || 'UNKNOWN';
  const link =
    raw.productUrl ||
    (productCode
      ? `https://www.viator.com/tours/${destinationId}/${encodeURIComponent(productCode)}`
      : null);

  return {
    productCode,
    title: raw.title || 'Untitled Tour',
    shortDescription: rawShort,
    price,
    thumbnail,
    link,
    // expose a few raw bits that the UI might want (ratings/duration)
    reviews: raw.reviews || null,
    duration: raw.duration || null,
    // keep original arrays for any future needs (e.g., bigger images)
    images: imagesArr || null,
    productUrl: raw.productUrl || null,
  };
}



// Deterministic mock tours (kept for fallback)
const MOCK_TOURS = [
  {
    productCode: 'MOCK-1',
    title: 'Sample Tour One',
    shortDescription: 'Placeholder tour while real data loads.',
    price: '$100.00',
    thumbnail: 'https://via.placeholder.com/900x600?text=Tour+1',
    duration: '2h',
    reviewCount: 123,
    rating: 4.7,
    link: 'https://www.viator.com/',
  },
  {
    productCode: 'MOCK-2',
    title: 'Sample Tour Two',
    shortDescription: 'Second placeholder tour.',
    price: '$120.00',
    thumbnail: 'https://via.placeholder.com/900x600?text=Tour+2',
    duration: '3h',
    reviewCount: 41,
    rating: 4.3,
    link: 'https://www.viator.com/',
  },
  {
    productCode: 'MOCK-3',
    title: 'Sample Tour Three',
    shortDescription: 'Third placeholder tour.',
    price: '$90.00',
    thumbnail: 'https://via.placeholder.com/900x600?text=Tour+3',
    duration: '90m',
    reviewCount: 0,
    rating: null,
    link: 'https://www.viator.com/',
  },
];

/**
 * Fetch tours from Viator. Tries v2 (exp) first, falls back to v1 if needed.
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
