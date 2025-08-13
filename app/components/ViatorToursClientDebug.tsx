'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface ViatorToursClientDebugProps {
  city: string;
  tours: ViatorTour[];
  destinationId: string | null;
  apiStatus: string;
  apiError: string | null;
  rawMeta: Record<string, unknown>;
}

interface ViatorTour {
  productCode: string;
  title?: string;
  reviews?: {
    combinedAverageRating?: number;
    totalReviews?: number;
  };
  pricing?: {
    summary?: {
      fromPrice?: number;
    };
  };
  duration?: {
    fixedDurationInMinutes?: number;
  };
}

/**
 * Client-side debug component for Viator tours
 * Only logs when ?debugViator=1 is present in the URL
 */
export default function ViatorToursClientDebug({ city, tours, destinationId, apiStatus, apiError, rawMeta }: ViatorToursClientDebugProps) {
  const searchParams = useSearchParams()
  const isDebugMode = searchParams?.get('debugViator') === '1'

  useEffect(() => {
    if (!isDebugMode) return

    console.group('🔍 [Viator Client Debug] Tours Data Received')
    console.log('City:', city)
    console.log('Destination ID:', destinationId)
    console.log('Tours Count:', tours?.length || 0)
    console.log('API Status:', apiStatus)
    
    if (apiError) {
      console.warn('API Error:', apiError)
    }
    
    if (rawMeta) {
      console.log('Raw Metadata:', rawMeta)
    }
    
    if (tours?.length > 0) {
      console.log('Tours Data:', tours)
      console.table(tours.map(tour => ({
        code: tour.productCode,
        title: (tour.title ?? 'No title').substring(0, 50) + '...',
        rating: tour.reviews?.combinedAverageRating,
        reviews: tour.reviews?.totalReviews,
        price: tour.pricing?.summary?.fromPrice,
        duration: Math.floor((tour.duration?.fixedDurationInMinutes || 0) / 60) + 'hrs'
      })))
    } else {
      console.warn('No tours data available')
    }
    
    console.groupEnd()
  }, [isDebugMode, city, tours, destinationId, apiStatus, apiError, rawMeta])

  // Debug mode indicator (only visible when debug is active)
  if (!isDebugMode) return null

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg z-50">
      🔍 Viator Debug Mode Active
    </div>
  )
}