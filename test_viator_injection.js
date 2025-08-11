import { load } from "cheerio";

// Simulate the issue: Viator tours appearing after bullet points in H2 instead of before H2
function testViatorInjectionIssue() {
  console.log('🧪 Testing Viator tour injection issue...\n');
  
  // Sample HTML that might come from CMS - simulating the problematic case
  const sampleHtml = `
    <h2>Save on Transportation in Aalborg</h2>
    <p>This is introductory content about transportation in Aalborg.</p>
    <ul>
      <li>Bullet point 1 about transportation</li>
      <li>Bullet point 2 about cost savings</li>
      <li>Bullet point 3 about booking tips</li>
    </ul>
    <p>Additional content about transportation.</p>
    
    <h2>Best Areas to Stay in Aalborg</h2>
    <p>Content about accommodation areas.</p>
    <ul>
      <li>City center area</li>
      <li>Waterfront district</li>
    </ul>
  `;

  // Current injection logic from SeoGenPost.jsx
  function injectViatorToursBeforeSecondHeading(htmlContent) {
    if (!htmlContent) return htmlContent;

    const $ = load(htmlContent);
    const h2Elements = $('h2');
    
    // Inject before the first H2 (which is the "second" heading after H1)
    if (h2Elements.length > 0) {
      const firstH2 = h2Elements.eq(0);
      // Create a marker for the Viator tours injection point
      firstH2.before('<div id="viator-tours-injection-point"></div>');
    } else {
      // Fallback: if no H2 found, inject after the first paragraph as a sensible default
      const paragraphs = $('p');
      if (paragraphs.length > 0) {
        const firstParagraph = paragraphs.eq(0);
        firstParagraph.after('<div id="viator-tours-injection-point"></div>');
      }
    }
    
    return $("body").html() || htmlContent;
  }

  console.log('📋 Original HTML structure:');
  console.log(sampleHtml);
  
  console.log('\n📋 Current injection result:');
  const currentResult = injectViatorToursBeforeSecondHeading(sampleHtml);
  console.log(currentResult);
  
  // Analyze the results
  const $ = load(currentResult);
  const injectionPoint = $('#viator-tours-injection-point');
  const firstH2 = $('h2').first();
  const firstList = $('ul').first();
  
  console.log('\n📊 Analysis:');
  console.log('- Injection point parent:', injectionPoint.parent().prop('tagName'));
  console.log('- Injection point previous sibling:', injectionPoint.prev().prop('tagName'));
  console.log('- Injection point next sibling:', injectionPoint.next().prop('tagName'));
  console.log('- First H2 text:', firstH2.text().trim());
  console.log('- Is injection before first H2?', injectionPoint.index() < firstH2.index());
  
  return currentResult;
}

// Run the test
testViatorInjectionIssue();