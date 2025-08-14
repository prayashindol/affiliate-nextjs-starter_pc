'use client'

import React, { useState, Suspense } from 'react'
import ViatorToursClientDebug from './ViatorToursClientDebug'

export default function ViatorTours({ city, tours, destinationId, apiStatus, apiError, rawMeta }) {
  // Show error message only if there was an API issue (not just no tours found)
  if (!tours?.length && apiStatus && apiStatus !== 'success' && apiStatus !== 'no_products') {
    return (
      <section className="my-12">
        <Suspense fallback={null}>
          <ViatorToursClientDebug 
            city={city}
            tours={tours || []}
            destinationId={destinationId}
            apiStatus={apiStatus}
            apiError={apiError}
            rawMeta={rawMeta}
          />
        </Suspense>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Tours Temporarily Unavailable</h2>
          <p className="text-gray-600">
            We&apos;re currently unable to load tours for {city}. Please check back later.
          </p>
          {process.env.NODE_ENV === 'development' && apiError && (
            <p className="mt-2 text-sm text-red-600 font-mono">
              Debug: {apiError}
            </p>
          )}
        </div>
      </section>
    )
  }
  
  // If no tours but no error, just return null (might be intentionally no tours for this city)
  if (!tours?.length) return null
  
  // Match the heading logic from PHP code
  const tour_count = tours.length
  const heading = tour_count > 1
    ? `${tour_count} Highest Rated Sight-Seeing Tours to Take in ${city}`
    : `Highest Rated Sight-Seeing Tour to Take in ${city}`

  return (
    <section className="my-12">
      {/* Debug component - only shows when ?debugViator=1 */}
      <Suspense fallback={null}>
        <ViatorToursClientDebug 
          city={city}
          tours={tours}
          destinationId={destinationId}
          apiStatus={apiStatus}
          apiError={apiError}
          rawMeta={rawMeta}
        />
      </Suspense>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{heading}</h2>

      <div className="viator-tours grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour, idx) => (
          <article 
            key={tour.productCode || idx} 
            className="tour-item bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
          >
            {/* Tour Image - matches PHP: tour.images[0].variants[3].url */}
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

            <div className="px-4 pb-4 pt-2 flex flex-col flex-grow">
              {/* Tour Title - matches PHP: tour.title */}
              {tour?.title && (
                <h3
                  className="font-bold text-lg leading-tight text-gray-900 mb-3"
                  style={{
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {tour.title}
                </h3>
              )}

              {/* Rating and Reviews - matches PHP logic exactly */}
              {tour?.reviews?.totalReviews && tour?.reviews?.combinedAverageRating && tour?.productUrl ? (
                <div className="reviews mb-2">
                  <a 
                    href={tour.productUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 no-underline flex items-center text-sm"
                  >
                    {/* SVG stars - exactly matching PHP logic */}
                    <div className="flex items-center mr-2">
                      {[1,2,3,4,5].map(i => {
                        const stars = Math.round(tour.reviews.combinedAverageRating)
                        return i <= stars ? (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="gold" width="16" height="16" viewBox="0 0 24 24" className="mr-0.5">
                            <path d="M12 .587l3.668 7.431 8.167 1.182-5.916 5.811 1.397 8.143L12 18.896l-7.316 3.858 1.397-8.143L.165 9.2l8.167-1.182z"/>
                          </svg>
                        ) : (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="lightgray" width="16" height="16" viewBox="0 0 24 24" className="mr-0.5">
                            <path d="M12 .587l3.668 7.431 8.167 1.182-5.916 5.811 1.397 8.143L12 18.896l-7.316 3.858 1.397-8.143L.165 9.2l8.167-1.182z"/>
                          </svg>
                        )
                      })}
                    </div>
                    <span>{tour.reviews.totalReviews.toLocaleString()} reviews</span>
                  </a>
                </div>
              ) : null}

              {/* Duration - matches PHP: tour.duration.fixedDurationInMinutes */}
              {tour?.duration?.fixedDurationInMinutes ? (
                <div className="duration flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <span className="clock-icon mr-1">🕒</span>
                  <span>{Math.floor(tour.duration.fixedDurationInMinutes / 60)} hrs</span>
                </div>
              ) : null}

              {/* Description - matches PHP: tour.description with truncation */}
              {tour?.description && (
                <div className="description mb-3 flex-grow">
                  <ExpandableDescription text={tour.description} />
                </div>
              )}

              {/* Price and Button Container - pushes button to bottom */}
              <div className="mt-auto">
                {/* Price - matches PHP: tour.pricing.summary.fromPrice */}
                {tour?.pricing?.summary?.fromPrice ? (
                  <p className="price mb-3">
                    <strong>From: ${tour.pricing.summary.fromPrice}</strong>
                  </p>
                ) : null}

                {/* Book Now Button - matches PHP: tour.productUrl */}
                {tour?.productUrl ? (
                  <a 
                    className="book-now inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-colors duration-200 w-full text-center"
                    href={tour.productUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Now
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// Component for expandable description matching PHP JavaScript logic
function ExpandableDescription({ text, truncateAt = 250 }) {
  const [expanded, setExpanded] = useState(false)
  
  if (!text) return null
  
  const shouldTruncate = text.length > truncateAt
  const displayText = shouldTruncate && !expanded 
    ? text.substring(0, truncateAt) + '...' 
    : text

  return (
    <div>
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
        {displayText}
        {shouldTruncate && (
          <span 
            className="more-link ml-1 font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Less' : 'More'}
          </span>
        )}
      </p>
    </div>
  )
}