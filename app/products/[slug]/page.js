import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity"; // Adjust this path as needed
import DropshipProduct from "./DropshipProduct";
import DigitalProduct from "./DigitalProduct";

// Helper to fetch product by slug
async function getProductBySlug(slug) {
  // Adjust fields as needed for your Sanity schema!
  console.log("Fetching product with slug:", slug); // LOG SLUG
  const product = await sanityClient.fetch(
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
  console.log("Fetched product result:", product); // LOG PRODUCT
  return product;
}

export default async function ProductPage({ params }) {
  console.log("Incoming params:", params); // LOG PARAMS
  const product = await getProductBySlug(params.slug);

  if (!product) {
    console.log("Product not found for slug:", params.slug); // LOG NOT FOUND
    return notFound();
  }

  if (product.productType === "Dropship") {
    console.log("Rendering DropshipProduct for:", product.name); // LOG TYPE
    return <DropshipProduct product={product} />;
  }
  if (product.productType === "Digital") {
    console.log("Rendering DigitalProduct for:", product.name); // LOG TYPE
    return <DigitalProduct product={product} />;
  }

  // Render notFound for unknown product types
  console.log("Unknown product type for product:", product); // LOG BAD TYPE
  return notFound();
}