'use client'

import ViatorTours from '../components/ViatorTours.jsx'

// Mock data from viator.js
const mockTours = [
  {
    productCode: "mock-tour-1",
    title: "Wenzhou Private Day Tour: Yandang Mountain and Tea Plantation",
    description: "Experience the natural beauty and culture of Wenzhou with this comprehensive day tour that takes you through stunning mountain landscapes and traditional tea plantations. Perfect for nature lovers and cultural enthusiasts alike.",
    images: [{
      variants: [null, null, null, {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }]
    }],
    reviews: {
      totalReviews: 156,
      combinedAverageRating: 4.5
    },
    duration: {
      fixedDurationInMinutes: 480
    },
    pricing: {
      summary: {
        fromPrice: 89
      }
    },
    productUrl: "https://www.viator.com/tours/wenzhou/mock-tour-1"
  },
  {
    productCode: "mock-tour-2", 
    title: "Historic Wenzhou Walking Tour",
    description: "Discover the rich history and culture of Wenzhou through this immersive walking experience that guides you through ancient temples, traditional markets, and historical sites. A perfect introduction to the city.",
    images: [{
      variants: [null, null, null, {
        url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }]
    }],
    reviews: {
      totalReviews: 89,
      combinedAverageRating: 4.8
    },
    duration: {
      fixedDurationInMinutes: 180
    },
    pricing: {
      summary: {
        fromPrice: 45
      }
    },
    productUrl: "https://www.viator.com/tours/wenzhou/mock-tour-2"
  },
  {
    productCode: "mock-tour-3",
    title: "Wenzhou Food and Culture Experience",
    description: "Immerse yourself in Wenzhou's culinary scene and cultural traditions with this authentic food tour that showcases local delicacies, traditional cooking techniques, and food markets.",
    images: [{
      variants: [null, null, null, {
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }]
    }],
    reviews: {
      totalReviews: 234,
      combinedAverageRating: 4.7
    },
    duration: {
      fixedDurationInMinutes: 240
    },
    pricing: {
      summary: {
        fromPrice: 67
      }
    },
    productUrl: "https://www.viator.com/tours/wenzhou/mock-tour-3"
  }
]

export default function TestViatorCards() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Viator Cards Test</h1>
      <ViatorTours city="Test City" tours={mockTours} />
    </div>
  )
}