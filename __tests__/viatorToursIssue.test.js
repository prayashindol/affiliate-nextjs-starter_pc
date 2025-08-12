// Test to reproduce the Viator tours not showing issue
import { load } from 'cheerio';

// Mock the components we need to test
const mockViatorTours = [
  {
    productCode: "test-tour-1",
    title: "Test Viator Tour in Paris",
    description: "A wonderful tour of Paris attractions...",
    images: [{
      variants: [null, null, null, {
        url: "https://example.com/tour-image.jpg"
      }]
    }],
    reviews: {
      totalReviews: 150,
      combinedAverageRating: 4.5
    },
    duration: {
      fixedDurationInMinutes: 240
    },
    pricing: {
      summary: {
        fromPrice: 89
      }
    },
    productUrl: "https://www.viator.com/tours/paris/test-tour-1"
  }
];

const mockViatorPost = {
  _type: "seoGenPostViator",
  title: "Best Things to Do in Paris",
  slug: { current: "best-things-to-do-in-paris" },
  city: "paris",
  category: ["airbnb-gen-viator"],
  contentHtml: `
    <p>Paris is one of the most beautiful cities in the world, offering countless attractions for visitors.</p>
    <p>In this comprehensive guide, we'll explore all the must-see sights and hidden gems that make Paris special.</p>
    <h2>Top Tourist Attractions in Paris</h2>
    <p>The Eiffel Tower stands as the most iconic symbol of Paris and France.</p>
    <ul>
      <li>Visit during sunset for the best photos</li>
      <li>Book tickets in advance to avoid long queues</li>
    </ul>
    <h2>Best Areas to Stay in Paris</h2>
    <p>Different neighborhoods offer unique experiences for travelers.</p>
  `,
  dateModified: "2024-01-15",
  author: "Travel Expert"
};

// Test function to simulate the current behavior
function testViatorToursIssue() {
  console.log('🧪 Testing Viator Tours Issue Reproduction...\n');
  
  // Simulate the conditions that should trigger Viator tours
  const isViatorPost = 
    mockViatorPost._type === "seoGenPostViator" ||
    (Array.isArray(mockViatorPost.category) && mockViatorPost.category.includes('airbnb-gen-viator'));
  
  console.log('Post Detection Results:');
  console.log('- Post type:', mockViatorPost._type);
  console.log('- Post categories:', mockViatorPost.category);
  console.log('- Post city:', mockViatorPost.city);
  console.log('- Is Viator post detected:', isViatorPost);
  console.log('- Should fetch tours:', isViatorPost && mockViatorPost.city);
  
  // Simulate tour fetching
  if (isViatorPost && mockViatorPost.city) {
    console.log('\n✅ SHOULD FETCH TOURS for city:', mockViatorPost.city);
    console.log('- Mock tours available:', mockViatorTours.length);
    
    // Test the injection logic
    const $ = load(mockViatorPost.contentHtml);
    
    console.log('\nContent Structure Analysis:');
    console.log('- Total paragraphs:', $('p').length);
    console.log('- Total H2 headings:', $('h2').length);
    console.log('- First H2 text:', $('h2').first().text());
    console.log('- Second H2 text:', $('h2').eq(1).text());
    
    // Check where tours should be injected
    const h2Elements = $('h2');
    if (h2Elements.length > 0) {
      const firstH2 = h2Elements.eq(0);
      console.log('\nInjection Point Analysis:');
      console.log('- Would inject before first H2:', firstH2.text());
      
      // Find content before H2
      let contentBeforeH2 = [];
      let prevElement = firstH2.prev();
      while (prevElement.length) {
        contentBeforeH2.unshift(prevElement[0]);
        prevElement = prevElement.prev();
      }
      
      console.log('- Elements before first H2:', contentBeforeH2.length);
      contentBeforeH2.forEach((el, i) => {
        const $el = $(el);
        console.log(`  ${i + 1}. ${el.tagName}: "${$el.text().trim().substring(0, 50)}..."`);
      });
      
      console.log('\n🎯 Expected behavior: Tours should appear after last meaningful paragraph before first H2');
    }
    
    return {
      shouldShowTours: true,
      toursAvailable: mockViatorTours.length,
      injectionPointFound: h2Elements.length > 0
    };
  } else {
    console.log('\n❌ NO TOURS SHOULD BE FETCHED');
    console.log('Reason: Either not a Viator post or no city specified');
    return {
      shouldShowTours: false,
      toursAvailable: 0,
      injectionPointFound: false
    };
  }
}

function testInjectionFunction() {
  console.log('\n🔧 Testing Tour Injection Function...\n');
  
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
        injectionTarget.after('<div id="viator-tours-injection-point"></div>');
      } else {
        injectionTarget.before('<div id="viator-tours-injection-point"></div>');
      }
      
      console.log('Injection result:');
      console.log('- Method:', insertMethod);
      console.log('- Target element:', injectionTarget.prop('tagName'));
      console.log('- Target text:', injectionTarget.text().trim().substring(0, 100));
    }
    
    return $("body").html() || htmlContent;
  }
  
  const resultHtml = injectViatorToursBeforeSecondHeading(mockViatorPost.contentHtml, true);
  const $ = load(resultHtml);
  const injectionPoint = $('#viator-tours-injection-point');
  
  console.log('✅ Injection function executed');
  console.log('- Injection point created:', injectionPoint.length > 0);
  
  if (injectionPoint.length > 0) {
    console.log('- Position relative to H2:', injectionPoint.next().is('h2') ? 'Before H2' : 'Other');
    console.log('- Previous element:', injectionPoint.prev().prop('tagName'));
    console.log('- Next element:', injectionPoint.next().prop('tagName'));
  }
  
  return {
    injectionPointCreated: injectionPoint.length > 0,
    resultHtml: resultHtml
  };
}

// Run the tests
console.log('================================================================================');
console.log('VIATOR TOURS ISSUE REPRODUCTION TEST');
console.log('================================================================================');

const issueTest = testViatorToursIssue();
const injectionTest = testInjectionFunction();

console.log('\n' + '================================================================================');
console.log('SUMMARY');
console.log('================================================================================');
console.log('Detection working:', issueTest.shouldShowTours);
console.log('Tours available:', issueTest.toursAvailable);
console.log('Injection logic working:', injectionTest.injectionPointCreated);
console.log('Overall status:', issueTest.shouldShowTours && injectionTest.injectionPointCreated ? '✅ SHOULD WORK' : '❌ ISSUE FOUND');

export { testViatorToursIssue, testInjectionFunction, mockViatorPost, mockViatorTours };