"use client";

import React, { useState } from "react";

/**
 * Props:
 * - city: string
 * - destinationId: string | null
 * - tours: Array<{
 *     productCode, title, shortDescription, thumbnail,
 *     duration, price, reviewCount, rating, link
 *   }>
 * - apiStatus, apiError, rawMeta
 */
export default function ViatorTours({
  city,
  destinationId,
  tours = [],
  apiStatus,
  apiError,
  rawMeta,
}) {
  if (apiStatus === "no-destination") {
    return (
      <section className="my-10">
        <h2 className="text-2xl font-bold mb-4">
          Popular Tours in {city}
        </h2>
        <p className="text-sm text-gray-500">
          No destination mapping for this city.
        </p>
      </section>
    );
  }

  if (apiStatus === "error" || apiStatus === "exception") {
    return (
      <section className="my-10">
        <h2 className="text-2xl font-bold mb-4">
          Popular Tours in {city}
        </h2>
        <p className="text-sm text-red-600">
          Tours temporarily unavailable. {apiError || "Please try again later."}
        </p>
      </section>
    );
  }

  if (!tours.length) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="text-3xl font-extrabold tracking-tight mb-6">
        9 Highest Rated Sight-Seeing Tours to Take in {city}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((t) => (
          <TourCard key={t.productCode} tour={t} />
        ))}
      </div>
    </section>
  );
}

function TourCard({ tour }) {
  const [expanded, setExpanded] = useState(false);

  const {
    title,
    thumbnail,
    shortDescription,
    duration,
    price,
    reviewCount,
    rating,
    link,
  } = tour;

  const desc = expanded
    ? shortDescription.replace(/<span class="read-more">.*?<\/span>/, "")
    : shortDescription;

  return (
    <article className="group flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-sm text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        <h3 className="font-semibold text-lg leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Meta row: rating + duration */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <Stars rating={rating} />
          <span className="text-gray-500">
            {typeof reviewCount === "number" ? `(${reviewCount} reviews)` : null}
          </span>

          {duration ? (
            <span className="ml-auto inline-flex items-center gap-1 whitespace-nowrap">
              <ClockIcon className="h-4 w-4" />
              {duration}
            </span>
          ) : null}
        </div>

        {/* Description */}
        <p
          className={`text-sm text-gray-700 ${expanded ? "" : "line-clamp-4"}`}
          dangerouslySetInnerHTML={{ __html: desc }}
        />

        {/* Read more toggle (only if we truncated) */}
        {shortDescription.includes('read-more') && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="self-start text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Footer row: price + CTA */}
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-gray-900">
            {price ? <span className="font-semibold">From: {price}</span> : <span>&nbsp;</span>}
          </div>

          {link ? (
            <a
              href={link}
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Book Now
            </a>
          ) : (
            <span className="text-xs text-gray-400">Link unavailable</span>
          )}
        </div>
      </div>
    </article>
  );
}

function Stars({ rating }) {
  if (!rating || rating <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-gray-400">
        <StarIcon className="h-4 w-4" />
        No reviews
      </span>
    );
  }
  // Render 5 stars with partial fill (simple nearest-half approach)
  const normalized = Math.max(0, Math.min(5, rating));
  const full = Math.floor(normalized);
  const half = normalized - full >= 0.5 ? 1 : 0;

  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={`f${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {half ? <StarHalfIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : null}
      {Array.from({ length: 5 - full - half }).map((_, i) => (
        <StarIcon key={`e${i}`} className="h-4 w-4 text-gray-300" />
      ))}
    </span>
  );
}

/** Simple SVG icons (no external deps) */
function StarIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M10 15.27l-5.18 3.05 1.4-5.99L1 7.97l6.09-.52L10 1.5l2.91 5.95 6.09.52-5.22 4.36 1.4 5.99L10 15.27z" />
    </svg>
  );
}
function StarHalfIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M10 15.27l-5.18 3.05 1.4-5.99L1 7.97l6.09-.52L10 1.5l2.91 5.95 6.09.52-5.22 4.36 1.4 5.99L10 15.27z"
        fill="url(#half)"
      />
      <path
        d="M10 15.27l-5.18 3.05 1.4-5.99L1 7.97l6.09-.52L10 1.5l2.91 5.95 6.09.52-5.22 4.36 1.4 5.99L10 15.27z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-yellow-400"
      />
    </svg>
  );
}
function ClockIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 7v5l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
