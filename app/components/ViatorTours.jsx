// app/components/ViatorTours.jsx
'use client'
import React from 'react'

/**
 * Polished Viator tours grid.
 * Props:
 *  - tours: [{ productCode, title, shortDescription, price, thumbnail, link }]
 *  - city?: string
 *  - destinationId?: string
 *  - apiStatus?: 'success' | 'error' | 'no-destination' | 'mock' | 'exception'
 *  - apiError?: string | null
 *  - rawMeta?: any
 */
export default function ViatorTours({
  tours = [],
  city,
  destinationId,
  apiStatus,
  apiError,
  rawMeta,
}) {
  // If there’s an API state to communicate and no tours, show a soft message
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

function TourCard({ tour }) {
  const href = tour.link || '#'

  return (
    <a
      href={href}
      target={tour.link ? '_blank' : undefined}
      rel={tour.link ? 'nofollow noopener noreferrer' : undefined}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="relative aspect-[4/3] w-full bg-gray-50">
        {tour.thumbnail ? (
          // using plain <img> to avoid remotePatterns config friction
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tour.thumbnail}
            alt={tour.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-gray-400">
            No image
          </div>
        )}

        {tour.price && (
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow">
            {tour.price}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 group-hover:text-indigo-600">
          {tour.title}
        </h3>

        {tour.shortDescription && (
          <p className="mt-2 line-clamp-3 text-xs text-gray-600">{tour.shortDescription}</p>
        )}

        <div className="mt-4">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
            View details
          </span>
        </div>
      </div>
    </a>
  )
}
