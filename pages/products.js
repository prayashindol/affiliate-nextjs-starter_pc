// pages/products.js
import { sanity } from '../lib/sanity'
import Link from 'next/link'

export async function getServerSideProps() {
  const products = await sanity.fetch(`*[_type == "product"]{
    _id, title, slug, images[0]{asset->{url}}, price
  }`)
  return { props: { products } }
}

export default function ProductsPage({ products }) {
  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {products.map(product => (
          <Link key={product._id} href={`/products/${product.slug.current}`} className="block group">
            <div className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition">
              {product.images?.asset?.url && (
                <img src={product.images.asset.url} alt={product.title} className="rounded-xl mb-2 h-48 w-full object-cover" />
              )}
              <h2 className="text-xl font-semibold group-hover:underline">{product.title}</h2>
              <div className="text-lg mt-2">{product.price ? `$${product.price}` : ''}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}