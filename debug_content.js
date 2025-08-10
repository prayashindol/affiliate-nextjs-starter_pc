const { sanityClient } = require('./lib/sanity.js');

async function testContentProcessing() {
  try {
    const query = '*[slug.current == "best-tours-in-monterey-carmel"][0] { _type, title, contentHtml, permalink }';
    const post = await sanityClient.fetch(query);
    
    console.log('Post title:', post.title);
    console.log('Original content length:', post.contentHtml ? post.contentHtml.length : 0);
    console.log('Has content:', !!post.contentHtml);
    
    if (post.contentHtml) {
      // Let's just see the first few paragraphs without any processing
      const firstPart = post.contentHtml.substring(0, 2000);
      console.log('Raw content preview:');
      console.log(firstPart);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testContentProcessing();