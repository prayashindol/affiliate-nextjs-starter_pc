import { sanityClient } from "../../lib/sanity";
import SeoGenPost from "../components/SeoGenPost";

// --- Fetch post by slug, including mainImageAsset ---
async function getSeoGenPost(slug) {
  const query = `
    *[_type == "seoGenPost" && slug.current == $slug][0] {
      title,
      slug,
      description,
      excerpt,
      permalink,
      datePublished,
      dateModified,
      author,
      mainImage,
      mainImageAsset,
      contentHtml,
      location,
      category,
    postType
    }
  `;
  return await sanityClient.fetch(query, { slug });
}

// --- Fixed: Static Params must return { params: { slug } } ---
export async function generateStaticParams() {
  // Fetch all slugs from Sanity for SEO posts only
  const query = `*[_type == "seoGenPost" && postType == "seo" && defined(slug.current)]{ "slug": slug.current }`;
  const posts = await sanityClient.fetch(query);
  return posts.map(post => ({
    params: { slug: post.slug },
  }));
}

// --- Dynamic meta tags for SEO ---
export async function generateMetadata({ params }) {
  const post = await getSeoGenPost(params.slug);
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
      url: post.permalink || `https://strspecialist.com/${params.slug}`,
    },
    alternates: {
      canonical: post.permalink || `https://strspecialist.com/${params.slug}`,
    },
  };
}

export default async function SeoGenPostPage({ params }) {
  const post = await getSeoGenPost(params.slug);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center text-gray-700 font-sans">
        <h2 className="text-3xl font-bold mb-6">Post not found</h2>
        <p className="text-lg">The SEO Gen post you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <SeoGenPost post={post} />
    </>
  );
}