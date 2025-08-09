'use client'

import React, { useState } from 'react'

// NOTE: Update classes below to match existing SEO‑Gen card styles.
// If there is a shared Card component, import and use it here.

function Stars({ rating = 0 }) {
  const rounded = Math.round(rating)
  return (
    <span className="inline-flex gap-0.5 align-middle">
      {[1,2,3,4,5].map(i =>
        i <= rounded ? (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="gold" width="16" height="16" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431 8.167 1.182-5.916 5.811 1.397 8.143L12 18.896l-7.316 3.858 1.397-8.143L.165 9.2l8.167-1.182z"/>
          </svg>
        ) : (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="gold" strokeWidth="2" width="16" height="16" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431 8.167 1.182-5.916 5.811 1.397 8.143L12 18.896l-7.316 3.858 1.397-8.143L.165 9.2l8.167-1.182z"/>
          </svg>
        )
      )}
    </span>
  )
}

function Expandable({ text, limit = 250 }) {
  const [expanded, setExpanded] = useState(false)
  if (!text) return null
  const truncated = text.length > limit ? text.slice(0, limit) + '...' : text
  const isTruncated = truncated.length < text.length

  return (
    <div className="mt-2 text-sm text-gray-900">
      <span>{expanded ? text : truncated}</span>
      {isTruncated && (
        <button type="button" onClick={() => setExpanded(s => !s)} className="ml-1 font-bold underline">
          {expanded ? 'Less' : 'More'}
        </button>
      )}
    </div>
  )
}

export default function ViatorTours({ city, tours }) {
  if (!tours?.length) return null
  const heading = `${tours.length} Highest Rated Sight-Seeing Tours to Take in ${city}`

  return (
    <section className="my-10">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-4">{heading}</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour, idx) => (
          <article key={tour.productCode || idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {tour?.images?.[0]?.variants?.[3]?.url && (
              <img
                src={tour.images[0].variants[3].url}
                alt={tour.title || 'Tour'}
                className="w-full h-44 object-cover"
                loading="lazy"
              />
            )}

            <div className="p-3">
              {tour?.title && <h3 className="font-extrabold text-lg leading-snug">{tour.title}</h3>}

              {tour?.reviews?.totalReviews && tour?.reviews?.combinedAverageRating ? (
                <div className="mt-2 text-sm">
                  <a href={tour.productUrl} target="_blank" rel="noopener noreferrer" className="no-underline text-blue-600 inline-flex items-center gap-1">
                    <Stars rating={tour.reviews.combinedAverageRating} />
                    <span>({tour.reviews.totalReviews} reviews)</span>
                  </a>
                </div>
              ) : null}

              {tour?.duration?.fixedDurationInMinutes ? (
                <div className="mt-1 text-sm text-gray-600">
                  <span className="mr-1">🕘</span>
                  {Math.floor(tour.duration.fixedDurationInMinutes / 60)} hrs
                </div>
              ) : null}

              <Expandable text={tour?.description} />

              {tour?.pricing?.summary?.fromPrice ? (
                <p className="mt-2 font-bold">From: ${tour.pricing.summary.fromPrice}</p>
              ) : null}

              {tour?.productUrl ? (
                <a href={tour.productUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 bg-orange-500 text-white font-bold px-4 py-2 rounded">
                  Book Now
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}