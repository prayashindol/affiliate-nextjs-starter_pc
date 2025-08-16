'use client';

import React, { useMemo, useState } from 'react';

/**
 * Props:
 * - city?: string
 * - tours: Array<{
 *     productCode: string
 *     title: string
 *     thumbnail?: string | null
 *     description?: string           // optional full text if you add it
 *     shortDescription?: string      // plain text (fallback)
 *     rating?: number | null         // 0–5 (combinedAverageRating)
 *     totalReviews?: number          // totalReviews
 *     duration?: string | null       // e.g. "3 hrs", "2 hrs 30 min"
 *     price?: string | null          // e.g. "$129.00"
 *     link?: string | null           // productUrl (preferred)
 *   }>
 * - destinationId?: string | null    // used for deep-link fallback
 * - apiStatus?: 'success'|'mock'|'error'|'no-destination'|'exception'|string
 * - apiError?: string | null
 * - rawMeta?: any
 */
export default function ViatorTours({
  city,
  tours = [],
  destinationId,
  apiStatus,
  apiError,
}) {
  const [expanded, setExpanded] = useState({}); // productCode -> boolean

  const heading = useMemo(() => {
    const n = Array.isArray(tours) ? tours.length : 0;
    if (!city || n === 0) return null;
    return n === 1
      ? `Highest Rated Sight-Seeing Tour to Take in ${city}`
      : `${n} Highest Rated Sight-Seeing Tours to Take in ${city}`;
  }, [city, tours]);

  if (!tours || tours.length === 0) {
    return (
      <div className="max-w-5xl mx-auto my-10">
        <h2 className="text-2xl font-semibold mb-3">Experiences</h2>
        <div className="text-sm text-gray-600">
          {apiStatus === 'no-destination' && 'No destination mapping for this city.'}
          {apiStatus === 'mock' && 'Showing mock tours (testing or missing API key).'}
          {apiStatus === 'error' && `Tours temporarily unavailable. ${apiError || ''}`}
          {apiStatus === 'exception' && 'Unexpected error loading tours.'}
          {apiStatus === 'success' && 'No tours returned for this destination.'}
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto my-12">
      {heading && (
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">
          {heading}
        </h2>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((p) => {
          const code = p.productCode || Math.random().toString(36).slice(2);
          const isOpen = !!expanded[code];

          // Prefer full description if present, else shortDescription
          const full = (p.description || p.shortDescription || '').trim();
          const limit = 220;
          const needsClamp = full.length > limit;
          const preview = needsClamp ? full.slice(0, limit).trimEnd() + '…' : full;

          // Prefer productUrl from API; fallback to classic deep link
          const href =
            p.link ||
            (destinationId && p.productCode
              ? `https://www.viator.com/tours/${destinationId}/${encodeURIComponent(
                  p.productCode
                )}`
              : null);

          return (
            <article
              key={code}
              className="flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden"
            >
              {/* Image */}
              {p.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-48 w-full bg-gray-100" />
              )}

              <div className="p-4 flex flex-col gap-3">
                {/* Title */}
                <h3 className="text-lg font-semibold leading-snug line-clamp-3">
                  {p.title}
                </h3>

                {/* Meta row: rating + reviews, duration, price */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                  <Rating rating={p.rating} total={p.totalReviews} />
                  {p.duration && (
                    <span className="inline-flex items-center">
                      <ClockIcon className="mr-1 h-4 w-4" />
                      {p.duration}
                    </span>
                  )}
                  {p.price && (
                    <span className="ml-auto font-medium text-gray-900">
                      From {p.price}
                    </span>
                  )}
                </div>

                {/* Description with inline Read more */}
                {full && (
                  <p className="text-sm text-gray-700">
                    {isOpen ? full : preview}{' '}
                    {needsClamp && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded((s) => ({ ...s, [code]: !isOpen }))
                        }
                        className="font-semibold text-indigo-600 hover:text-indigo-700 focus:outline-none"
                        aria-label={isOpen ? 'Show less' : 'Read more'}
                      >
                        {isOpen ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </p>
                )}

                {/* CTA */}
                <div className="mt-2">
                  <a
                    href={href || '#'}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      if (!href) e.preventDefault();
                    }}
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Small presentational helpers ---------- */

function Rating({ rating, total }) {
  // rating: 0–5 (can be decimal) ; total: integer
  const r = typeof rating === 'number' ? Math.max(0, Math.min(5, rating)) : 0;
  const filled = Math.round(r); // simple: round to nearest whole star
  return (
    <span className="inline-flex items-center">
      <span className="mr-1 inline-flex">
        {Array.from({ length: 5 }).map((_, i) =>
          i < filled ? <StarSolid key={i} /> : <StarOutline key={i} />
        )}
      </span>
      <span className="text-gray-700">
        {total && total > 0 ? `(${total} reviews)` : 'No reviews'}
      </span>
    </span>
  );
}

function StarSolid() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 text-yellow-400"
      fill="currentColor"
    >
      <path d="M10 1.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1L10 15.8 4.6 18.3l1-6.1L1.2 7.9l6.1-.9L10 1.5z" />
    </svg>
  );
}

function StarOutline() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 text-yellow-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M10 1.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1L10 15.8 4.6 18.3l1-6.1L1.2 7.9l6.1-.9L10 1.5z" />
    </svg>
  );
}

function ClockIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
