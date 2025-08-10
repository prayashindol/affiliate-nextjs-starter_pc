'use client'

import React, { useState } from 'react'
import { ClockIcon, StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

function Stars({ rating = 0 }) {
  const rounded = Math.round(rating)
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1,2,3,4,5].map(i =>
          i <= rounded ? (
            <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
          )
        )}
      </div>
      <span className="text-sm font-medium text-yellow-600">{rating.toFixed(1)}</span>
    </div>
  )
}

function Expandable({ text, limit = 150 }) {
  const [expanded, setExpanded] = useState(false)
  if (!text) return null
  const truncated = text.length > limit ? text.slice(0, limit) + '...' : text
  const isTruncated = text.length > limit

  return (
    <div className="mt-3">
      <p className="text-sm text-gray-600 leading-relaxed">
        {expanded ? text : truncated}
        {isTruncated && (
          <button 
            type="button" 
            onClick={() => setExpanded(s => !s)} 
            className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium underline transition-colors duration-150"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>
    </div>
  )
}

export default function ViatorTours({ city, tours }) {
  if (!tours?.length) return null
  const heading = `${tours.length} Highest Rated Sight-Seeing Tours to Take in ${city}`

  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{heading}</h2>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour, idx) => (
          <article 
            key={tour.productCode || idx} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Tour Image */}
            {tour?.images?.[0]?.variants?.[3]?.url && (
              <div className="relative">
                <img
                  src={tour.images[0].variants[3].url}
                  alt={tour.title || 'Tour'}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="p-6">
              {/* Tour Title */}
              {tour?.title && (
                <h3 className="font-bold text-lg leading-tight text-gray-900 mb-3 line-clamp-2">
                  {tour.title}
                </h3>
              )}

              {/* Rating and Reviews */}
              {tour?.reviews?.totalReviews && tour?.reviews?.combinedAverageRating ? (
                <div className="flex items-center gap-2 mb-3">
                  <Stars rating={tour.reviews.combinedAverageRating} />
                  <span className="text-sm text-gray-500">
                    ({tour.reviews.totalReviews.toLocaleString()} reviews)
                  </span>
                </div>
              ) : null}

              {/* Duration */}
              {tour?.duration?.fixedDurationInMinutes ? (
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span>{Math.floor(tour.duration.fixedDurationInMinutes / 60)} hours</span>
                </div>
              ) : null}

              {/* Description */}
              <Expandable text={tour?.description} />

              {/* Price and Booking */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  {tour?.pricing?.summary?.fromPrice ? (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">From</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${tour.pricing.summary.fromPrice}
                      </span>
                    </div>
                  ) : <div></div>}

                  {tour?.productUrl ? (
                    <a 
                      href={tour.productUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-colors duration-200"
                    >
                      Book Now
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}