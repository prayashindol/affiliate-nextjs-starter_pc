// Add this near the top-level exports (enables ISR for the page itself)
export const revalidate = 60 * 60 * 12; // 12 hours

// ...existing imports...

export default async function SeoGenPostPage({ params }) {
  const { slug } = await params;
  const post = await getSeoGenPost(slug);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center text-gray-700 font-sans">
        <h2 className="text-3xl font-bold mb-6">Post not found</h2>
        <p className="text-lg">The SEO Gen post you are looking for does not exist.</p>
      </div>
    );
  }

  // Align detection with renderer:
  const viatorByStringCategory =
    Array.isArray(post?.category) && post.category.includes('airbnb-gen-viator');

  const viator =
    post?._type === "seoGenPostViator" ||
    isViatorByCategories(post?.categories) ||
    viatorByStringCategory;

  console.log("VIATOR DETECTION:");
  console.log("- Post _type:", post?._type);
  console.log("- Post categories (object array):", post?.categories);
  console.log("- Post category (string array):", post?.category);
  console.log("- isViatorByCategories result:", isViatorByCategories(post?.categories));
  console.log("- viatorByStringCategory result:", viatorByStringCategory);
  console.log("- Final viator flag:", viator);
  console.log("- Post city:", post?.city);

  // Fetch Viator tours only for Viator-category posts
  let viatorTours = [];
  if (viator && post?.city) {
    try {
      console.log(`Attempting to fetch Viator tours for city: ${post.city}`);
      const viatorResult = await fetchViatorTours({
        city: post.city,
        count: 9,
      });
      viatorTours = viatorResult.products || [];
      console.log(`Found ${viatorTours.length} Viator tours`);
    } catch (error) {
      console.error("Failed to fetch Viator tours:", error);
      viatorTours = [];
    }
  }

  if (viator) {
    return <ViatorPostLayout post={post} viatorTours={viatorTours} />;
  }
  return <SEOGenPostLayout post={post} />;
}