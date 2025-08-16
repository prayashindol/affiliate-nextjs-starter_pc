// app/components/ViatorTours.jsx
'use client'
import React, { useState } from 'react'

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

function TourCard({ tour }) {
  const [expanded, setExpanded] = useState(false)
  const href = tour.link || '#'

  // desc clamp/expand
  const raw = tour.shortDescription || ''
  const SHORT = 180
  const isLong = raw.length > SHORT
  const shown = expanded ? raw : raw.slice(0, SHORT)
  const showReadMore = isLong

  return (
    <a
      href={href}
      target={tour.link ? '_blank' : undefined}
      rel={tour.link ? 'nofollow noopener noreferrer' : undefined}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full bg-gray-50">
        {tour.thumbnail ? (
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

        {/* price pill */}
        {tour.price && (
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow">
            {tour.price}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-base font-extrabold leading-6 text-gray-900 group-hover:text-indigo-600">
          {tour.title}
        </h3>

        {/* Meta row: stars + duration */}
        {(tour.rating || tour.reviewCount || tour.duration) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
            <Stars rating={tour.rating} />
            {typeof tour.reviewCount === 'number' && (
              <span className="text-gray-500">({tour.reviewCount} reviews)</span>
            )}
            {tour.duration && (
              <span className="flex items-center gap-1 before:content-['•'] before:text-gray-300 before:mx-1">
                <ClockIcon className="h-3 w-3" />
                {tour.duration}
              </span>
            )}
          </div>
        )}

        {/* Description with read more */}
        {raw && (
          <p className="mt-3 text-sm leading-6 text-gray-700">
            {shown}
            {showReadMore && !expanded && (
              <>
                …{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setExpanded(true)
                  }}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Read more
                </button>
              </>
            )}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4">
          <span className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            Book Now
          </span>
        </div>
      </div>
    </a>
  )
}

function Stars({ rating }) {
  if (!rating || rating <= 0) return null
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  const total = 5
  const items = []
  for (let i = 0; i < full; i++) items.push(<StarIcon key={`f${i}`} className="h-4 w-4 text-yellow-400" />)
  if (hasHalf) items.push(<StarHalfIcon key="h" className="h-4 w-4 text-yellow-400" />)
  while (items.length < total) items.push(<StarOutlineIcon key={`o${items.length}`} className="h-4 w-4 text-yellow-300" />)
  return <span className="inline-flex items-center">{items}</span>
}

/* Minimal inline icons (no deps) */
function StarIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
    </svg>
  )
}
function StarOutlineIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <path strokeWidth="1.5" d="m12 17.27-5.18 3.04 1.64-5.81-4.46-3.86 5.86-.5L12 4l2.14 6.14 5.86.5-4.46 3.86 1.64 5.81L12 17.27z" />
    </svg>
  )
}
function StarHalfIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        fill="url(#half)"
        stroke="currentColor"
        strokeWidth="0.5"
        d="m12 17.27-5.18 3.04 1.64-5.81-4.46-3.86 5.86-.5L12 4l2.14 6.14 5.86.5-4.46 3.86 1.64 5.81L12 17.27z"
      />
    </svg>
  )
}
function ClockIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-12.5a.75.75 0 00-1.5 0V10c0 .199.079.39.22.53l2.5 2.5a.75.75 0 001.06-1.06l-2.28-2.28V5.5z"/>
    </svg>
  )
}
