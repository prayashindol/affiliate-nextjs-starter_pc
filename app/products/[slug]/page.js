import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import DropshipProduct from "./DropshipProduct";
import DigitalProduct from "./DigitalProduct";

async function getProductBySlug(slug) {
  console.log("Fetching product with slug:", slug);
  const product = await sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      title,
      price,
      description,
      details,
      highlights,
      "images": images[]{asset->{url}, alt},
      type,
      digitalFileUrl,
      rating,
      relatedProducts[]->{_id, title, slug, images[]{asset->{url}}, price, color}
    }`,
    { slug }
  );
  console.log("Fetched product result:", product);
  return product;
}

export default async function ProductPage({ params }) {
  console.log("Incoming params:", params);
  const product = await getProductBySlug(params.slug);

  if (!product) {
    console.log("Product not found for slug:", params.slug);
    return notFound();
  }

  if (product.type?.toLowerCase() === "dropship") {
    return <DropshipProduct product={product} />;
  }
  if (product.type?.toLowerCase() === "digital") {
    return <DigitalProduct product={product} />;
  }

  console.log("Unknown product type for product:", product);
  return notFound();
}