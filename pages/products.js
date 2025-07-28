import { useEffect, useState } from 'react'
import { sanityClient } from '../lib/sanity'

export default function ProductsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts() {
      const data = await sanityClient.fetch(`*[_type == "product"]{
        _id,
        title,
        price,
        slug,
        images[]{asset->{url}},
        description
      }`)
      setProducts(data)
    }
    fetchProducts()
  }, [])

  if (!products.length) {
    return <div className="p-8 text-center text-lg font-semibold">Loading products…</div>
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow border flex flex-col hover:shadow-lg transition">
              <img
                src={product.images?.[0]?.asset?.url || '/placeholder.jpg'}
                alt={product.title}
                className="h-60 w-full object-cover rounded-t-lg"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                <p className="text-gray-500 text-sm flex-1">{product.description?.slice(0, 90)}…</p>
                <div className="mt-2 font-semibold">{product.price ? `$${product.price}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
