import Link from "next/link";
import { sanityClient } from "@/lib/sanity"; // Adjust the path if needed
import AddToCart from "../components/AddToCart";

async function getProducts() {
  try {
    return await sanityClient.fetch(`*[_type == "product"]{
      _id,
      title,
      slug,
      price,
      type,
      images[]{asset->{url}},
      description,
      downloadFiles[]{asset->{url, originalFilename}},
      affiliateLink
    }`);
  } catch (error) {
    console.error('Error fetching products from Sanity:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  if (!products?.length) {
    return <div className="p-8 text-lg">No products found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Products</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-2xl overflow-hidden shadow bg-white flex flex-col hover:scale-105 transition"
            >
              <Link href={`/products/${product.slug?.current || ""}`}>
                <img
                  src={product.images?.[0]?.asset?.url || "/no-image.jpg"}
                  alt={product.title}
                  className="h-64 w-full object-cover"
                />
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                <p className="text-gray-500 flex-1 mb-2">
                  {product.description?.replace(/\n/g, " ").slice(0, 100) || "No description"}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">${product.price || "N/A"}</span>
                  <div className="flex space-x-2">
                    <Link href={`/products/${product.slug?.current || ""}`}>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">View</span>
                    </Link>
                    <AddToCart 
                      product={{
                        id: product._id,
                        title: product.title,
                        price: product.price || 0,
                        type: product.type || 'digital',
                        image: product.images?.[0]?.asset?.url,
                        downloadFiles: product.downloadFiles?.map(file => ({
                          url: file.asset?.url,
                          filename: file.asset?.originalFilename
                        })),
                        affiliateLink: product.affiliateLink
                      }}
                      className="px-3 py-1 text-sm rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}