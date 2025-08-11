import { sanityClient } from "../../lib/sanity";
import { fetchViatorTours } from "../../lib/viator";

import SEOGenPostLayout from "../components/layouts/SEOGenPostLayout";
import ViatorPostLayout from "../components/layouts/ViatorPostLayout";
import { isViatorByCategories } from "../../lib/postKinds";

// Revalidate this page every 12 hours (must be a literal in Next.js 15)
export const revalidate = 43200;

// --- Fetch post by slug, including category slugs ---
async function getSeoGenPost(slug) {
  const query = `
    *[_type in ["seoGenPost","seoGenPostViator"] && slug.current == $slug][0] {
      _type,
      title,
      slug,
      description,
      excerpt,
      permalink,
      datePublished,
      dateModified,
      author,
      mainImage{
        asset->,
        alt
      },
      mainImageAsset{
        asset->,
        alt
      },
      contentHtml,
      location,
      category,
      // Fetch both title and slug for robust checks:
      categories[]->{title, slug},
      city,
      postType
    }
  `;
  return await sanityClient.fetch(query, { slug });
}

// --- Static Params: include slugs from BOTH types ---
export async function generateStaticParams() {
  const query = `*[_type in ["seoGenPost","seoGenPostViator"] && defined(slug.current)]{ "slug": slug.current }`;
  const posts = await sanityClient.fetch(query);
  return posts.map(post => ({
    params: { slug: post.slug },
  }));
}

// --- Dynamic meta tags for SEO ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getSeoGenPost(slug);
  if (!post) return {};

  let ogImages = [];
  if (post.mainImageAsset && post.mainImageAsset.asset) {
    const { urlFor } = await import("../../lib/sanity");
    ogImages = [
      {
        url: urlFor(post.mainImageAsset)
          .width(1200)
          .height(630)
          .fit("max")
          .auto("format")
          .url(),
        width: 1200,
        height: 630,
        alt: post.mainImageAsset.alt || post.title,
      },
    ];
  }

  return {
    title: post.title,
    description: post.description || post.excerpt || "",
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt || "",
      images: ogImages,
      type: "article",
      url: post.permalink || `/${params.slug}`,
    },
  };
}

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

  // Align detection with renderer so server actually fetches tours for string-array category too
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
      // Don't throw the error - just log it and continue with empty tours
      viatorTours = [];
    }
  }

  if (viator) {
    return <ViatorPostLayout post={post} viatorTours={viatorTours} />;
  }
  return <SEOGenPostLayout post={post} />;
}