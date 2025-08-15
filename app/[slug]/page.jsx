/**
 * Dynamic post page with enriched Viator tour rendering.
 */
import { sanityClient } from '../../lib/sanity'
import { fetchViatorTours } from '../../lib/viator'
import ViatorGenPost from '../components/posts/ViatorGenPost'

async function getSeoGenPost(slug) {
  try {
    const query = `*[_type in ["seoGenPost","seoGenPostViator"] && slug.current == $slug][0]{
      _id,
      _type,
      title,
      slug,
      body,
      excerpt,
      description,
      contentHtml,
      city,
      postType,
      category,
      categories[]->{title, slug},
      mainImage,
      mainImageAsset{
        asset->{ _id, url },
        alt
      },
      dateModified,
      author,
      location,
      permalink
    }`
    return await sanityClient.fetch(query, { slug })
  } catch (error) {
    console.error('Error fetching post:', error.message)
    return null
  }
}

function isViatorByCategories(categories) {
  if (!Array.isArray(categories)) return false
  return categories.some(c => {
    const s = c?.slug?.current || c?.slug
    return s === 'airbnb-gen-viator'
  })
}

export async function generateStaticParams() {
  try {
    const query = `*[_type in ["seoGenPost","seoGenPostViator"] && defined(slug.current)]{ "slug": slug.current }`
    const posts = await sanityClient.fetch(query)
    return posts.map(p => ({ slug: p.slug }))
  } catch (error) {
    console.error('Error fetching posts for static generation:', error.message)
    // Return empty array to prevent build failure when Sanity is not accessible
    return []
  }
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

  const viatorByStringCategory =
    Array.isArray(post?.category) && post.category.includes('airbnb-gen-viator')

  const viator =
    post?._type === 'seoGenPostViator' ||
    isViatorByCategories(post?.categories) ||
    viatorByStringCategory

  let viatorProducts = []
  let viatorMeta = null
  if (viator && post?.city) {
    const result = await fetchViatorTours({ city: post.city, count: 9 })
    viatorProducts = result.products
    viatorMeta = result
  }

  // If this is a Viator post and has contentHtml, use the ViatorGenPost component
  if (viator && post.contentHtml) {
    return (
      <ViatorGenPost 
        post={post} 
        viatorTours={viatorProducts} 
        city={post.city} 
        viatorMetadata={viatorMeta}
      />
    )
  }

  // Fallback to simple layout for non-Viator posts or posts without contentHtml
  return (
    <article className="prose max-w-3xl mx-auto py-10">
      <header>
        <h1>{post.title}</h1>
        {post.city && (
          <p className="text-sm text-gray-500 mt-1">
            Destination: <span className="font-medium">{post.city}</span>
          </p>
        )}
      </header>

      <section className="mt-6">
        {Array.isArray(post.body) ? (
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
            {JSON.stringify(post.body, null, 2)}
          </pre>
        ) : (
          <p>{post.excerpt || post.description || 'Content coming soon.'}</p>
        )}
      </section>

      {viator && (
        <div className="mt-12">
          {viatorProducts.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Popular Tours</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {viatorProducts.map(p => (
                  <a
                    key={p.productCode}
                    href={p.link || '#'}
                    target={p.link ? '_blank' : undefined}
                    rel={p.link ? 'nofollow noopener noreferrer' : undefined}
                    className="group border rounded-lg p-4 bg-white shadow-sm hover:shadow transition flex flex-col"
                  >
                    {p.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-full h-32 object-cover rounded mb-3 border border-gray-100"
                        loading="lazy"
                      />
                    )}
                    <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-indigo-600">
                      {p.title}
                    </h3>
                    {p.price && (
                      <p className="text-xs text-gray-600 mb-1">{p.price}</p>
                    )}
                    <p className="mt-auto text-xs line-clamp-3 text-gray-500">
                      {p.shortDescription}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {viatorMeta?.apiStatus === 'error' && 'Tours temporarily unavailable (API error).'}
              {viatorMeta?.apiStatus === 'no-destination' && 'No destination mapping for this city.'}
              {viatorMeta?.apiStatus === 'mock' && 'Showing mock tours (test or missing API key).'}
              {viatorMeta?.apiStatus === 'exception' && 'Unexpected error loading tours.'}
              {viatorMeta?.apiStatus === 'success' && viatorProducts.length === 0 && 'No tours returned for this destination.'}
            </div>
          )}
        </div>
      )}
    </article>
  )
}