import { fetchViatorTours } from '../../../lib/viator.js';
import ViatorTours from '../../components/ViatorTours.jsx';

export default async function ViatorTestPage() {
  const city = 'motueka';
  
  // Fetch tours for Motueka
  const viatorResult = await fetchViatorTours({
    city: city,
    count: 6,
    preferReal: true // Try real API first, fall back to mock
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Viator Integration Test - {city}</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">API Test Results:</h2>
        <ul className="space-y-1">
          <li><strong>City:</strong> {city}</li>
          <li><strong>Destination ID:</strong> {viatorResult.destinationId || 'Not found'}</li>
          <li><strong>API Status:</strong> {viatorResult.apiStatus}</li>
          <li><strong>Products Found:</strong> {viatorResult.products?.length || 0}</li>
          {viatorResult.apiError && (
            <li><strong>Error:</strong> {viatorResult.apiError}</li>
          )}
        </ul>
      </div>

      {/* Render the actual Viator Tours component */}
      <ViatorTours
        city={city}
        tours={viatorResult.products}
        destinationId={viatorResult.destinationId}
        apiStatus={viatorResult.apiStatus}
        apiError={viatorResult.apiError}
        rawMeta={viatorResult.rawMeta}
      />
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Test Instructions:</h3>
        <p className="text-sm">
          This page demonstrates the Viator tours integration for Motueka. 
          If you see &quot;Tours Temporarily Unavailable&quot;, it means the API key is not configured. 
          If you see tour cards, the integration is working correctly.
        </p>
      </div>
    </div>
  );
}