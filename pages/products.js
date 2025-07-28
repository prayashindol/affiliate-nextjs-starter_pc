import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'ph27cqpd',
  dataset: 'production',
  apiVersion: '2023-07-01',
  useCdn: true,
})

// If using app directory, use `async function Page() {}` instead
export async function getServerSideProps() {
  const products = await client.fetch(`*[_type == "product"]{
    _id,
    title,
    slug,
    price,
    description,
    images[0]{asset->{url}},
    // Add more fields as needed
  }`)
  return { props: { products } }
}

export default function ProductsPage({ products }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <img
                alt={product.title}
                src={product.images?.asset?.url || '/placeholder.jpg'}
                className="aspect-3/4 w-full bg-gray-200 object-cover group-hover:opacity-75 sm:aspect-auto sm:h-96"
              />
              <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  <a href={`/products/${product.slug.current}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.title}
                  </a>
                </h3>
                <p className="text-sm text-gray-500">{product.description}</p>
                <div className="flex flex-1 flex-col justify-end">
                  {/* Add options if you have variants */}
                  {/* <p className="text-sm text-gray-500 italic">{product.options}</p> */}
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
