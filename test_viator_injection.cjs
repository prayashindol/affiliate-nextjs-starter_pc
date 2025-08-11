// Test the current Viator injection logic using CommonJS
const { load } = require("cheerio");

// Mock the current injection function from SeoGenPost.jsx
function injectViatorToursAfterParagraph(htmlContent, viatorToursComponent, paragraphIndex = 2) {
  if (!viatorToursComponent || !htmlContent) return htmlContent;

  const $ = load(htmlContent);
  const paragraphs = $('p');
  
  console.log(`Total paragraphs found: ${paragraphs.length}`);
  paragraphs.each((i, p) => {
    console.log(`P${i + 1}: ${$(p).text().substring(0, 80)}...`);
  });
  
  if (paragraphs.length >= paragraphIndex) {
    const targetParagraph = paragraphs.eq(paragraphIndex - 1);
    console.log(`\nCurrent logic: Injecting after paragraph ${paragraphIndex}:`);
    console.log(`"${targetParagraph.text().substring(0, 80)}..."`);
    targetParagraph.after('<div id="viator-tours-injection-point"></div>');
  }
  
  return $("body").html() || htmlContent;
}

// New function to inject before first H2 (which would be the "second" heading after H1)
function injectViatorToursBeforeFirstH2(htmlContent) {
  const $ = load(htmlContent);
  const h2Elements = $('h2');
  
  console.log(`\nTotal H2 elements found: ${h2Elements.length}`);
  h2Elements.each((i, h2) => {
    console.log(`H2 ${i + 1}: ${$(h2).text()}`);
  });
  
  if (h2Elements.length > 0) {
    const firstH2 = h2Elements.eq(0);
    console.log(`\nProposed fix: Injecting before first H2:`);
    console.log(`"${firstH2.text()}"`);
    firstH2.before('<div id="viator-tours-injection-point"></div>');
  }
  
  return $("body").html() || htmlContent;
}

// Test HTML that mimics the structure mentioned in the issue
const testHtml = `
<h1>Best Tours for Aalborg</h1>
<p>First paragraph about Aalborg and its attractions. This paragraph provides an introduction to the city.</p>
<p>Second paragraph with important information including numbered points:
  <strong>1. First point about tours</strong> - Details about first point.
  <strong>2. Second point about attractions</strong> - Details about second point.
  <strong>3. Third point about experiences</strong> - Details about third point.
</p>
<p>Third paragraph with more content about the destination.</p>
<h2>Top Attractions in Aalborg</h2>
<p>Content about attractions goes here...</p>
<h2>Best Tour Experiences</h2>
<p>More content about tour experiences...</p>
`;

console.log("TESTING CURRENT INJECTION LOGIC (after 2nd paragraph):");
console.log("=".repeat(60));
const result1 = injectViatorToursAfterParagraph(testHtml, true, 2);

console.log("\n\nTESTING PROPOSED FIX (before first H2):");
console.log("=".repeat(60));
const result2 = injectViatorToursBeforeFirstH2(testHtml);

console.log("\n\nWhere tours would appear with current logic:");
console.log("-".repeat(50));
console.log(result1.split('<div id="viator-tours-injection-point"></div>')[0] + "\n*** VIATOR TOURS HERE ***\n" + (result1.split('<div id="viator-tours-injection-point"></div>')[1] || ''));

console.log("\n\nWhere tours would appear with proposed fix:");
console.log("-".repeat(50));
console.log(result2.split('<div id="viator-tours-injection-point"></div>')[0] + "\n*** VIATOR TOURS HERE ***\n" + (result2.split('<div id="viator-tours-injection-point"></div>')[1] || ''));