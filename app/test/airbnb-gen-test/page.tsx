// Test page component to test regular AirbnbGenPost without Viator functionality
import React from 'react';
import AirbnbGenPost from '../../components/posts/AirbnbGenPost';

// Mock post data that simulates a regular airbnb-gen post
const mockRegularPost = {
  _type: "seoGenPost",
  title: "Complete Guide to Airbnb Hosting in San Francisco",
  slug: { current: "airbnb-hosting-san-francisco-guide" },
  category: ["airbnb-gen"],
  categories: [{ title: "SEO Gen", slug: { current: "airbnb-gen" } }],
  contentHtml: `
    <p>San Francisco is one of the most profitable markets for Airbnb hosting, with its high demand from business travelers and tourists. This comprehensive guide will help you maximize your earnings and provide exceptional guest experiences.</p>
    
    <p>From understanding local regulations to optimizing your pricing strategy, we'll cover everything you need to know to succeed as an Airbnb host in the Bay Area.</p>
    
    <h2>Understanding San Francisco Airbnb Regulations</h2>
    <p>San Francisco has specific regulations for short-term rentals that all hosts must follow. The city requires hosts to register with the Office of Short-Term Rentals and obtain the necessary permits.</p>
    
    <ul>
      <li>Register with the city for a short-term rental permit</li>
      <li>Limit stays to a maximum of 90 days per year if not owner-occupied</li>
      <li>Collect and remit the Transient Occupancy Tax</li>
      <li>Maintain liability insurance coverage</li>
    </ul>
    
    <h2>Optimal Pricing Strategies</h2>
    <p>Pricing your Airbnb correctly is crucial for maximizing revenue. San Francisco's market is dynamic, with prices varying significantly based on location, season, and local events.</p>
    
    <p>Consider using dynamic pricing tools and monitor competitor rates regularly. Peak seasons include summer months and major tech conferences when demand is highest.</p>
    
    <h2>Creating an Outstanding Guest Experience</h2>
    <p>Exceptional guest experiences lead to positive reviews and repeat bookings. Focus on cleanliness, communication, and thoughtful amenities that make your guests feel welcome.</p>
    
    <p>Provide local recommendations, ensure fast WiFi, and consider partnering with local businesses to offer exclusive discounts to your guests.</p>
  `,
  dateModified: "2024-01-20",
  datePublished: "2024-01-15",
  author: "Hosting Expert",
  description: "Complete guide to Airbnb hosting in San Francisco with regulations, pricing strategies, and guest experience tips.",
  excerpt: "Learn how to successfully host on Airbnb in San Francisco with our comprehensive guide covering regulations, pricing, and guest experience.",
  location: "San Francisco, California",
  postType: "Cleaner",
  mainImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  mainImageAsset: null
};

export default function AirbnbGenTestPage() {
  console.log('🧪 AIRBNB GEN TEST PAGE - Testing regular post component...');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info Panel */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-green-800 mb-2">🧪 AirbnbGenPost Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Post Detection:</strong>
              <ul className="mt-1 text-green-700">
                <li>• Type: {mockRegularPost._type}</li>
                <li>• Category: {mockRegularPost.category.join(', ')}</li>
                <li>• Post Type: {mockRegularPost.postType}</li>
                <li>• Has Main Image: ✅ Yes</li>
              </ul>
            </div>
            <div>
              <strong>Component Features:</strong>
              <ul className="mt-1 text-green-700">
                <li>• No Viator processing</li>
                <li>• Shows image only if available</li>
                <li>• Regular content cleanup</li>
                <li>• Affiliate banner support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Indicator */}
      <div className="max-w-4xl mx-auto mb-8 px-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-semibold mb-2">✅ AirbnbGenPost Component Working!</h3>
          <p className="text-green-700">
            This component handles regular airbnb-gen posts without any Viator-specific processing.
            Notice the image is displayed normally and there are no Viator tour injections.
          </p>
        </div>
      </div>
      
      {/* Render the actual post with regular AirbnbGenPost */}
      <AirbnbGenPost post={mockRegularPost} />
      
      {/* Debug footer */}
      <div className="max-w-4xl mx-auto mt-12 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <p><strong>Test Page Info:</strong> This page tests the AirbnbGenPost component with mock regular post data. No Viator processing should occur.</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "AirbnbGenPost Test - STR Specialist",
  description: "Test page for regular AirbnbGenPost component",
  robots: "noindex, nofollow"
};