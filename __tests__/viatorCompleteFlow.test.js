// Test to simulate the complete Viator integration flow
import { load } from 'cheerio';

const testPost = {
  _type: "seoGenPostViator",
  title: "Best Things to Do in London",
  slug: { current: "best-things-to-do-in-london" },
  city: "london",
  category: ["airbnb-gen-viator"],
  contentHtml: `
    <p>London is a vibrant city with countless attractions for every type of traveler.</p>
    <p>From historic landmarks to modern entertainment, this guide covers all the must-see spots.</p>
    <h2>Top Tourist Attractions in London</h2>
    <p>The Tower of London is one of the most famous historical sites in the city.</p>
    <ul>
      <li>Book tickets online to skip the queues</li>
      <li>Allow at least 3 hours for your visit</li>
    </ul>
    <h2>Best Neighborhoods to Explore</h2>
    <p>Each area of London has its own unique character and attractions.</p>
  `,
  dateModified: "2024-01-15",
  author: "Travel Expert"
};

const mockTours = [
  {
    productCode: "london-tour-1",
    title: "London Eye Fast-Track Experience",
    description: "Skip the line and enjoy panoramic views of London from the iconic London Eye.",
    images: [{
      variants: [null, null, null, {
        url: "https://cache.viator.com/london-eye.jpg"
      }]
    }],
    reviews: {
      totalReviews: 2834,
      combinedAverageRating: 4.6
    },
    duration: {
      fixedDurationInMinutes: 30
    },
    pricing: {
      summary: {
        fromPrice: 35
      }
    },
    productUrl: "https://www.viator.com/tours/london/london-eye-1"
  },
  {
    productCode: "london-tour-2",
    title: "Tower of London and Crown Jewels Tour",
    description: "Explore the historic Tower of London and see the Crown Jewels collection.",
    images: [{
      variants: [null, null, null, {
        url: "https://cache.viator.com/tower-london.jpg"
      }]
    }],
    reviews: {
      totalReviews: 1967,
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
    productUrl: "https://www.viator.com/tours/london/tower-london-2"
  }
];

console.log('🚀 COMPLETE VIATOR INTEGRATION FLOW TEST');
console.log('================================================================================\n');

// Step 1: Post detection (from app/[slug]/page.jsx)
function testPostDetection(post) {
  console.log('STEP 1: Post Detection');
  console.log('-----------------------');
  
  const viatorByStringCategory =
    Array.isArray(post?.category) && post.category.includes('airbnb-gen-viator');

  const viator =
    post?._type === "seoGenPostViator" ||
    viatorByStringCategory;
  
  console.log('Post _type:', post?._type);
  console.log('Post categories:', post?.category);
  console.log('viatorByStringCategory:', viatorByStringCategory);
  console.log('Final viator flag:', viator);
  console.log('Post city:', post?.city);
  console.log('Should fetch tours:', viator && post?.city);
  
  return { shouldFetchTours: viator && post?.city, city: post?.city };
}

// Step 2: Viator API simulation (from lib/viator.js)
function simulateViatorAPI(city, tours = mockTours) {
  console.log('\nSTEP 2: Viator API Simulation');
  console.log('------------------------------');
  
  console.log(`Attempting to fetch tours for city: ${city}`);
  
  // Simulate the destination mapping (using some sample mappings for testing)
  const cityMap = {
    'london': '77', // London's destination ID
    'paris': '76',  // Paris destination ID
    'rome': '187',   // Rome destination ID
    'motueka': '51839' // Sample mapping for testing
  };
  
  const destinationId = cityMap[city.toLowerCase()];
  if (!destinationId) {
    console.log(`❌ No destination ID found for city: ${city}`);
    return { products: [], destinationId: null };
  }
  
  console.log(`✅ Found destination ID: ${destinationId} for city: ${city}`);
  console.log(`✅ Successfully fetched ${tours.length} tours`);
  
  return { products: tours, destinationId };
}

// Step 3: Tour injection (from app/components/SeoGenPost.jsx)
function testTourInjection(htmlContent, tours) {
  console.log('\nSTEP 3: Tour Injection');
  console.log('-----------------------');
  
  console.log('Original content has H2 elements:', (htmlContent.match(/<h2/g) || []).length);
  console.log('Tours to inject:', tours.length);
  
  if (tours.length === 0) {
    console.log('❌ No tours to inject');
    return { success: false, injectedHtml: htmlContent };
  }
  
  // Simulate the injection function
  function injectViatorToursBeforeSecondHeading(htmlContent, viatorToursComponent) {
    if (!viatorToursComponent || !htmlContent) return htmlContent;

    const $ = load(htmlContent);
    
    // Remove any existing injection points to prevent duplicates
    $('#viator-tours-injection-point').remove();
    
    const h2Elements = $('h2');
    
    if (h2Elements.length > 0) {
      const firstH2 = h2Elements.eq(0);
      
      let injectionTarget = firstH2;
      let insertMethod = 'before';
      
      // Check if there's meaningful content before the first H2
      const contentBeforeH2 = [];
      let prevElement = firstH2.prev();
      
      while (prevElement.length) {
        contentBeforeH2.unshift(prevElement[0]);
        prevElement = prevElement.prev();
      }
      
      // Find the last meaningful content element before the H2
      if (contentBeforeH2.length > 0) {
        for (let i = contentBeforeH2.length - 1; i >= 0; i--) {
          const el = $(contentBeforeH2[i]);
          if (el.is('p, ul, ol, div') && el.text().trim().length > 50) {
            injectionTarget = el;
            insertMethod = 'after';
            break;
          }
        }
      }
      
      // Create injection point
      if (insertMethod === 'after') {
        injectionTarget.after('<div id="viator-tours-injection-point"><!-- VIATOR TOURS WILL BE INSERTED HERE --></div>');
      } else {
        injectionTarget.before('<div id="viator-tours-injection-point"><!-- VIATOR TOURS WILL BE INSERTED HERE --></div>');
      }
      
      console.log(`✅ Injection point created ${insertMethod} ${injectionTarget.prop('tagName')}`);
      console.log(`   Target text: "${injectionTarget.text().trim().substring(0, 60)}..."`);
      
      return $("body").html() || htmlContent;
    } else {
      console.log('❌ No H2 elements found for injection');
      return htmlContent;
    }
  }
  
  const injectedHtml = injectViatorToursBeforeSecondHeading(htmlContent, true);
  const hasInjectionPoint = injectedHtml.includes('viator-tours-injection-point');
  
  console.log('Injection point created:', hasInjectionPoint);
  
  return { success: hasInjectionPoint, injectedHtml };
}

// Step 4: Content rendering simulation
function testContentRendering(injectedHtml, tours) {
  console.log('\nSTEP 4: Content Rendering');
  console.log('--------------------------');
  
  const $ = load(injectedHtml);
  const injectionPoint = $('#viator-tours-injection-point');
  
  if (injectionPoint.length === 0) {
    console.log('❌ No injection point found in HTML');
    return { success: false };
  }
  
  console.log('✅ Injection point found');
  console.log('Position analysis:');
  
  const prevElement = injectionPoint.prev();
  const nextElement = injectionPoint.next();
  
  console.log('  Previous element:', prevElement.prop('tagName'));
  console.log('  Previous text:', prevElement.text().trim().substring(0, 50) + '...');
  console.log('  Next element:', nextElement.prop('tagName'));
  console.log('  Next text:', nextElement.text().trim().substring(0, 50) + '...');
  
  // Simulate the ViatorTours component rendering
  if (tours.length > 0) {
    const tour_count = tours.length;
    const city = 'London'; // From context
    const heading = tour_count > 1
      ? `${tour_count} Highest Rated Sight-Seeing Tours to Take in ${city}`
      : `Highest Rated Sight-Seeing Tour to Take in ${city}`;
    
    const viatorToursHtml = `
      <section class="my-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">${heading}</h2>
        <div class="viator-tours grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          ${tours.map(tour => `
            <article class="tour-item bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img src="${tour.images[0]?.variants[3]?.url}" alt="${tour.title}" class="w-full h-48 object-cover" />
              <div class="p-4">
                <h3 class="font-bold text-lg mb-3">${tour.title}</h3>
                <p class="text-sm text-gray-600 mb-3">${tour.description.substring(0, 100)}...</p>
                <p class="price mb-3"><strong>From: $${tour.pricing.summary.fromPrice}</strong></p>
                <a href="${tour.productUrl}" target="_blank" class="book-now bg-indigo-600 text-white px-4 py-2 rounded">Book Now</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
    
    console.log('✅ Tours component rendered');
    console.log('Tours section includes:');
    console.log(`  - Heading: "${heading}"`);
    console.log(`  - ${tours.length} tour cards`);
    console.log(`  - First tour: "${tours[0].title}"`);
    
    return { success: true, viatorToursHtml };
  }
  
  console.log('❌ No tours to render');
  return { success: false };
}

// Run the complete flow test
console.log('Testing complete integration flow...\n');

const step1 = testPostDetection(testPost);
let step2 = { products: [], destinationId: null };
let step3 = { success: false, injectedHtml: testPost.contentHtml };
let step4 = { success: false };

if (step1.shouldFetchTours) {
  step2 = simulateViatorAPI(step1.city);
  
  if (step2.products.length > 0) {
    step3 = testTourInjection(testPost.contentHtml, step2.products);
    
    if (step3.success) {
      step4 = testContentRendering(step3.injectedHtml, step2.products);
    }
  }
}

console.log('\n' + '================================================================================');
console.log('FINAL RESULTS');
console.log('================================================================================');
console.log('✅ Step 1 - Post Detection:', step1.shouldFetchTours ? 'PASS' : 'FAIL');
console.log('✅ Step 2 - API Simulation:', step2.products.length > 0 ? 'PASS' : 'FAIL');
console.log('✅ Step 3 - Tour Injection:', step3.success ? 'PASS' : 'FAIL');
console.log('✅ Step 4 - Content Rendering:', step4.success ? 'PASS' : 'FAIL');

const overallSuccess = step1.shouldFetchTours && step2.products.length > 0 && step3.success && step4.success;
console.log('\n🎯 Overall Integration:', overallSuccess ? '✅ WORKING' : '❌ BROKEN');

if (overallSuccess) {
  console.log('\n✨ The integration logic appears to be working correctly!');
  console.log('   Possible issues could be:');
  console.log('   1. Sanity API connection/authentication');
  console.log('   2. Viator API key or connectivity');
  console.log('   3. Environment variable configuration');
  console.log('   4. Real post data format differences');
} else {
  console.log('\n❌ Integration has issues that need to be fixed.');
}

console.log('\nNEXT STEPS:');
console.log('1. Check server logs for API errors');
console.log('2. Verify environment variables are set');
console.log('3. Test with real post data from Sanity');
console.log('4. Ensure Viator API connectivity');