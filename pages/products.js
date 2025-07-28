// pages/products.js

import { useEffect, useState } from 'react'
import { sanityClient } from '../lib/sanity' // Update this path if needed

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

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold mb-8">Products</h2>

        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow hover:shadow-lg transition"
            >
              <img
                alt={product.title}
                src={product.images?.[0]?.asset?.url || '/placeholder.jpg'}
                className="aspect-3/4 w-full bg-gray-200 object-cover group-hover:opacity-75 sm:aspect-auto sm:h-72"
              />
              <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <a href={`/products/${product.slug?.current}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.title}
                  </a>
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description?.slice(0, 100)}...</p>
                <div className="flex flex-1 flex-col justify-end">
                  <p className="text-base font-medium text-gray-900">{product.price ? `$${product.price}` : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
