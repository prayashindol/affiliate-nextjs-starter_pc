// pages/products/[slug].js
import { sanity } from '../../lib/sanity'

export async function getServerSideProps({ params }) {
  const product = await sanity.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id, title, images[]{asset->{url}}, description, price
    }`, { slug: params.slug }
  )
  return { props: { product } }
}

export default function ProductDetail({ product }) {
  if (!product) return <div>Not found</div>
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="flex gap-6 flex-col md:flex-row">
        {product.images?.length > 0 && (
          <div className="w-full md:w-1/2">
            <img src={product.images[0]?.asset?.url} alt={product.title} className="rounded-xl w-full object-cover" />
          </div>
        )}
        <div className="md:w-1/2">
          <div className="text-lg mb-2">{product.price ? `$${product.price}` : ''}</div>
          <div className="prose prose-lg">{product.description}</div>
          {/* Add-to-cart or affiliate button goes here! */}
        </div>
      </div>
    </div>
  )
}
