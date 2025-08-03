import { sanityClient } from "@/lib/sanity";
import SeoGenPost from "@/components/SeoGenPost";
import { sanityClient } from "@/lib/sanity";

// Re-use this to fetch post for meta too
async function getSeoGenPost(slug) {
  const query = `
    *[_type == "seoGenPost" && slug.current == $slug][0] {
      title,
      description,
      excerpt,
      permalink,
      mainImage
    }
  `;
  return await sanityClient.fetch(query, { slug });
}

export async function generateMetadata({ params }) {
  const post = await getSeoGenPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || post.excerpt || "",
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt || "",
      images: post.mainImage ? [{ url: post.mainImage }] : [],
      type: "article",
      url: post.permalink || `https://strspecialist.com/seo-gen/${params.slug}`,
    },
    alternates: {
      canonical: post.permalink || `https://strspecialist.com/seo-gen/${params.slug}`,
    },
  };
}

// Fetch the post by slug
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


export default async function SeoGenPostPage({ params }) {
  const post = await getSeoGenPost(params.slug);

  if (!post) {
    // ...not found message
  }

  // Fetch next and previous posts
  const nav = await getPrevNextPosts(post.dateModified, post.slug.current);

  return (
    <>
      <SeoGenPost post={post} />
      <div className="flex justify-between mt-12 max-w-3xl mx-auto">
        {nav.prev ? (
          <a
            href={`/seo-gen/${nav.prev.slug.current}`}
            className="text-blue-600 hover:underline"
          >
            ← Previous: {nav.prev.title}
          </a>
        ) : <span />}
        {nav.next ? (
          <a
            href={`/seo-gen/${nav.next.slug.current}`}
            className="text-blue-600 hover:underline ml-auto"
          >
            Next: {nav.next.title} →
          </a>
        ) : <span />}
      </div>
    </>
  );
}
