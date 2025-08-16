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
          <TourCard key={t.productCode || t.title} tour={t} />
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Some links may be affiliate links that help support our site at no extra cost to you.
      </p>
    </section>
  )
}

function getThumb(t) {
  // Try several known Viator shapes
  return (
    t.thumbnail ||
    t.imageUrl ||
    (Array.isArray(t.images) && (
      t.images[0]?.url ||
      t.images[0]?.urls?.[0] ||
      t.images[0]?.variants?.[0]?.url
    )) ||
    t.primaryPhoto?.small?.url ||
    null
  )
}

function getPrice(t) {
  // Prefer preformatted; otherwise try to build from amount/currency
  if (t.price) return t.price
  const amt =
    t.price?.fromPrice?.amount ??
    t.fromPrice?.amount ??
    t.amount
  const cur =
    t.price?.fromPrice?.currencyCode ??
    t.fromPrice?.currencyCode ??
    t.currencyCode
  return amt && cur ? `${amt} ${cur}` : null
}

function getLink(t) {
  // Use deep link if present; fallback to a Viator search with the title
  if (t.link) return t.link
  const q = encodeURIComponent(t.title || t.productCode || 'tour')
  return `https://www.viator.com/searchResults/all?keyword=${q}`
}

function TourCard({ tour }) {
  const href = getLink(tour)
  const thumb = getThumb(tour)
  const price = getPrice(tour)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500">
      <div className="relative aspect-[4/3] w-full bg-gray-50">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={tour.title || 'Tour image'}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-gray-400">
            No image
          </div>
        )}
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
      </div>
    </article>
  )
}
