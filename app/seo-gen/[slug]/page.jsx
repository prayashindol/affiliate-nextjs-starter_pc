import { sanityClient } from "../../../lib/sanity";
import SeoGenPost from "../../components/SeoGenPost";

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
      category
    }
  `;
  return await sanityClient.fetch(query, { slug });
}

async function getPrevNextPosts(dateModified, slug) {
  const query = `
    {
      "prev": *[_type == "seoGenPost" && dateModified < $dateModified] | order(dateModified desc)[0] {title, slug},
      "next": *[_type == "seoGenPost" && dateModified > $dateModified] | order(dateModified asc)[0] {title, slug}
    }
  `;
  return await sanityClient.fetch(query, { dateModified, slug });
}

// --- Dynamic meta tags for SEO ---
export async function generateMetadata({ params }) {
  const post = await getSeoGenPost(params.slug);
  if (!post) return {};

  let ogImages = [];
  if (post.mainImageAsset && post.mainImageAsset.asset) {
    const { urlFor } = await import("../../../lib/sanity");
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
      url: post.permalink || `https://strspecialist.com/seo-gen/${params.slug}`,
    },
    alternates: {
      canonical: post.permalink || `https://strspecialist.com/seo-gen/${params.slug}`,
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

  const nav = await getPrevNextPosts(post.dateModified, post.slug.current);

  return (
    <>
      <SeoGenPost post={post} />
      <div className="flex justify-between mt-16 max-w-3xl mx-auto font-sans">
        {nav.prev ? (
          <a
            href={`/seo-gen/${nav.prev.slug.current}`}
            className="text-indigo-600 hover:underline text-lg"
          >
            ← Previous: {nav.prev.title}
          </a>
        ) : <span />}
        {nav.next ? (
          <a
            href={`/seo-gen/${nav.next.slug.current}`}
            className="text-indigo-600 hover:underline text-lg ml-auto"
          >
            Next: {nav.next.title} →
          </a>
        ) : <span />}
      </div>
    </>
  );
}
