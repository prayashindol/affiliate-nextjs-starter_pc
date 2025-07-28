import { useEffect, useState } from "react"
import Link from "next/link"
import { sanityClient } from "../lib/sanity"

export default function ProductsPage() {
  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient.fetch(`*[_type == "product"]{
      _id,
      title,
      slug,
      price,
      images[]{asset->{url}},
      description
    }`).then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="p-8 text-lg">Loading products…</div>
  if (!products?.length) return <div className="p-8 text-lg">No products found.</div>

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Products</h2>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
          {products.map((product) => (
            <div key={product._id} className="group relative border rounded-xl shadow hover:shadow-xl bg-white flex flex-col">
              <Link href={`/product/${product.slug?.current}`}>
                <img
                  src={product.images?.[0]?.asset?.url || "/no-image.jpg"}
                  alt={product.title}
                  className="aspect-square w-full object-cover rounded-t-xl transition group-hover:opacity-80"
                />
              </Link>
              <div className="flex-1 flex flex-col p-4">
                <h3 className="text-lg font-semibold">
                  <Link href={`/product/${product.slug?.current}`} className="hover:underline">
                    {product.title}
                  </Link>
                </h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description?.replace(/\\n/g, " ")}</p>
                <div className="mt-auto flex justify-between items-end">
                  <span className="text-xl font-bold text-blue-700">${product.price || "N/A"}</span>
                  <Link href={`/product/${product.slug?.current}`}>
                    <span className="text-sm text-blue-600 underline">View</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
