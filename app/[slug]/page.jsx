/**
 * Dynamic post page with Viator integration.
 * - Determines if post should display tours
 * - Fetches tours server-side (SSR) to avoid client flash
 *
 * Assumptions:
 * - Sanity content rendering (PortableText or similar) can be plugged in where indicated.
 * - City field present for Viator posts.
 */

import { sanityClient } from '../../lib/sanity'
import { fetchViatorTours } from '../../lib/viator'

// ---------- Data Helpers ----------

async function getSeoGenPost(slug) {
  const query = `*[_type in ["seoGenPost","seoGenPostViator"] && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    body,
    excerpt,
    description,
    city,
    postType,
    category,
    categories[]->{title, slug},
    mainImageAsset{
      asset->{ _id, url },
      alt
    }
  }`
  return sanityClient.fetch(query, { slug })
}

function isViatorByCategories(categories) {
  if (!Array.isArray(categories)) return false
  return categories.some(c => {
    const s = c?.slug?.current || c?.slug
    return s === 'airbnb-gen-viator'
  })
}

// ---------- Static Generation ----------

export async function generateStaticParams() {
  const query = `*[_type in ["seoGenPost","seoGenPostViator"] && defined(slug.current)]{ "slug": slug.current }`
  const posts = await sanityClient.fetch(query)
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getSeoGenPost(slug)
  if (!post) return {}

  const ogImages = []
  if (post.mainImageAsset?.asset?.url) {
    ogImages.push({
      url: post.mainImageAsset.asset.url,
      width: 1200,
      height: 630,
      alt: post.mainImageAsset.alt || post.title
    })
  }

  return {
    title: post.title,
    description: post.description || post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt || '',
      images: ogImages,
      type: 'article',
      url: `/${slug}`
    }
  }
}

// ---------- Page Component ----------

export default async function SeoGenPostPage({ params }) {
  const { slug } = await params
  const post = await getSeoGenPost(slug)

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center text-gray-700">
        <h2 className="text-3xl font-bold mb-6">Post not found</h2>
        <p className="text-lg">The post you are looking for does not exist.</p>
      </div>
    )
  }

  // Viator detection logic (keep aligned with renderer)
  const viatorByStringCategory =
    Array.isArray(post?.category) && post.category.includes('airbnb-gen-viator')

  const viator =
    post?._type === 'seoGenPostViator' ||
    isViatorByCategories(post?.categories) ||
    viatorByStringCategory

  console.log('VIATOR DETECTION:', {
    type: post?._type,
    categories: post?.categories,
    categoryArray: post?.category,
    viatorFlag: viator,
    city: post?.city
  })

  // Fetch tours if applicable
  let viatorProducts = []
  let viatorMeta = null
  if (viator && post?.city) {
    const result = await fetchViatorTours({ city: post.city, count: 9 })
    viatorMeta = result
    viatorProducts = Array.isArray(result.products) ? result.products : []
    console.log('Viator fetch summary:', {
      city: post.city,
      dest: result.destinationId,
      status: result.apiStatus,
      count: viatorProducts.length,
      error: result.apiError
    })
  }

  // ---------- Render ----------

  return (
    <article className="prose prose-headings:scroll-mt-20 max-w-3xl mx-auto py-10">
      <header>
        <h1>{post.title}</h1>
        {post.city && (
          <p className="text-sm text-gray-500 mt-1">
            Destination: <span className="font-medium">{post.city}</span>
          </p>
        )}
      </header>

      {/* MAIN CONTENT:
          Replace this block with your existing rich text renderer if you have one (e.g. PortableText)
          Example:
          <PortableText value={post.body} components={portableTextComponents} />
      */}
      <section className="mt-6">
        {Array.isArray(post.body) ? (
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border border-gray-200">
            {JSON.stringify(post.body, null, 2)}
          </pre>
        ) : (
          <p>{post.excerpt || 'Content coming soon.'}</p>
        )}
      </section>

      {/* Viator Tours Section */}
      {viator && (
        <div className="mt-12">
          {viatorProducts.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Popular Tours</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {viatorProducts.map(t => (
                  <div
                    key={t.productCode || t.title}
                    className="border rounded p-3 bg-white shadow-sm"
                  >
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">
                      {t.title}
                    </h3>
                    {t.price?.formattedValue && (
                      <p className="text-xs text-gray-600">
                        {t.price.formattedValue}
                      </p>
                    )}
                    <p className="mt-1 text-xs line-clamp-3 text-gray-500">
                      {t.shortDescription || 'Tour description'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {viatorMeta?.apiStatus === 'error' && (
                <span>
                  Tours temporarily unavailable (API error). Check logs for details.
                </span>
              )}
              {viatorMeta?.apiStatus === 'no-destination' && (
                <span>No destination mapping for this city.</span>
              )}
              {viatorMeta?.apiStatus === 'mock' && (
                <span>Showing mock tours (missing or test API key).</span>
              )}
              {viatorMeta?.apiStatus === 'exception' && (
                <span>Unexpected error loading tours.</span>
              )}
              {viatorMeta?.apiStatus === 'success' && viatorProducts.length === 0 && (
                <span>No tours found for this destination.</span>
              )}
            </div>
          )}

          {/* Optional Debug Metadata (comment out in production) */}
          {/* <pre className="mt-4 p-3 text-xs bg-gray-50 border rounded">
            {JSON.stringify(viatorMeta, null, 2)}
          </pre> */}
        </div>
      )}
    </article>
  )
}