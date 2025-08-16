// app/components/ViatorTours.jsx
'use client'
import React from 'react'

/**
 * Viator Tours Grid (cards)
 * Expects tours shaped like:
 * { productCode, title, shortDescription, price, thumbnail, link, images?, primaryPhoto? }
 */
export default function ViatorTours({
  tours = [],
  city,
  destinationId,
  apiStatus,
  apiError,
  rawMeta,
}) {
  if (!tours?.length) {
    let msg = null
    if (apiStatus === 'no-destination') msg = 'No destination mapping for this city.'
    else if (apiStatus === 'mock') msg = 'Showing mock tours (test or missing API key).'
    else if (apiStatus === 'error') msg = 'Tours temporarily unavailable (API error).'
    else if (apiStatus === 'exception') msg = 'Unexpected error loading tours.'
    else if (apiStatus === 'success') msg = 'No tours returned for this destination.'

    return (
      <div className="not-prose my-8 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        <div className="font-semibold text-gray-900">
          {city ? `Tours in ${city}` : 'Tours'}
        </div>
        <div className="mt-2">{msg || 'No tours to show right now.'}</div>
        {apiError && (
          <details className="mt-3 text-xs text-red-600">
            <summary>Error details</summary>
            <pre className="mt-1 whitespace-pre-wrap">{apiError}</pre>
          </details>
        )}
      </div>
    )
  }

  return (
    <section className="not-prose my-10">
      <h2 className="mb-5 text-xl font-semibold">
        {city ? `9 Highest Rated Sight-Seeing Tours to Take in ${city}` : 'Popular Tours'}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((t) => (
          <TourCard key={t.productCode || t.title} tour={t} city={city} />
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Some links may be affiliate links that help support our site at no extra cost to you.
      </p>
    </section>
  )
}

/* ---------------- helpers ---------------- */

function pickBestVariant(variants) {
  if (!Array.isArray(variants) || variants.length === 0) return null
  // Try to pick a “large/medium” style variant first
  const preferred = variants.find(v =>
    /large|xlarge|xl|big|1024|1200|1600/i.test(v.type || '') ||
    /1024|1200|1600|2048/.test(String(v.width || ''))
  )
  if (preferred?.url) return preferred.url
  // Otherwise pick the widest available
  const sorted = [...variants].sort((a, b) => (b.width || 0) - (a.width || 0))
  return sorted[0]?.url || null
}

function getThumb(t, city) {
  // 1) explicit thumbnail / imageUrl
  if (t.thumbnail) return t.thumbnail
  if (t.imageUrl) return t.imageUrl

  // 2) known viator shapes
  if (Array.isArray(t.images) && t.images.length) {
    const first = t.images[0]
    // new API often has variants or urls array
    const byVariant = pickBestVariant(first.variants)
    if (byVariant) return byVariant
    if (Array.isArray(first.urls) && first.urls[0]) return first.urls[0]
    if (first.url) return first.url
  }
  if (t.primaryPhoto?.large?.url) return t.primaryPhoto.large.url
  if (t.primaryPhoto?.medium?.url) return t.primaryPhoto.medium.url
  if (t.primaryPhoto?.small?.url) return t.primaryPhoto.small.url

  // 3) pleasant fallback
  const q = encodeURIComponent(city || t.title || 'travel')
  return `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60&sig=${q}`
}

function getPrice(t) {
  // Prefer preformatted; otherwise try to build from amount/currency
  if (typeof t.price === 'string' && t.price) return t.price
  const amt =
    t.price?.fromPrice?.amount ??
    t.price?.amount ??
    t.fromPrice?.amount ??
    t.amount
  const cur =
    t.price?.fromPrice?.currencyCode ??
    t.price?.currencyCode ??
    t.fromPrice?.currencyCode ??
    t.currencyCode
  return amt != null && cur ? `${amt} ${cur}` : null
}

function getLink(t) {
  if (t.link) return t.link
  const q = encodeURIComponent(t.title || t.productCode || 'tour')
  return `https://www.viator.com/searchResults/all?keyword=${q}`
}

/* ---------------- card ---------------- */

function TourCard({ tour, city }) {
  const href = getLink(tour)
  const thumb = getThumb(tour, city)
  const price = getPrice(tour)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500">
      <div className="relative aspect-[4/3] w-full bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={tour.title || 'Tour image'}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 group-hover:text-indigo-600">
          {tour.title || 'Untitled Tour'}
        </h3>

        {tour.shortDescription && (
          <p className="mt-2 line-clamp-3 text-xs text-gray-600">{tour.shortDescription}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          {price ? (
            <span className="text-sm font-semibold text-indigo-600">{price}</span>
          ) : (
            <span className="text-sm text-gray-500">Price varies</span>
          )}

          <a
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Find out more
            <svg
              className="ml-1 h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.293 3.293a1 1 0 0 1 1.414 0l4.999 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 1 1-1.414-1.414L15.586 11H2a1 1 0 1 1 0-2h13.586l-3.293-3.293a1 1 0 0 1 0-1.414z" />
            </svg>
          </a>
        </div>

        <div className="mt-2">
          <a
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Read more on Viator →
          </a>
        </div>
      </div>
    </article>
  )
}
