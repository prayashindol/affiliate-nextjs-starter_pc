import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity"; // Adjust this path as needed
import DropshipProduct from "./DropshipProduct";
import DigitalProduct from "./DigitalProduct";

// Helper to fetch product by slug
async function getProductBySlug(slug) {
  // Adjust fields as needed for your Sanity schema!
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      price,
      description,
      details,
      highlights,
      "images": images[]{asset->{url}, alt},
      productType,
      digitalFileUrl,
      rating,
      relatedProducts[]->{_id, name, slug, images[]{asset->{url}}, price, color}
    }`,
    { slug }
  );
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) return notFound();

  if (product.productType === "Dropship") {
    return <DropshipProduct product={product} />;
  }
  if (product.productType === "Digital") {
    return <DigitalProduct product={product} />;
  }

  // Render notFound for unknown product types
  return notFound();
}