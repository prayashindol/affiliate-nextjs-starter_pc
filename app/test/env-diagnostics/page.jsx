/**
 * Environment Variables Diagnostics Page
 * This page helps debug environment variable issues in Vercel deployments
 */

export default function EnvDiagnosticsPage() {
  // Server-side environment variables (only available in server components)
  const serverEnvVars = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VIATOR_API_KEY: process.env.VIATOR_API_KEY ? 'SET (hidden)' : 'NOT SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET (hidden)' : 'NOT SET',
  };

  // Client-side environment variables (available everywhere)
  const clientEnvVars = {
    NEXT_PUBLIC_SANITY_TOKEN: process.env.NEXT_PUBLIC_SANITY_TOKEN ? 'SET (hidden)' : 'NOT SET',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET',
  };

  // Test Sanity client configuration
  let sanityStatus = 'Unknown';
  try {
    const token = process.env.NEXT_PUBLIC_SANITY_TOKEN;
    if (!token) {
      sanityStatus = 'No token provided';
    } else if (token.startsWith('sk')) {
      sanityStatus = 'Valid token format (starts with sk)';
    } else {
      sanityStatus = 'Invalid token format (should start with sk)';
    }
  } catch (err) {
    sanityStatus = `Error: ${err.message}`;
  }

  // Test Viator API key
  let viatorStatus = 'Unknown';
  try {
    const apiKey = process.env.VIATOR_API_KEY;
    if (!apiKey) {
      viatorStatus = 'No API key provided';
    } else if (apiKey.length > 10) {
      viatorStatus = `Valid length (${apiKey.length} chars)`;
    } else {
      viatorStatus = 'Too short to be valid';
    }
  } catch (err) {
    viatorStatus = `Error: ${err.message}`;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Diagnostics</h1>
      
      <div className="space-y-6">
        {/* Server Environment Variables */}
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Server Environment Variables</h2>
          <p className="text-sm text-blue-600 mb-4">
            These are only available in server components and API routes
          </p>
          <div className="space-y-2">
            {Object.entries(serverEnvVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="font-mono text-sm">{key}:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  value && !value.includes('NOT SET') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {value || 'NOT SET'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Environment Variables */}
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Client Environment Variables</h2>
          <p className="text-sm text-green-600 mb-4">
            These are available in both server and client components (prefixed with NEXT_PUBLIC_)
          </p>
          <div className="space-y-2">
            {Object.entries(clientEnvVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="font-mono text-sm">{key}:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  value && !value.includes('NOT SET') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {value || 'NOT SET'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* API Status */}
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">API Configuration Status</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Sanity CMS:</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                sanityStatus.includes('Valid') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {sanityStatus}
              </span>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm mb-2">Viator API:</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                viatorStatus.includes('Valid') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {viatorStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Guide</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">If Viator API Key is NOT SET:</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                <li>Add <code className="bg-gray-200 px-1 rounded">VIATOR_API_KEY</code> (no NEXT_PUBLIC prefix)</li>
                <li>Set it for Production, Preview, and Development environments</li>
                <li>Redeploy your application</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">If Sanity Token is NOT SET:</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                <li>Add <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_SANITY_TOKEN</code> (with NEXT_PUBLIC prefix)</li>
                <li>Set it for Production, Preview, and Development environments</li>
                <li>The token should start with &apos;sk&apos; and be obtained from Sanity dashboard</li>
                <li>Redeploy your application</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Common Issues:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Environment variables not set for the correct Vercel environment (Production vs Preview)</li>
                <li>Missing NEXT_PUBLIC_ prefix for client-side variables</li>
                <li>Typos in variable names</li>
                <li>Need to redeploy after setting environment variables</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}