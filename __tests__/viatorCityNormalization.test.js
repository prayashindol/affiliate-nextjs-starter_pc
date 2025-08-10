// Test for city name normalization with special characters in lib/viator.js
import { getViatorDestinationId } from '../lib/viator.js';

function testViatorCityNormalization() {
  console.log('🧪 Testing Viator city normalization with special characters...');
  
  // Test cases with HTML entities that are causing issues
  const testCases = [
    // Main problematic cities from the issue
    {
      input: 'monterey &amp; carmel',
      expected: '5250',
      description: 'Monterey & Carmel with &amp; entity'
    },
    {
      input: 'napa &amp; sonoma', 
      expected: '914',
      description: 'Napa & Sonoma with &amp; entity'
    },
    {
      input: 'cairns &amp; the tropical north',
      expected: '754', 
      description: 'Cairns & the tropical north with &amp; entity'
    },
    // Verify normal ampersands still work
    {
      input: 'monterey & carmel',
      expected: '5250',
      description: 'Monterey & Carmel with normal ampersand'
    },
    {
      input: 'napa & sonoma',
      expected: '914',
      description: 'Napa & Sonoma with normal ampersand'
    },
    // NEW: Test cities without ampersands (as they appear in Sanity database)
    {
      input: 'monterey carmel',
      expected: '5250',
      description: 'Monterey Carmel without ampersand (database format)'
    },
    {
      input: 'napa sonoma',
      expected: '914',
      description: 'Napa Sonoma without ampersand (database format)'
    },
    {
      input: 'cairns the tropical north',
      expected: '754',
      description: 'Cairns the tropical north without ampersand (database format)'
    },
    // Test other special character entities
    {
      input: 'test &lt;city&gt;',
      expected: null,
      description: 'City with &lt; and &gt; entities (non-existent city)'
    },
    {
      input: 'test &quot;quoted&quot; city',
      expected: null,
      description: 'City with &quot; entities (non-existent city)'
    },
    {
      input: 'test&#39;s city',
      expected: null,
      description: 'City with &#39; entity (non-existent city)'
    },
    // Test that normalization handles case and whitespace
    {
      input: '  MONTEREY &AMP; CARMEL  ',
      expected: '5250',
      description: 'Monterey & Carmel with uppercase and extra whitespace'
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  testCases.forEach((testCase, index) => {
    console.log(`\n📋 Test ${index + 1}: ${testCase.description}`);
    console.log(`   Input: "${testCase.input}"`);
    
    const result = getViatorDestinationId(testCase.input);
    const passed = result === testCase.expected;
    
    console.log(`   Expected: ${testCase.expected}`);
    console.log(`   Got: ${result}`);
    console.log(`   ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (passed) {
      passedTests++;
    }
  });

  console.log(`\n🎯 Test Summary: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All city normalization tests passed!');
    return true;
  } else {
    console.log('⚠️  Some tests failed - review HTML entity decoding implementation');
    return false;
  }
}

// Run the test
testViatorCityNormalization();