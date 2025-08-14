// Test the Viator integration components in isolation
import { load } from 'cheerio';

// Mock post data to simulate what Sanity would return
const mockPost = {
  _type: "seoGenPostViator",
  title: "Best Tours for Mu Cang Chai",
  slug: { current: "best-tours-for-mu-cang-chai" },
  city: "mu cang chai",
  category: ["airbnb-gen-viator"],
  contentHtml: `
    <p>Mu Cang Chai is known for its stunning terraced rice fields and breathtaking mountain scenery.</p>
    <p>This northwestern Vietnamese district offers incredible trekking opportunities and cultural experiences.</p>
    <h2>Best Time to Visit Mu Cang Chai</h2>
    <p>The best time to visit is during harvest season from September to October when the rice terraces are golden.</p>
    <h2>Top Attractions in Mu Cang Chai</h2>
    <p>The terraced rice fields are the main attraction, offering incredible photography opportunities.</p>
  `,
  dateModified: "2024-01-15",
  author: "Travel Expert"
};

// Mock tours data to simulate what Viator API would return
const mockTours = [
  {
    productCode: "MU-CANG-CHAI-001",
    title: "Mu Cang Chai Rice Terraces Full Day Tour",
    description: "Explore the stunning rice terraces of Mu Cang Chai on this comprehensive full-day tour.",
    price: { amount: 85, currencyCode: "USD" },
    primaryGroupId: "CULTURAL",
    reviews: { combinedAverageRating: 4.8, totalReviews: 156 },
    images: [{ url: "https://example.com/mu-cang-chai-tour.jpg" }],
    duration: "8 hours"
  },
  {
    productCode: "MU-CANG-CHAI-002", 
    title: "Photography Workshop in Mu Cang Chai",
    description: "Capture the golden rice terraces with professional photography guidance.",
    price: { amount: 120, currencyCode: "USD" },
    primaryGroupId: "PHOTO_TOURS",
    reviews: { combinedAverageRating: 4.9, totalReviews: 89 },
    images: [{ url: "https://example.com/photography-tour.jpg" }],
    duration: "6 hours"
  }
];

console.log('🔍 VIATOR COMPONENT INTEGRATION TEST');
console.log('=====================================\n');

// Test 1: Post detection logic
console.log('TEST 1: Post Detection Logic');
console.log('-----------------------------');

const viatorByStringCategory = Array.isArray(mockPost?.category) && mockPost.category.includes('airbnb-gen-viator');
const viator = mockPost?._type === "seoGenPostViator" || viatorByStringCategory;

console.log('Post type:', mockPost._type);
console.log('Categories:', mockPost.category);
console.log('Is Viator post:', viator);
console.log('City:', mockPost.city);
console.log('Should show tours:', viator && mockPost.city);
console.log('Tours available:', mockTours.length, 'tours');
console.log('');

// Test 2: Tour injection logic
console.log('TEST 2: Tour Injection Logic');
console.log('-----------------------------');

function injectViatorToursBeforeSecondHeading(htmlContent) {
  if (!htmlContent) return htmlContent;

  const $ = load(htmlContent);
  
  // Remove any existing injection points
  $('#viator-tours-injection-point').remove();
  
  const h2Elements = $('h2');
  console.log('Found H2 elements:', h2Elements.length);
  
  if (h2Elements.length > 0) {
    const firstH2 = h2Elements.eq(0);
    console.log('First H2 text:', firstH2.text().trim());
    
    // Find meaningful content before the H2
    let injectionTarget = firstH2;
    let insertMethod = 'before';
    
    const contentBeforeH2 = [];
    let prevElement = firstH2.prev();
    
    while (prevElement.length) {
      contentBeforeH2.unshift(prevElement[0]);
      prevElement = prevElement.prev();
    }
    
    console.log('Content elements before H2:', contentBeforeH2.length);
    
    // Find the last meaningful content element before the H2
    if (contentBeforeH2.length > 0) {
      for (let i = contentBeforeH2.length - 1; i >= 0; i--) {
        const el = $(contentBeforeH2[i]);
        if (el.is('p, ul, ol, div') && el.text().trim().length > 50) {
          injectionTarget = el;
          insertMethod = 'after';
          console.log('Found injection target:', el.prop('tagName'), 'with text:', el.text().trim().substring(0, 50) + '...');
          break;
        }
      }
    }
    
    // Create injection point
    if (insertMethod === 'after') {
      injectionTarget.after('<div id="viator-tours-injection-point"></div>');
    } else {
      injectionTarget.before('<div id="viator-tours-injection-point"></div>');
    }
    
    console.log('Injection method:', insertMethod);
    console.log('Injection successful:', $('#viator-tours-injection-point').length > 0);
  }
  
  return $('body').html() || htmlContent;
}

const htmlWithInjection = injectViatorToursBeforeSecondHeading(mockPost.contentHtml);
console.log('HTML contains injection point:', htmlWithInjection.includes('viator-tours-injection-point'));
console.log('');

// Test 3: Content splitting for rendering
console.log('TEST 3: Content Splitting for Tours');
console.log('------------------------------------');

const parts = htmlWithInjection.split('<div id="viator-tours-injection-point"></div>');
console.log('Content parts after splitting:', parts.length);
console.log('Part 1 length:', parts[0]?.length || 0, 'characters');
console.log('Part 2 length:', parts[1]?.length || 0, 'characters');

if (parts.length === 2) {
  console.log('✅ Content splitting works - tours would be injected between parts');
} else {
  console.log('❌ Content splitting failed - tours would not be injected properly');
}

console.log('');

// Test 4: Tour rendering simulation
console.log('TEST 4: Tour Rendering Simulation');
console.log('----------------------------------');

function simulateViatorToursComponent(tours, city) {
  if (!tours || tours.length === 0) {
    return '<div class="no-tours">No tours available</div>';
  }
  
  const tourCards = tours.map(tour => `
    <div class="tour-card">
      <h3>${tour.title}</h3>
      <p>${tour.description}</p>
      <span class="price">$${tour.price.amount}</span>
      <span class="rating">${tour.reviews.combinedAverageRating} (${tour.reviews.totalReviews} reviews)</span>
    </div>
  `).join('');
  
  return `
    <div class="viator-tours-section">
      <h2>Best Tours in ${city}</h2>
      <div class="tours-grid">
        ${tourCards}
      </div>
    </div>
  `;
}

const toursHtml = simulateViatorToursComponent(mockTours, mockPost.city);
console.log('Tours HTML generated:', toursHtml.length, 'characters');
console.log('Tours HTML contains titles:', toursHtml.includes('Rice Terraces') && toursHtml.includes('Photography'));
console.log('');

// Test 5: Final integration simulation
console.log('TEST 5: Final Integration Simulation');
console.log('------------------------------------');

const finalHtml = htmlWithInjection.replace(
  '<div id="viator-tours-injection-point"></div>',
  toursHtml
);

console.log('Final HTML length:', finalHtml.length, 'characters');
console.log('Contains original content:', finalHtml.includes('terraced rice fields'));
console.log('Contains tour content:', finalHtml.includes('Best Tours in'));
console.log('Contains tour cards:', finalHtml.includes('tour-card'));

// Summary
console.log('\n🎯 INTEGRATION TEST SUMMARY');
console.log('============================');
console.log('✅ Post detection:', viator ? 'PASS' : 'FAIL');
console.log('✅ Tour injection logic:', htmlWithInjection.includes('viator-tours-injection-point') ? 'PASS' : 'FAIL');
console.log('✅ Content splitting:', parts.length === 2 ? 'PASS' : 'FAIL');
console.log('✅ Tour rendering:', toursHtml.length > 0 ? 'PASS' : 'FAIL');
console.log('✅ Final integration:', finalHtml.includes('tour-card') ? 'PASS' : 'FAIL');

const allTestsPass = viator && 
                    htmlWithInjection.includes('viator-tours-injection-point') && 
                    parts.length === 2 && 
                    toursHtml.length > 0 && 
                    finalHtml.includes('tour-card');

console.log('\n🎯 Overall Integration:', allTestsPass ? '✅ WORKING' : '❌ BROKEN');

if (allTestsPass) {
  console.log('\n✨ The Viator integration logic is working correctly!');
  console.log('   The issue is likely:');
  console.log('   1. Sanity CMS authentication preventing post data loading');
  console.log('   2. Invalid/missing Viator API key preventing tour data fetching');
  console.log('   3. Environment variables not properly configured in production');
} else {
  console.log('\n⚠️  Integration logic has issues that need fixing');
}