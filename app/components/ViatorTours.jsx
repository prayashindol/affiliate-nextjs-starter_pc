'use client'
import React from 'react'

/**
 * Viator Tours Grid (cards)
 * Mirrors your PHP image + link logic.
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

/** EXACT image resolution used by your PHP: images[0].variants[3].url with smart fallbacks */
function getThumb(t) {
  // shaped thumbnail first
  if (t.thumbnail) return t.thumbnail

  // raw array (exposed from shapeProduct)
  const img0 = t.images?.[0]
  const v = img0?.variants
  if (Array.isArray(v)) {
    return (
      v?.[3]?.url ||                                  // PHP-picked size
      v.find(x => x?.width >= 800)?.url ||            // large
      (v.at?.(-1)?.url || v[0]?.url) ||               // last/first available
      null
    )
  }

  return (
    img0?.url ||
    img0?.urls?.[0] ||
    t.primaryPhoto?.large?.url ||
    t.primaryPhoto?.medium?.url ||
    t.primaryPhoto?.small?.url ||
    null
  )
}

/** Price: prefer pricing.summary.fromPrice like PHP */
function getPrice(t) {
  if (t.price) return t.price // preformatted string from shapeProduct
  const fp = t.pricing?.summary?.fromPrice
  if (fp != null) return `$${fp}`
  return null
}

/** Link: prefer productUrl like PHP, else fallback */
function getLink(t) {
  if (t.productUrl) return t.productUrl
  if (t.link) return t.link
  const q = encodeURIComponent(t.title || t.productCode || 'tour')
  return `https://www.viator.com/searchResults/all?keyword=${q}`
}

/** Ratings (optional, mirrors PHP: totalReviews + combinedAverageRating) */
function Stars({ rating = 0 }) {
  const r = Math.round(rating)
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             className={`h-4 w-4 ${i <= r ? 'fill-yellow-400' : 'fill-none stroke-yellow-400'}`}
             strokeWidth="2">
          <path d="M12 .587 15.668 8.018 23.835 9.2l-5.916 5.811 1.397 8.143L12 18.896 4.684 23.154 6.081 15.011.165 9.2l8.167-1.182z"/>
        </svg>
      ))}
    </div>
  )
}

function TourCard({ tour }) {
  const href = getLink(tour)
  const thumb = getThumb(tour)
  const price = getPrice(tour)
  const totalReviews = tour.reviews?.totalReviews
  const rating = tour.reviews?.combinedAverageRating
  const minutes = tour.duration?.fixedDurationInMinutes
  const hours = minutes ? Math.floor(minutes / 60) : null

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

        {/* ratings + duration row */}
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
          {rating ? (
            <a href={href} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              <Stars rating={rating} />
              {totalReviews != null && <span>({totalReviews} reviews)</span>}
            </a>
          ) : null}
          {hours != null && <span className="ml-auto">🕒 {hours} hrs</span>}
        </div>

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
            Learn more
            <svg className="ml-1 h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M12.293 3.293a1 1 0 0 1 1.414 0l4.999 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 1 1-1.414-1.414L15.586 11H2a1 1 0 1 1 0-2h13.586l-3.293-3.293a1 1 0 0 1 0-1.414z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}
