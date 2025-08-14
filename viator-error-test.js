// Test the error handling behavior of the Viator API integration
import { getViatorDestinationId } from './lib/viator.js';

async function testViatorErrorHandling() {
  console.log('🔍 VIATOR ERROR HANDLING TEST');
  console.log('==============================\n');

  const testCity = "mu cang chai";
  
  console.log('STEP 1: Test City Lookup');
  console.log('-------------------------');
  
  const destinationId = getViatorDestinationId(testCity);
  console.log('City:', testCity);
  console.log('Destination ID:', destinationId);
  console.log('Lookup result:', destinationId ? '✅ SUCCESS' : '❌ FAILED');
  console.log('');

  console.log('STEP 2: Environment Variable Analysis');
  console.log('--------------------------------------');
  
  const apiKey = process.env.VIATOR_API_KEY;
  console.log('VIATOR_API_KEY value:', apiKey);
  console.log('Is placeholder key:', apiKey === 'test-api-key-placeholder');
  console.log('');

  console.log('STEP 3: Simulate fetchViatorTours Call');
  console.log('---------------------------------------');
  
  console.log('Simulating what would happen in fetchViatorTours:');
  
  if (!apiKey) {
    console.log('❌ API key is not set - would throw error');
    console.log('   Error: "Viator API key is not set. Please set the VIATOR_API_KEY environment variable."');
    console.log('   apiStatus: "no_api_key"');
  } else if (apiKey === 'test-api-key-placeholder') {
    console.log('⚠️  API key is test placeholder - would make API call but receive 401/403 error');
    console.log('   This would result in:');
    console.log('   - API request made to Viator with invalid key');
    console.log('   - 401 Unauthorized or similar error response');
    console.log('   - apiStatus: "api_error"');
    console.log('   - Empty products array returned');
  } else {
    console.log('✅ API key appears to be real - would attempt actual API call');
  }
  
  console.log('');

  console.log('STEP 4: Component Behavior Analysis');
  console.log('------------------------------------');
  
  console.log('In ViatorGenPost component:');
  console.log('- If tours array is empty (due to API failure), injection still happens');
  console.log('- ViatorTours component handles empty array gracefully');
  console.log('- Should show "No tours available" or similar message');
  console.log('');

  console.log('STEP 5: Root Cause Analysis');
  console.log('----------------------------');
  
  if (destinationId && apiKey) {
    if (apiKey === 'test-api-key-placeholder') {
      console.log('🎯 ROOT CAUSE: Invalid Viator API Key');
      console.log('   SOLUTION: Replace VIATOR_API_KEY with a valid key from Viator');
      console.log('   IMPACT: API calls fail, no tours display');
    } else {
      console.log('🎯 Configuration appears correct - check API response');
    }
  } else {
    console.log('🎯 ROOT CAUSE: Missing configuration');
    if (!destinationId) console.log('   - City mapping not found');
    if (!apiKey) console.log('   - API key not set');
  }
  
  console.log('');
  console.log('NEXT STEPS FOR USER:');
  console.log('1. Obtain valid Viator API key from Viator Partner Portal');
  console.log('2. Set VIATOR_API_KEY environment variable in production (Vercel)');
  console.log('3. Verify tours appear on the live site');
}

testViatorErrorHandling().catch(console.error);