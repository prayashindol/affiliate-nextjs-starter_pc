import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import DropshipProduct from "./DropshipProduct";
import DigitalProduct from "./DigitalProduct";

async function getProductBySlug(slug) {
  // Mock data for testing - replace with actual Sanity fetch in production
  const mockProducts = {
    'digital-marketing-ebook': {
      _id: '1',
      title: 'Digital Marketing eBook',
      price: 29.99,
      type: 'digital',
      description: 'Complete guide to digital marketing strategies and tactics. Learn how to grow your business online.',
      details: 'This comprehensive eBook covers all aspects of digital marketing including SEO, social media, email marketing, and paid advertising.',
      highlights: ['150+ pages of content', 'Real-world case studies', 'Actionable strategies', 'Templates and checklists'],
      images: [{ asset: { url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800' } }],
      downloadFiles: [
        { asset: { url: '/sample-ebook.pdf', originalFilename: 'Digital-Marketing-Guide.pdf' } }
      ],
      rating: 4.5
    },
    'affiliate-marketing-course': {
      _id: '2',
      title: 'Affiliate Marketing Course',
      price: 199.99,
      type: 'affiliate',
      description: 'Learn affiliate marketing from industry experts who have generated millions in commissions.',
      details: 'This course includes video lessons, worksheets, and direct access to profitable affiliate programs.',
      highlights: ['20+ hours of video content', 'Live Q&A sessions', 'Private community access', 'Money-back guarantee'],
      images: [{ asset: { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800' } }],
      affiliateLink: 'https://example.com/affiliate-course',
      rating: 4.8
    },
    'business-templates-pack': {
      _id: '3',
      title: 'Business Templates Pack',
      price: 49.99,
      type: 'digital',
      description: 'Professional business document templates to streamline your operations.',
      details: 'Includes contract templates, proposal formats, invoice designs, and more.',
      highlights: ['50+ professional templates', 'Editable formats', 'Legal reviewed', 'Commercial license included'],
      images: [{ asset: { url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800' } }],
      downloadFiles: [
        { asset: { url: '/templates.zip', originalFilename: 'Business-Templates.zip' } }
      ],
      rating: 4.3
    }
  };

  // In production, use this instead:
  // return sanityClient.fetch(
  //   `*[_type == "product" && slug.current == $slug][0]{
  //     _id,
  //     title,
  //     price,
  //     description,
  //     details,
  //     highlights,
  //     "images": images[]{asset->{url}, alt},
  //     type,
  //     downloadFiles[]{asset->{url, originalFilename}},
  //     rating,
  //     relatedProducts[]->{_id, title, slug, images[]{asset->{url}}, price, color}
  //   }`,
  //   { slug }
  // );

  return mockProducts[slug] || null;
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