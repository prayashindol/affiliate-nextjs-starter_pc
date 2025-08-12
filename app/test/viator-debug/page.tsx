// Test page component to debug Viator integration without Sanity dependency
import React from 'react';
import ViatorGenPost from '../../components/posts/ViatorGenPost';
import { fetchViatorTours } from '@/lib/viator';

// Mock post data that simulates a real Viator post
const mockViatorPost = {
  _type: "seoGenPostViator",
  title: "Best Things to Do in London - Complete Travel Guide",
  slug: { current: "best-things-to-do-in-london" },
  city: "london",
  category: ["airbnb-gen-viator"],
  categories: [{ title: "SEO Gen Viator", slug: { current: "airbnb-gen-viator" } }],
  contentHtml: `
    <p>London is one of the world's most exciting cities, offering an incredible blend of history, culture, and modern attractions. Whether you're visiting for the first time or returning to explore more, this comprehensive guide will help you discover the best experiences the city has to offer.</p>
    
    <p>From iconic landmarks like Big Ben and the Tower of London to hidden gems in charming neighborhoods, London has something for every type of traveler. In this guide, we'll cover the must-see attractions, best areas to stay, transportation tips, and insider secrets to make your visit unforgettable.</p>
    
    <h2>Top Tourist Attractions in London</h2>
    <p>London's most famous attractions are world-renowned for good reason. The Tower of London houses the Crown Jewels and centuries of fascinating history, while Westminster Abbey has been the site of royal coronations for nearly 1,000 years.</p>
    
    <ul>
      <li>Book tickets online in advance to skip the queues</li>
      <li>Consider purchasing a London Pass for multiple attractions</li>
      <li>Visit during weekdays when possible to avoid crowds</li>
      <li>Allow extra time for security checks at major sites</li>
    </ul>
    
    <p>The London Eye offers breathtaking 360-degree views of the city, especially stunning at sunset. For art lovers, the British Museum houses treasures from around the world, including the Rosetta Stone and Egyptian mummies.</p>
    
    <h2>Best Areas to Stay in London</h2>
    <p>Choosing the right neighborhood can make or break your London experience. Central areas like Covent Garden and South Kensington offer easy access to major attractions, while areas like Shoreditch and Camden provide a more local, hip atmosphere.</p>
    
    <p>For first-time visitors, staying near Zone 1 tube stations is recommended. This gives you quick access to most major attractions while still experiencing authentic London neighborhoods.</p>
    
    <h2>Getting Around London</h2>
    <p>London's public transportation system is one of the world's best. The Underground (Tube) connects virtually every corner of the city, while buses offer scenic routes above ground.</p>
    
    <p>Purchase an Oyster Card or use contactless payment for the most economical fares. Walking is also a great way to explore central London, as many attractions are closer than they appear on the map.</p>
  `,
  dateModified: "2024-01-15",
  datePublished: "2024-01-10",
  author: "Travel Expert",
  description: "Discover the best things to do in London with our comprehensive travel guide. From iconic landmarks to hidden gems, find everything you need for an unforgettable visit.",
  excerpt: "Complete guide to London's top attractions, best neighborhoods, and travel tips for an amazing visit to the UK's capital city.",
  location: "London, United Kingdom",
  postType: "Travel Guide",
  mainImage: {
    asset: null,
    alt: "London skyline with Big Ben and Thames"
  },
  mainImageAsset: {
    asset: null,
    alt: "London skyline with Big Ben and Thames"
  }
};

interface DebugInfo {
  isViatorPost?: boolean;
  city?: string;
  shouldFetchTours?: boolean;
  toursFound?: number;
  destinationId?: string;
  error?: string;
}

export default async function ViatorTestPage() {
  console.log('🧪 VIATOR TEST PAGE - Starting fetch...');
  
  let viatorTours: unknown[] = [];
  let errorMessage: string | null = null;
  const debugInfo: DebugInfo = {};
  
  try {
    // Simulate the same logic as the real page
    const isViatorPost = 
      mockViatorPost._type === "seoGenPostViator" || 
      (Array.isArray(mockViatorPost.category) && mockViatorPost.category.includes('airbnb-gen-viator'));
    
    debugInfo.isViatorPost = isViatorPost;
    debugInfo.city = mockViatorPost.city;
    debugInfo.shouldFetchTours = isViatorPost && mockViatorPost.city;
    
    console.log('🎯 Viator detection results:', debugInfo);
    
    if (isViatorPost && mockViatorPost.city) {
      console.log(`🚀 Attempting to fetch Viator tours for city: ${mockViatorPost.city}`);
      
      const viatorResult = await fetchViatorTours({
        city: mockViatorPost.city,
        count: 9,
      });
      
      viatorTours = viatorResult.products || [];
      debugInfo.toursFound = viatorTours.length;
      debugInfo.destinationId = viatorResult.destinationId;
      
      console.log(`✅ Successfully fetched ${viatorTours.length} tours`);
      console.log('📊 Tours data:', viatorTours);
      
    } else {
      console.log('❌ Not fetching tours - either not a Viator post or no city specified');
    }
    
  } catch (error: unknown) {
    console.error('💥 Error fetching Viator tours:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    errorMessage = errorMsg;
    debugInfo.error = errorMsg;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info Panel */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">🧪 Viator Integration Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Post Detection:</strong>
              <ul className="mt-1 text-blue-700">
                <li>• Type: {mockViatorPost._type}</li>
                <li>• City: {mockViatorPost.city}</li>
                <li>• Is Viator Post: {debugInfo.isViatorPost ? '✅ Yes' : '❌ No'}</li>
                <li>• Should Fetch Tours: {debugInfo.shouldFetchTours ? '✅ Yes' : '❌ No'}</li>
              </ul>
            </div>
            <div>
              <strong>API Results:</strong>
              <ul className="mt-1 text-blue-700">
                <li>• Tours Found: {debugInfo.toursFound || 0}</li>
                <li>• Destination ID: {debugInfo.destinationId || 'N/A'}</li>
                {errorMessage && <li className="text-red-600">• Error: {errorMessage}</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tours Success/Failure Indicator */}
      <div className="max-w-4xl mx-auto mb-8 px-4">
        {viatorTours.length > 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-semibold mb-2">✅ Viator Integration Working!</h3>
            <p className="text-green-700">
              Successfully fetched {viatorTours.length} tours for {mockViatorPost.city}. 
              Tours should appear before the second heading in the content below.
            </p>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold mb-2">❌ Viator Integration Issue</h3>
            <p className="text-red-700">
              No tours were fetched. This could indicate:
            </p>
            <ul className="text-red-700 mt-2 list-disc list-inside">
              <li>Viator API key is missing or invalid</li>
              <li>Network connectivity issues</li>
              <li>City not found in destination mapping</li>
              <li>API rate limiting or service unavailable</li>
            </ul>
            {errorMessage && (
              <div className="mt-2 p-2 bg-red-100 rounded text-red-800 font-mono text-sm">
                Error: {errorMessage}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Render the actual post with Viator integration */}
      <ViatorGenPost 
        post={mockViatorPost} 
        viatorTours={viatorTours} 
        city={mockViatorPost.city} 
      />
      
      {/* Debug footer */}
      <div className="max-w-4xl mx-auto mt-12 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <p><strong>Test Page Info:</strong> This page bypasses Sanity CMS and uses mock post data to test only the Viator tours integration. If tours appear above, the integration is working correctly.</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Viator Integration Test - STR Specialist",
  description: "Test page for debugging Viator tours integration",
  robots: "noindex, nofollow"
};