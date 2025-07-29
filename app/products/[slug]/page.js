import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity"; // Adjust this import path as needed
import DropshipProduct from "./DropshipProduct";

// Helper to fetch product by slug
async function getProductBySlug(slug) {
  // Adjust the query and fields to match your Sanity schema
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
      colors,
      sizes,
      breadcrumbs,
      reviews,
      relatedProducts[]->{_id, name, slug, images[]{asset->{url}}, price, color}
    }`,
    { slug }
  );
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) return notFound();

  // Only render Dropship template for Dropship products
  if (product.productType === "Dropship") {
    return <DropshipProduct product={product} />;
  }

  // You can add more logic here for other product types, e.g. Digital
  return notFound();
}