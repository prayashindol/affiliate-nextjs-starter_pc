// Test page simulation to demonstrate the issue
import { fetchViatorTours } from './lib/viator.js';

async function simulateProductionScenario() {
  console.log('🔍 PRODUCTION SCENARIO SIMULATION');
  console.log('==================================\n');

  const testCity = "mu cang chai";
  
  console.log('Simulating production environment with invalid/missing API key...\n');

  console.log('SCENARIO: Page loads, detects Viator post, attempts to fetch tours');
  console.log('---------------------------------------------------------------');
  
  let viatorTours = [];
  let viatorMetadata = {};
  
  try {
    console.log(`Attempting to fetch Viator tours for city: ${testCity}`);
    const viatorResult = await fetchViatorTours({
      city: testCity,
      count: 9,
    });
    viatorTours = viatorResult.products || [];
    viatorMetadata = {
      destinationId: viatorResult.destinationId,
      apiStatus: viatorResult.apiStatus,
      apiError: viatorResult.apiError,
      rawMeta: viatorResult.rawMeta
    };
    console.log(`✅ API call succeeded: Found ${viatorTours.length} tours`);
  } catch (error) {
    console.log(`❌ API call failed: ${error.message}`);
    viatorTours = [];
    viatorMetadata = {
      destinationId: null,
      apiStatus: 'error',
      apiError: error.message,
      rawMeta: null
    };
  }

  console.log('\nRESULT:');
  console.log('- Tours array length:', viatorTours.length);
  console.log('- API status:', viatorMetadata.apiStatus);
  console.log('- API error:', viatorMetadata.apiError);
  
  console.log('\nVIATOR TOURS COMPONENT BEHAVIOR:');
  console.log('--------------------------------');
  
  if (!viatorTours?.length) {
    console.log('❌ ViatorTours component returns null (renders nothing)');
    console.log('   User sees: NO indication that tours should be there');
    console.log('   User experience: "Where are the tours?"');
  } else {
    console.log('✅ ViatorTours component renders tour cards');
    console.log(`   User sees: ${viatorTours.length} tour cards`);
  }
  
  console.log('\nPROBLEM IDENTIFIED:');
  console.log('===================');
  console.log('1. Invalid API key causes fetchViatorTours to fail');
  console.log('2. Empty tours array is passed to ViatorTours component');
  console.log('3. ViatorTours component returns null for empty array');
  console.log('4. User sees no tours and no error message');
  
  console.log('\nSOLUTION OPTIONS:');
  console.log('=================');
  console.log('A. PRIMARY: Fix the API key in production environment');
  console.log('B. SECONDARY: Improve error handling to show user-friendly message');
  console.log('   - Show "Tours unavailable" when API fails');
  console.log('   - Show loading state while fetching');
  console.log('   - Log errors for debugging');
}

simulateProductionScenario().catch(console.error);